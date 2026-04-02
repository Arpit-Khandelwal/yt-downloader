const parseBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value === "1" || value.toLowerCase() === "true";
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const appEnv = {
  policyMode: "strict" as const,
  enableFallback: parseBoolean(process.env.ENABLE_FALLBACK, false),
  fallbackWorkerUrl: process.env.FALLBACK_WORKER_URL?.trim() ?? "",
  fallbackMaxJobsPerIpPerDay: parseNumber(process.env.FALLBACK_MAX_JOBS_PER_IP_PER_DAY, 5),
  fallbackMaxEstimatedSizeMb: parseNumber(process.env.FALLBACK_MAX_ESTIMATED_SIZE_MB, 350),
  fallbackJobTtlMinutes: parseNumber(process.env.FALLBACK_JOB_TTL_MINUTES, 30),
  fallbackPollTimeoutMs: parseNumber(process.env.FALLBACK_POLL_TIMEOUT_MS, 4500),
};

export const isFallbackAvailable = (): boolean => {
  return appEnv.enableFallback && Boolean(appEnv.fallbackWorkerUrl);
};
