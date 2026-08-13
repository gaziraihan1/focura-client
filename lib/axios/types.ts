import type { Session } from "next-auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AppSession extends Session {
  backendToken: string;
  backendTokenExpiry: number;
}

export interface AppError {
  message: string;
  status?: number;
  code?: string;
  response?: {
    data?: { code?: string; message?: string };
    status?: number;
  };
}

export interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  params?: Record<string, unknown>;
  /** Request body for methods that support it (e.g. DELETE with re-auth payload). */
  data?: unknown;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  code?: string;
  reason?: string;
  bannedAt?: string;
  retryAfter?: number;
  errors?: { field: string; message: string }[];
  required?: string[];
}

export interface AuthBroadcastEvent {
  type: "refresh-start" | "refresh-complete" | "logout-all";
  tokenExpiry?: number;
  timestamp?: number;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

/** Codes that mean the session is dead and the user must re-login */
export const TERMINAL_AUTH_CODES = new Set([
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "INVALID_TOKEN_TYPE",
  "TOKEN_VERSION_MISMATCH",
  "TOKEN_REVOKED",
  "TOKEN_REPLAY_DETECTED",
  "SESSION_HIJACK_DETECTED",
  "USER_NOT_FOUND",
  "PROOF_EXPIRED",
  "INVALID_PROOF",
  "SESSION_TIMEOUT",
  "NOT_AUTHENTICATED",
]);

/** Codes the interceptor handles internally — don't show a toast for these */
export const INTERCEPTOR_HANDLED_CODES = new Set([
  "TOKEN_EXPIRED",
  "CSRF_VALIDATION_FAILED",
  "REFRESH_IN_PROGRESS",
]);
