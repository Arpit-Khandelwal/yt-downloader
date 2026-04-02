import * as distubeYtdl from "@distube/ytdl-core";
import YtdlCore from "@ybd-project/ytdl-core";
import type { InfoResponse } from "@/lib/types";
import { normalizeVideoInfo } from "@/lib/youtube";

type RawInfo = unknown;

type RawInfoProvider = (url: string) => Promise<RawInfo>;

export interface InfoProviders {
  primary: RawInfoProvider;
  fallback: RawInfoProvider;
}

const defaultProviders: InfoProviders = {
  primary: (url: string) => {
    const extractor = new YtdlCore({
      logDisplay: ["error"],
    });
    return extractor.getFullInfo(url);
  },
  fallback: (url: string) => distubeYtdl.getInfo(url),
};

const hasUsableFormats = (info: InfoResponse): boolean => {
  return info.muxedFormats.length > 0 || (info.audioFormats.length > 0 && info.videoFormats.length > 0);
};

const messageFromError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

export const isValidYouTubeUrl = (url: string): boolean => {
  return YtdlCore.validateURL(url) || distubeYtdl.validateURL(url);
};

export interface ResolvedInfo {
  info: InfoResponse;
  notes: string[];
}

export const resolveVideoInfo = async (
  url: string,
  fallbackEnabled: boolean,
  providers: InfoProviders = defaultProviders
): Promise<ResolvedInfo> => {
  const notes: string[] = [];

  try {
    const primaryRawInfo = await providers.primary(url);
    const primaryInfo = normalizeVideoInfo(primaryRawInfo, url, fallbackEnabled, "@ybd-project/ytdl-core");
    if (hasUsableFormats(primaryInfo)) {
      return {
        info: primaryInfo,
        notes,
      };
    }
    notes.push("primary extractor returned no usable formats");
  } catch (error) {
    notes.push(`primary extractor failed: ${messageFromError(error)}`);
  }

  try {
    const fallbackRawInfo = await providers.fallback(url);
    const fallbackInfo = normalizeVideoInfo(fallbackRawInfo, url, fallbackEnabled, "@distube/ytdl-core");
    if (hasUsableFormats(fallbackInfo)) {
      return {
        info: fallbackInfo,
        notes,
      };
    }
    notes.push("fallback extractor returned no usable formats");
  } catch (error) {
    notes.push(`fallback extractor failed: ${messageFromError(error)}`);
  }

  throw new Error(`No usable downloadable formats were extracted. ${notes.join(" | ")}`);
};
