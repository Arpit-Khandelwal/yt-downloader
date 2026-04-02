import { randomUUID } from "node:crypto";
import { appEnv } from "@/lib/env";
import { logEvent } from "@/lib/logger";
import {
  fallbackWorkerStartResponseSchema,
  fallbackWorkerStatusSchema,
  type FallbackJobRequestInput,
} from "@/lib/schemas";
import type { DownloadJob, FallbackJobRequest } from "@/lib/types";

interface StoredJob extends DownloadJob {
  ip: string;
  payload: FallbackJobRequest;
  remoteJobId?: string;
}

interface QuotaEntry {
  date: string;
  count: number;
}

interface StoreState {
  jobs: Map<string, StoredJob>;
  quotas: Map<string, QuotaEntry>;
}

const getState = (): StoreState => {
  const globalStore = globalThis as typeof globalThis & {
    __ytFallbackState?: StoreState;
  };

  if (!globalStore.__ytFallbackState) {
    globalStore.__ytFallbackState = {
      jobs: new Map<string, StoredJob>(),
      quotas: new Map<string, QuotaEntry>(),
    };
  }

  return globalStore.__ytFallbackState;
};

const nowIso = (): string => new Date().toISOString();

const toWorkerBaseUrl = (): string => appEnv.fallbackWorkerUrl.replace(/\/$/, "");

const mapStoredJobToPublic = (job: StoredJob): DownloadJob => ({
  jobId: job.jobId,
  status: job.status,
  progressPct: job.progressPct,
  downloadUrl: job.downloadUrl,
  errorCode: job.errorCode,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
  expiresAt: job.expiresAt,
});

const updateStoredJob = (jobId: string, patch: Partial<StoredJob>): StoredJob | null => {
  const state = getState();
  const current = state.jobs.get(jobId);

  if (!current) {
    return null;
  }

  const next: StoredJob = {
    ...current,
    ...patch,
    updatedAt: nowIso(),
  };

  state.jobs.set(jobId, next);
  return next;
};

export const cleanupExpiredFallbackJobs = (): void => {
  const state = getState();
  const now = Date.now();

  for (const [jobId, job] of state.jobs.entries()) {
    if (Date.parse(job.expiresAt) <= now) {
      state.jobs.delete(jobId);
    }
  }
};

export const consumeFallbackQuota = (ip: string): { allowed: true } | { allowed: false; remaining: number } => {
  const state = getState();
  const today = new Date().toISOString().slice(0, 10);
  const current = state.quotas.get(ip);

  if (!current || current.date !== today) {
    state.quotas.set(ip, { date: today, count: 1 });
    return { allowed: true };
  }

  if (current.count >= appEnv.fallbackMaxJobsPerIpPerDay) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  state.quotas.set(ip, { ...current, count: current.count + 1 });
  return { allowed: true };
};

export const createFallbackJob = (request: FallbackJobRequestInput, ip: string): DownloadJob => {
  const state = getState();
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + appEnv.fallbackJobTtlMinutes * 60 * 1000).toISOString();
  const jobId = randomUUID();

  const job: StoredJob = {
    jobId,
    ip,
    payload: request,
    status: "queued",
    progressPct: 0,
    createdAt,
    updatedAt: createdAt,
    expiresAt,
  };

  state.jobs.set(jobId, job);
  return mapStoredJobToPublic(job);
};

export const getFallbackJob = (jobId: string): DownloadJob | null => {
  const state = getState();
  const job = state.jobs.get(jobId);
  return job ? mapStoredJobToPublic(job) : null;
};

export const getFallbackJobInternal = (jobId: string): StoredJob | null => {
  const state = getState();
  return state.jobs.get(jobId) ?? null;
};

export const markFallbackJobFailed = (jobId: string, errorCode: string): DownloadJob | null => {
  const updated = updateStoredJob(jobId, {
    status: "failed",
    progressPct: 100,
    errorCode,
  });

  return updated ? mapStoredJobToPublic(updated) : null;
};

export const updateFallbackJobProgress = (
  jobId: string,
  patch: Partial<Pick<StoredJob, "status" | "progressPct" | "downloadUrl" | "errorCode" | "remoteJobId">>
): DownloadJob | null => {
  const updated = updateStoredJob(jobId, patch);
  return updated ? mapStoredJobToPublic(updated) : null;
};

export const startFallbackJobWithWorker = async (jobId: string): Promise<DownloadJob | null> => {
  const job = getFallbackJobInternal(jobId);

  if (!job) {
    return null;
  }

  const baseUrl = toWorkerBaseUrl();

  if (!baseUrl) {
    logEvent("warn", "fallback.worker.missing", { jobId });
    return markFallbackJobFailed(jobId, "fallback_worker_not_configured");
  }

  updateFallbackJobProgress(jobId, {
    status: "processing",
    progressPct: 10,
  });

  try {
    const response = await fetch(`${baseUrl}/jobs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...job.payload,
        clientJobId: jobId,
      }),
    });

    if (!response.ok) {
      logEvent("error", "fallback.worker.start_failed", {
        jobId,
        status: response.status,
      });
      return markFallbackJobFailed(jobId, "fallback_worker_start_failed");
    }

    const parsed = fallbackWorkerStartResponseSchema.safeParse(await response.json());

    if (!parsed.success) {
      logEvent("error", "fallback.worker.start_invalid_payload", {
        jobId,
        issues: parsed.error.issues,
      });
      return markFallbackJobFailed(jobId, "fallback_worker_invalid_response");
    }

    const workerResponse = parsed.data;

    return updateFallbackJobProgress(jobId, {
      remoteJobId: workerResponse.jobId,
      status: workerResponse.status,
      progressPct: workerResponse.progressPct ?? 20,
      downloadUrl: workerResponse.downloadUrl,
      errorCode: workerResponse.errorCode,
    });
  } catch (error) {
    logEvent("error", "fallback.worker.start_exception", {
      jobId,
      message: error instanceof Error ? error.message : "unknown_error",
    });
    return markFallbackJobFailed(jobId, "fallback_worker_request_failed");
  }
};

export const syncFallbackJobWithWorker = async (jobId: string): Promise<DownloadJob | null> => {
  const job = getFallbackJobInternal(jobId);

  if (!job) {
    return null;
  }

  if (job.status === "completed" || job.status === "failed") {
    return mapStoredJobToPublic(job);
  }

  if (!job.remoteJobId) {
    return mapStoredJobToPublic(job);
  }

  const baseUrl = toWorkerBaseUrl();

  if (!baseUrl) {
    return markFallbackJobFailed(jobId, "fallback_worker_not_configured");
  }

  try {
    const response = await fetch(`${baseUrl}/jobs/${encodeURIComponent(job.remoteJobId)}`, {
      method: "GET",
      signal: AbortSignal.timeout(appEnv.fallbackPollTimeoutMs),
    });

    if (!response.ok) {
      logEvent("warn", "fallback.worker.poll_failed", {
        jobId,
        remoteJobId: job.remoteJobId,
        status: response.status,
      });
      return mapStoredJobToPublic(job);
    }

    const parsed = fallbackWorkerStatusSchema.safeParse(await response.json());

    if (!parsed.success) {
      logEvent("warn", "fallback.worker.poll_invalid_payload", {
        jobId,
        remoteJobId: job.remoteJobId,
      });
      return mapStoredJobToPublic(job);
    }

    const payload = parsed.data;

    return updateFallbackJobProgress(jobId, {
      status: payload.status,
      progressPct: payload.progressPct,
      downloadUrl: payload.downloadUrl,
      errorCode: payload.errorCode,
    });
  } catch (error) {
    logEvent("warn", "fallback.worker.poll_exception", {
      jobId,
      remoteJobId: job.remoteJobId,
      message: error instanceof Error ? error.message : "unknown_error",
    });
    return mapStoredJobToPublic(job);
  }
};

export const isFallbackRequestTooLarge = (estimatedSizeBytes?: number): boolean => {
  if (!estimatedSizeBytes || estimatedSizeBytes <= 0) {
    return false;
  }

  const estimatedMb = estimatedSizeBytes / (1024 * 1024);
  return estimatedMb > appEnv.fallbackMaxEstimatedSizeMb;
};
