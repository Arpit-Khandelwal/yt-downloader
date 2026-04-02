import type { NextApiRequest, NextApiResponse } from "next";
import { isFallbackAvailable } from "@/lib/env";
import { sendApiError } from "@/lib/api";
import { logEvent } from "@/lib/logger";
import { infoQuerySchema } from "@/lib/schemas";
import { isValidYouTubeUrl, resolveVideoInfo } from "@/lib/info-service";
import type { ApiError, InfoResponse } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InfoResponse | ApiError>
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    sendApiError(res, 405, "method_not_allowed", "Use GET for this endpoint.");
    return;
  }

  const parsedQuery = infoQuerySchema.safeParse({
    url: typeof req.query.url === "string" ? req.query.url.trim() : "",
  });

  if (!parsedQuery.success) {
    sendApiError(
      res,
      400,
      "validation_failed",
      "A valid YouTube URL is required.",
      parsedQuery.error.issues
    );
    return;
  }

  const url = parsedQuery.data.url;

  if (!isValidYouTubeUrl(url)) {
    sendApiError(res, 400, "invalid_url", "The provided URL is not a valid YouTube video URL.");
    return;
  }

  try {
    const { info, notes } = await resolveVideoInfo(url, isFallbackAvailable());

    logEvent("info", "api.info.success", {
      videoId: info.video.id,
      title: info.video.title,
      extractor: info.flags.extractor,
      muxedFormats: info.muxedFormats.length,
      adaptiveFormats: info.videoFormats.length,
    });

    if (notes.length > 0) {
      logEvent("warn", "api.info.fallback_note", {
        url,
        notes,
      });
    }

    res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
    res.status(200).json(info);
  } catch (error) {
    logEvent("error", "api.info.failed", {
      url,
      message: error instanceof Error ? error.message : "unknown_error",
    });

    sendApiError(
      res,
      502,
      "extractor_failure",
      "Failed to fetch video metadata from the upstream extractor."
    );
  }
}
