import type { StrategyDecision, StrategyRequest } from "@/lib/types";

const MB = 1024 * 1024;

const STRATEGY_LIMITS = {
  maxClientBytes: 220 * MB,
  maxMobileClientBytes: 120 * MB,
  lowMemoryThresholdGb: 4,
  lowCpuThreads: 4,
  lowTierMaxBytes: 90 * MB,
};

const estimateMb = (estimatedSizeBytes?: number): number | null => {
  if (!estimatedSizeBytes || estimatedSizeBytes <= 0) {
    return null;
  }

  return estimatedSizeBytes / MB;
};

export const decideDownloadMode = (
  request: StrategyRequest,
  options: { fallbackEnabled: boolean }
): StrategyDecision => {
  const reasons: string[] = [];
  const { capabilityProfile, selection } = request;
  const estimatedSizeBytes = selection.estimatedSizeBytes ?? 0;
  const estimatedSizeMb = estimateMb(estimatedSizeBytes);

  if (selection.muxedItag) {
    reasons.push("Progressive muxed format is available; direct download is cheapest and most reliable.");
    return {
      mode: "direct",
      reasons,
    };
  }

  if (!capabilityProfile.wasm) {
    reasons.push("WebAssembly is unavailable on this device/browser.");
    return {
      mode: "server_fallback",
      reasons,
    };
  }

  if (!selection.audioItag || !selection.videoItag) {
    reasons.push("Separate audio/video itags were not both provided for client muxing.");
    return {
      mode: "server_fallback",
      reasons,
    };
  }

  if (estimatedSizeBytes > STRATEGY_LIMITS.maxClientBytes) {
    reasons.push("Estimated media size exceeds safe client merge threshold.");
    return {
      mode: "server_fallback",
      reasons,
    };
  }

  if (capabilityProfile.isMobile && estimatedSizeBytes > STRATEGY_LIMITS.maxMobileClientBytes) {
    reasons.push("Mobile device detected with a large merge workload.");
    return {
      mode: "server_fallback",
      reasons,
    };
  }

  if (
    capabilityProfile.deviceMemoryGb !== null &&
    capabilityProfile.deviceMemoryGb < STRATEGY_LIMITS.lowMemoryThresholdGb &&
    estimatedSizeBytes > STRATEGY_LIMITS.lowTierMaxBytes
  ) {
    reasons.push("Low memory device and workload likely to trigger browser OOM during wasm merge.");
    return {
      mode: "server_fallback",
      reasons,
    };
  }

  if (
    capabilityProfile.hardwareConcurrency !== null &&
    capabilityProfile.hardwareConcurrency < STRATEGY_LIMITS.lowCpuThreads &&
    estimatedSizeBytes > STRATEGY_LIMITS.lowTierMaxBytes
  ) {
    reasons.push("Low CPU concurrency detected for this merge size.");
    return {
      mode: "server_fallback",
      reasons,
    };
  }

  if (
    capabilityProfile.storageEstimateMb !== null &&
    estimatedSizeMb !== null &&
    estimatedSizeMb > capabilityProfile.storageEstimateMb * 0.6
  ) {
    reasons.push("Insufficient available storage quota for browser-side merge.");
    return {
      mode: "server_fallback",
      reasons,
    };
  }

  if (!options.fallbackEnabled) {
    reasons.push("Fallback service is disabled; using client wasm merge path.");
  } else {
    reasons.push("Device capability is sufficient for client wasm merge.");
  }

  return {
    mode: "client_wasm",
    reasons,
  };
};
