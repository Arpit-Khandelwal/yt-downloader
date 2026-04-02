import type { NextApiRequest, NextApiResponse } from "next";
import { parseJsonBody, sendApiError, getClientIp } from "@/lib/api";
import { appEnv, isFallbackAvailable } from "@/lib/env";
import {
  cleanupExpiredFallbackJobs,
  consumeFallbackQuota,
  createFallbackJob,
  isFallbackRequestTooLarge,
  startFallbackJobWithWorker,
} from "@/lib/fallback";
import { logEvent } from "@/lib/logger";
import { fallbackJobRequestSchema } from "@/lib/schemas";
import type { ApiError, DownloadJob } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pick<DownloadJob, "jobId" | "status"> | ApiError>
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendApiError(res, 405, "method_not_allowed", "Use POST for this endpoint.");
    return;
  }

  cleanupExpiredFallbackJobs();

  if (!appEnv.enableFallback) {
    sendApiError(res, 503, "fallback_disabled", "Server fallback is disabled by feature flag.");
    return;
  }

  if (!isFallbackAvailable()) {
    sendApiError(
      res,
      503,
      "fallback_worker_unavailable",
      "Fallback worker is not configured. Set FALLBACK_WORKER_URL to enable this flow."
    );
    return;
  }

  let rawBody: unknown;

  try {
    rawBody = parseJsonBody(req);
  } catch {
    sendApiError(res, 400, "invalid_json", "Body must be valid JSON.");
    return;
  }

  const parsed = fallbackJobRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    sendApiError(res, 400, "validation_failed", "Invalid fallback job payload.", parsed.error.issues);
    return;
  }

  if (isFallbackRequestTooLarge(parsed.data.estimatedSizeBytes)) {
    sendApiError(
      res,
      413,
      "fallback_size_limit",
      `Estimated file size exceeds fallback limit (${appEnv.fallbackMaxEstimatedSizeMb} MB).`
    );
    return;
  }

  const ip = getClientIp(req);
  const quotaResult = consumeFallbackQuota(ip);

  if (!quotaResult.allowed) {
    sendApiError(
      res,
      429,
      "fallback_quota_exceeded",
      `Daily fallback quota reached for this client IP (${appEnv.fallbackMaxJobsPerIpPerDay}/day).`
    );
    return;
  }

  const job = createFallbackJob(parsed.data, ip);
  const startedJob = await startFallbackJobWithWorker(job.jobId);

  logEvent("info", "api.fallback.job_created", {
    jobId: job.jobId,
    ip,
    output: parsed.data.output,
  });

  res.status(200).json({
    jobId: job.jobId,
    status: startedJob?.status ?? "queued",
  });
}
