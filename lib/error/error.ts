import { normalizeError } from "@/lib/axios";

export function getErrorMessage(error: unknown, fallback: string) {
  const normalized = normalizeError(error);
  return normalized.message || fallback;
}