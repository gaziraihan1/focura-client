import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { getSession, signOut } from "next-auth/react";
import { logout } from "./auth/logout";
import type { Session } from "next-auth";
import { getCsrfToken, invalidateCsrfToken } from "./csrf";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

interface AppSession extends Session {
  backendToken: string;
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
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  code?: string;
  reason?: string;
  bannedAt?: string;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

/** Codes that mean the session is dead and the user must re-login */
const TERMINAL_AUTH_CODES = new Set([
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "INVALID_TOKEN_TYPE",
  "TOKEN_VERSION_MISMATCH",
  "TOKEN_REVOKED",
  "SESSION_HIJACK_DETECTED",
  "USER_NOT_FOUND",
]);

/** Codes the interceptor handles internally — don't show a toast for these */
const INTERCEPTOR_HANDLED_CODES = new Set([
  "TOKEN_EXPIRED",
  "CSRF_VALIDATION_FAILED",
  "TOKEN_REPLAY_DETECTED",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function normalizeError(error: unknown): AppError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.response?.data?.code,
    };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "Unknown error" };
}

let sessionPromise: Promise<AppSession | null> | null = null;
async function getFreshSession(): Promise<AppSession | null> {
  if (!sessionPromise) {
    sessionPromise = getSession().finally(() => {
      sessionPromise = null;
    }) as Promise<AppSession | null>;
  }
  return sessionPromise;
}

/** Awaits both NextAuth sign-out and backend logout, then redirects */
async function forceLogout(reason = "Session expired. Please login again."): Promise<never> {
  toast.error(reason);
  await Promise.allSettled([
    logout(),
    signOut({ callbackUrl: "/authentication/login" }),
  ]);
  // signOut will redirect; this return is just for TS
  return Promise.reject(new Error("SESSION_EXPIRED"));
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ─── Token cache ──────────────────────────────────────────────────────────────

const TOKEN_CACHE_TTL = 10 * 60 * 1000;
let cachedBackendToken: string | null = null;
let cachedTokenExpiry = 0;

function invalidateTokenCache(): void {
  cachedBackendToken = null;
  cachedTokenExpiry = 0;
}

// ─── Request interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const now = Date.now();

    if (!cachedBackendToken || now > cachedTokenExpiry) {
      const session = await getFreshSession();
      cachedBackendToken = session?.backendToken ?? null;
      cachedTokenExpiry = cachedBackendToken ? now + TOKEN_CACHE_TTL : 0;
    }

    if (cachedBackendToken) {
      config.headers.Authorization = `Bearer ${cachedBackendToken}`;
    }

    if (config.method && !["get", "head", "options"].includes(config.method.toLowerCase())) {
      const csrfToken = await getCsrfToken();
      if (csrfToken) config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────────
// Owns: retry logic for recoverable errors (TOKEN_EXPIRED, CSRF, TOKEN_REPLAY).
// Does NOT toast or call logout — that's handleAxiosError's job.

type RetryConfig = InternalAxiosRequestConfig & {
  _retried?: boolean;
  _csrfRetried?: boolean;
  _replayRetried?: boolean;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const code = error.response?.data?.code;
    const config = error.config as RetryConfig;

    // ── TOKEN_EXPIRED: attempt session refresh then retry once ────────────────
    if (code === "TOKEN_EXPIRED" && config && !config._retried) {
      config._retried = true;
      invalidateTokenCache();

      const session = await getFreshSession();
      const token = session?.backendToken;

      if (token) {
        cachedBackendToken = token;
        cachedTokenExpiry = Date.now() + TOKEN_CACHE_TTL;
        config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(config);
      }

      // Refresh yielded no token — fall through to handleAxiosError as a
      // terminal auth error (TOKEN_EXPIRED will trigger forceLogout there)
      return Promise.reject(error);
    }

    // ── CSRF_VALIDATION_FAILED: refresh CSRF token then retry once ────────────
    if (code === "CSRF_VALIDATION_FAILED" && config && !config._csrfRetried) {
      config._csrfRetried = true;
      invalidateCsrfToken();

      const csrfToken = await getCsrfToken(true);
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
        return axiosInstance(config);
      }
    }

    // ── TOKEN_REPLAY_DETECTED: refresh session then retry once ────────────────
    if (code === "TOKEN_REPLAY_DETECTED" && config && !config._replayRetried) {
      config._replayRetried = true;
      invalidateTokenCache();

      const session = await getFreshSession();
      const token = session?.backendToken;

      if (token) {
        cachedBackendToken = token;
        cachedTokenExpiry = Date.now() + TOKEN_CACHE_TTL;
        config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(config);
      }

      // No token after replay detection — terminal, fall through
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// ─── Error display handler ────────────────────────────────────────────────────
// Called after the interceptor has exhausted retries.
// Owns: toasts, forced logout for terminal auth failures.

const handleAxiosError = async (
  error: AxiosError<ApiErrorResponse>,
  showErrorToast = true,
): Promise<never> => {
  const status = error.response?.status;
  const data = error.response?.data;
  const code = data?.code;
  const message = data?.message || error.message || "Unknown error";

  // ── Terminal auth failures → force logout ─────────────────────────────────
  if (code && TERMINAL_AUTH_CODES.has(code)) {
    return forceLogout(
      code === "ACCOUNT_BANNED"
        ? `Your account has been suspended${data?.reason ? `: ${data.reason}` : ""}.`
        : "Session expired. Please login again.",
    );
  }

  // ── Account / access errors with dedicated messages ───────────────────────
  if (code === "ACCOUNT_BANNED") {
    return forceLogout(`Your account has been suspended${data?.reason ? `: ${data.reason}` : ""}.`);
  }

  if (code === "EMAIL_NOT_VERIFIED") {
    toast.error("Please verify your email address before continuing.");
    return Promise.reject(error);
  }

  // ── Skip toast for: interceptor-handled codes, analytics, or caller opt-out
  const url = error.config?.url ?? "";
  const suppressToast =
    !showErrorToast ||
    (code && INTERCEPTOR_HANDLED_CODES.has(code)) ||
    url.includes("/analytics/");

  if (suppressToast) return Promise.reject(error);

  // ── Status-based toast messages ───────────────────────────────────────────
  switch (status) {
    case 403:
      toast.error(message || "You don't have permission to do that.");
      break;
    case 404:
      // 404s are usually handled inline by the caller — don't toast by default
      break;
    case 429:
      toast.error(message || "Too many requests. Please try again later.");
      break;
    case 500:
    default:
      if (status && status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (status && status >= 400) {
        toast.error(message);
      }
  }

  return Promise.reject(error);
};

// ─── Public API ───────────────────────────────────────────────────────────────

const mergeHeaders = (_options?: ApiOptions, extra?: Record<string, string>) => ({ ...extra });

export const api = {
  get: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance
      .get<ApiResponse<T>>(endpoint, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  post: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiOptions) => {
    const res = await axiosInstance
      .post<ApiResponse<T>>(endpoint, data, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  put: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiOptions) => {
    const res = await axiosInstance
      .put<ApiResponse<T>>(endpoint, data, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  patch: async <T = unknown>(endpoint: string, data?: unknown, options?: ApiOptions) => {
    const res = await axiosInstance
      .patch<ApiResponse<T>>(endpoint, data, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  delete: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance
      .delete<ApiResponse<T>>(endpoint, { headers: mergeHeaders(options) })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },

  upload: async <T = unknown>(endpoint: string, formData: FormData, options?: ApiOptions) => {
    const res = await axiosInstance
      .post<ApiResponse<T>>(endpoint, formData, {
        headers: mergeHeaders(options, { "Content-Type": "multipart/form-data" }),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message) toast.success(res.data.message);
    return res?.data;
  },
};

export default axiosInstance;