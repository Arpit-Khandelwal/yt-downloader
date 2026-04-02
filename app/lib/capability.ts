import type { CapabilityProfile } from "@/lib/types";

const getDeviceMemory = (): number | null => {
  const nav = navigator as Navigator & { deviceMemory?: number };

  if (typeof nav.deviceMemory === "number") {
    return nav.deviceMemory;
  }

  return null;
};

const getHardwareConcurrency = (): number | null => {
  if (typeof navigator.hardwareConcurrency === "number") {
    return navigator.hardwareConcurrency;
  }

  return null;
};

const detectMobile = (): boolean => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const getStorageEstimateMb = async (): Promise<number | null> => {
  if (!navigator.storage?.estimate) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();

    if (typeof estimate.quota === "number") {
      return estimate.quota / (1024 * 1024);
    }

    return null;
  } catch {
    return null;
  }
};

export const collectCapabilityProfile = async (): Promise<CapabilityProfile> => {
  const storageEstimateMb = await getStorageEstimateMb();

  return {
    wasm: typeof WebAssembly !== "undefined",
    sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
    crossOriginIsolated: typeof window.crossOriginIsolated === "boolean" ? window.crossOriginIsolated : false,
    deviceMemoryGb: getDeviceMemory(),
    hardwareConcurrency: getHardwareConcurrency(),
    storageEstimateMb,
    isMobile: detectMobile(),
    userAgent: navigator.userAgent,
  };
};
