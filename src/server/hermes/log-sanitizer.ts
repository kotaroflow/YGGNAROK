const MAX_LOG_ERROR_CHARS = 2000;
const TRUNCATED_SUFFIX = "...[truncated]";
const WINDOWS_PATH_PATTERN = /[A-Za-z]:\\[^\s"'<>|]+/g;
const AUTH_HEADER_PATTERN = /(authorization\s*[:=]\s*)(bearer\s+)?[^\s,;]+/gi;
const BEARER_PATTERN = /\bbearer\s+[A-Za-z0-9._~+/-]+=*/gi;
const SECRET_ASSIGNMENT_PATTERN =
  /([A-Z0-9_]*?(?:api[_-]?key|token|password|senha|secret))\b\s*[:=]\s*("[^"]*"|'[^']*'|[^\s,;]+)/gi;

function collapseStackTraceLines(value: string) {
  const lines = value.split(/\r?\n/);
  const kept: string[] = [];
  let skippedStackLines = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const isStackLine =
      trimmed.startsWith("at ") ||
      trimmed.includes("Traceback") ||
      /^File ".*", line \d+/i.test(trimmed);

    if (isStackLine) {
      skippedStackLines += 1;
      if (skippedStackLines === 1) {
        kept.push("[stack trace redacted]");
      }
      continue;
    }

    kept.push(line);
  }

  return kept.join("\n");
}

export function sanitizeHermesLogError(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return value;
  }

  const sanitized = collapseStackTraceLines(value)
    .replace(AUTH_HEADER_PATTERN, "$1[redacted]")
    .replace(BEARER_PATTERN, "Bearer [redacted]")
    .replace(SECRET_ASSIGNMENT_PATTERN, "$1=[redacted]")
    .replace(WINDOWS_PATH_PATTERN, "[local-path]")
    .trim();

  if (sanitized.length <= MAX_LOG_ERROR_CHARS) {
    return sanitized;
  }

  return `${sanitized.slice(0, MAX_LOG_ERROR_CHARS - TRUNCATED_SUFFIX.length)}${TRUNCATED_SUFFIX}`;
}
