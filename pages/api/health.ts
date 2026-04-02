import type { NextApiRequest, NextApiResponse } from "next";
import { appEnv, isFallbackAvailable } from "@/lib/env";

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    policyMode: appEnv.policyMode,
    extractor: "@ybd-project/ytdl-core",
    fallbackEnabled: appEnv.enableFallback,
    fallbackWorkerConfigured: Boolean(appEnv.fallbackWorkerUrl),
    fallbackAvailable: isFallbackAvailable(),
  });
}
