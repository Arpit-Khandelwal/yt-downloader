import type { NextApiRequest, NextApiResponse } from "next";
import { parseJsonBody, sendApiError } from "@/lib/api";
import { isFallbackAvailable } from "@/lib/env";
import { logEvent } from "@/lib/logger";
import { strategyRequestSchema } from "@/lib/schemas";
import { decideDownloadMode } from "@/lib/strategy";
import type { ApiError, StrategyDecision, StrategyRequest } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StrategyDecision | ApiError>
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendApiError(res, 405, "method_not_allowed", "Use POST for this endpoint.");
    return;
  }

  let parsedBody: unknown;

  try {
    parsedBody = parseJsonBody<unknown>(req);
  } catch {
    sendApiError(res, 400, "invalid_json", "Body must be valid JSON.");
    return;
  }

  const parsed = strategyRequestSchema.safeParse(parsedBody);

  if (!parsed.success) {
    sendApiError(res, 400, "validation_failed", "Invalid strategy request payload.", parsed.error.issues);
    return;
  }

  const request = parsed.data as StrategyRequest;
  const decision = decideDownloadMode(request, {
    fallbackEnabled: isFallbackAvailable(),
  });

  logEvent("info", "api.strategy.decision", {
    mode: decision.mode,
    estimatedSizeBytes: request.selection.estimatedSizeBytes ?? null,
    fallbackEnabled: isFallbackAvailable(),
  });

  res.status(200).json(decision);
}
