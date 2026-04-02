export type LogLevel = "info" | "warn" | "error";

export const logEvent = (level: LogLevel, event: string, payload?: Record<string, unknown>): void => {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...(payload ?? {}),
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
};
