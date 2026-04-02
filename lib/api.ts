import type { NextApiRequest, NextApiResponse } from "next";
import type { ApiError } from "@/lib/types";

export const parseJsonBody = <T>(req: NextApiRequest): T => {
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as T;
  }

  return req.body as T;
};

export const sendApiError = (
  res: NextApiResponse,
  statusCode: number,
  error: string,
  message: string,
  details?: unknown
): void => {
  res.status(statusCode).json({ error, message, details } satisfies ApiError);
};

export const getClientIp = (req: NextApiRequest): string => {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0] ?? "unknown";
  }

  return req.socket.remoteAddress ?? "unknown";
};
