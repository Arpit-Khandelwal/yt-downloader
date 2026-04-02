import type {
  DownloadJob,
  FallbackJobRequest,
  InfoResponse,
  StrategyDecision,
  StrategyRequest,
} from "@/lib/types";

interface ApiErrorPayload {
  error?: string;
  message?: string;
  details?: unknown;
}

export class ApiClientError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const DEFAULT_TIMEOUT_MS = 20_000;

const buildTimeoutSignal = (timeoutMs: number): { signal: AbortSignal; cancel: () => void } => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return {
    signal: controller.signal,
    cancel: () => window.clearTimeout(timer),
  };
};

const toApiClientError = (
  payload: ApiErrorPayload | null,
  status: number,
  fallbackMessage: string
): ApiClientError => {
  return new ApiClientError(
    payload?.message || fallbackMessage,
    status,
    payload?.error || "request_failed",
    payload?.details
  );
};

const parseJsonResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

const requestJson = async <T>(
  input: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> => {
  const { signal, cancel } = buildTimeoutSignal(timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal,
    });

    const payload = (await parseJsonResponse(response)) as ApiErrorPayload | null;

    if (!response.ok) {
      throw toApiClientError(payload, response.status, `Request failed (${response.status}).`);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError("Request timed out. Please retry.", 408, "request_timeout");
    }

    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : "Unexpected request failure",
      500,
      "unexpected_client_error"
    );
  } finally {
    cancel();
  }
};

export const downloaderApi = {
  fetchInfo(url: string): Promise<InfoResponse> {
    return requestJson<InfoResponse>(`/api/info?url=${encodeURIComponent(url)}`, {
      method: "GET",
    });
  },

  decideStrategy(payload: StrategyRequest): Promise<StrategyDecision> {
    return requestJson<StrategyDecision>("/api/strategy/decide", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },

  createFallbackJob(
    payload: FallbackJobRequest
  ): Promise<Pick<DownloadJob, "jobId" | "status">> {
    return requestJson<Pick<DownloadJob, "jobId" | "status">>("/api/fallback/jobs", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },

  getFallbackJob(jobId: string): Promise<DownloadJob> {
    return requestJson<DownloadJob>(`/api/fallback/jobs/${encodeURIComponent(jobId)}`, {
      method: "GET",
    });
  },
};
