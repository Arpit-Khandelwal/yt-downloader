import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  res.status(410).json({
    error: "deprecated_endpoint",
    message:
      "The /api/download endpoint is deprecated. Use /api/info, /api/strategy/decide, and /api/fallback/jobs instead.",
  });
}
