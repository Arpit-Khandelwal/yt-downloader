import type { NextApiRequest, NextApiResponse } from "next";
import { cleanupExpiredFallbackJobs, getFallbackJob, syncFallbackJobWithWorker } from "@/lib/fallback";
import { sendApiError } from "@/lib/api";
import type { ApiError, DownloadJob } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DownloadJob | ApiError>
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    sendApiError(res, 405, "method_not_allowed", "Use GET for this endpoint.");
    return;
  }

  cleanupExpiredFallbackJobs();

  const jobId = typeof req.query.jobId === "string" ? req.query.jobId : "";

  if (!jobId) {
    sendApiError(res, 400, "invalid_request", "Missing fallback job ID.");
    return;
  }

  const job = getFallbackJob(jobId);

  if (!job) {
    sendApiError(res, 404, "job_not_found", "Fallback job does not exist or expired.");
    return;
  }

  const synced = await syncFallbackJobWithWorker(jobId);

  if (!synced) {
    sendApiError(res, 404, "job_not_found", "Fallback job does not exist or expired.");
    return;
  }

  res.status(200).json(synced);
}
