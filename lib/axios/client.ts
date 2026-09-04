import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { getCsrfToken, invalidateCsrfToken } from "../csrf";
import { axiosInstance } from "./instance";
import {
  cachedBackendToken,
  cachedTokenExpiry,
  getFreshSession,
  invalidateTokenCache,
  isRefreshing,
  queueRequest,
  refreshPromise,
  setCachedBackendToken,
  startTokenRefresh,
} from "./refresh";
import {
  forceLogout,
  initializeBackgroundRefresh,
  updateActivity,
} from "./session";
import {
  ApiErrorResponse,
  ApiOptions,
  ApiResponse,
  AppError,
  AppSession,
  INTERCEPTOR_HANDLED_CODES,
  TERMINAL_AUTH_CODES,
} from "./types";

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

// ─── Response-envelope normalization ──────────────────────────────────────────
// The backend guarantees every success body is shaped:
//   { success: boolean, data?: T, message?: string, pagination?: {...} }
// (verified across all src/modules/** controllers in Gablura-backend — no raw
// arrays are ever returned). `unwrap` is the SINGLE place that knows this
// contract; hooks and components must not re-implement envelope sniffing.

export function unwrap<T = unknown>(response: unknown): T {
  if (
    response !== null &&
    typeof response === "object" &&
    "success" in response &&
    "data" in response &&
    (response as { data?: unknown }).data !== undefined
  ) {
    return (response as { data: T }).data;
  }
  // Defensive fallback for already-unwrapped payloads or data-less envelopes.
  return response as T;
}

/** Like {@link unwrap} but guarantees an array result for list endpoints. */
export function unwrapList<T = unknown>(response: unknown): T[] {
  const data = unwrap<T[]>(response);
  return Array.isArray(data) ? data : [];
}

// ─── Request interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const now = Date.now();

    if (!cachedBackendToken || now > cachedTokenExpiry) {
      const session = await getFreshSession();
      setCachedBackendToken(session?.backendToken ?? null, now);

      // Initialize background refresh & session timers if we have token expiry info
      if (session?.backendTokenExpiry) {
        initializeBackgroundRefresh(session.backendTokenExpiry);
      }
    }

    // Update activity timestamp on each request
    updateActivity();

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
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const code = error.response?.data?.code;
    const config = error.config as RetryConfig;

    // ── TOKEN_EXPIRED: attempt session refresh then retry once ────────────────
    if (code === "TOKEN_EXPIRED" && config && !config._retried) {
      config._retried = true;
      const failedToken = extractBearerToken(config.headers?.Authorization);
      invalidateTokenCache();

      // If a refresh is already in progress, queue this request
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await queueRequest();
          config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(config);
        } catch {
          // Refresh failed while queued — let handleAxiosError decide whether
          // the session is truly dead (forceLogout) or it was a transient blip
          // (stay logged in).
          return handleRefreshOutcome(error);
        }
      }

      // Start refresh (or join existing)
      await startTokenRefresh(failedToken);

      // Check if refresh succeeded by looking for a valid token
      const session = await getFreshSession();
      const token = session?.backendToken;
      if (token && token !== failedToken) {
        setCachedBackendToken(token);
        config.headers.Authorization = `Bearer ${token}`;

        // Reinitialize background refresh with new expiry
        if (session?.backendTokenExpiry) {
          initializeBackgroundRefresh(session.backendTokenExpiry);
        }

        return axiosInstance(config);
      }

      // Refresh did not rotate the token — rejectRequestQueue already fired.
      return handleRefreshOutcome(error);
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

    return Promise.reject(error);
  },
);

// ─── Refresh-outcome helpers ──────────────────────────────────────────────────
// Decides whether a failed refresh is a genuinely dead session (force logout)
// or a transient blip (stay logged in — the next request will retry refresh).

function extractBearerToken(authHeader: unknown): string | null {
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7).trim();
}

function isSessionDead(session: AppSession | null): boolean {
  return (
    !session ||
    session.error === "SESSION_EXPIRED" ||
    !session.backendToken ||
    session.backendToken.length <= 10
  );
}

/**
 * After a failed TOKEN_EXPIRED refresh:
 *  - truly dead session (refresh token expired/cleared) → reject normally so
 *    handleAxiosError forceLogouts;
 *  - session still has a token (transient failure) → tag the error so
 *    handleAxiosError rejects silently WITHOUT forceLogout or toast.
 */
async function handleRefreshOutcome(
  error: AxiosError<ApiErrorResponse>,
): Promise<never> {
  try {
    const session = await getFreshSession();
    if (isSessionDead(session)) {
      return Promise.reject(error);
    }
  } catch {
    // Cannot read session (network) — assume transient, stay logged in.
  }
  (error as { __transientAuth?: boolean }).__transientAuth = true;
  return Promise.reject(error);
}

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

  // A transient refresh failure (backend blip) must never log an active user
  // out — the session is still alive and the next request will retry refresh.
  if ((error as { __transientAuth?: boolean }).__transientAuth) {
    return Promise.reject(error);
  }

  // ── Terminal auth failures → force logout ─────────────────────────────────
  if (code && TERMINAL_AUTH_CODES.has(code)) {
    return forceLogout(
      code === "ACCOUNT_BANNED"
        ? `Your account has been suspended${data?.reason ? `: ${data.reason}` : ""}.`
        : code === "EMAIL_NOT_VERIFIED"
          ? "Please verify your email address before continuing."
          : "Session expired. Please login again.",
    );
  }

  // ── Dedicated handling for specific error codes ─────────────────────────────
  if (code === "EMAIL_NOT_VERIFIED") {
    toast.error("Please verify your email address before continuing.");
    return Promise.reject(error);
  }

  if (code === "FORBIDDEN") {
    if (showErrorToast) {
      const required = data?.required?.join(", ") || "required permissions";
      toast.error(`You don't have permission to perform this action. ${required}`);
    }
    return Promise.reject(error);
  }

  if (code === "ACCOUNT_BANNED") {
    return forceLogout(`Your account has been suspended${data?.reason ? `: ${data.reason}` : ""}.`);
  }

  if (code === "CONFLICT") {
    toast.error(message || "A resource with this identifier already exists.");
    return Promise.reject(error);
  }

  if (code === "REFRESH_IN_PROGRESS") {
    // Interceptor will handle retry - don't toast
    return Promise.reject(error);
  }

  if (code === "RATE_LIMIT_EXCEEDED") {
    const retryAfter = data?.retryAfter || 60;
    toast.error(`Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`);
    return Promise.reject(error);
  }

  if (code === "SESSION_ERROR") {
    toast.error("Server session error. Please try again.");
    return Promise.reject(error);
  }

  if (code === "PROOF_EXPIRED" || code === "INVALID_PROOF") {
    // These are terminal but have specific meaning
    return forceLogout("Authentication proof invalid. Please login again.");
  }

  // ── Skip toast for: interceptor-handled codes, analytics, or caller opt-out
  const url = error.config?.url ?? "";
  const suppressToast =
    !showErrorToast ||
    (code && INTERCEPTOR_HANDLED_CODES.has(code)) ||
    url.includes("/analytics/") ||
    status === 401; // Auth failures never toast — terminal codes forceLogout above, NO_TOKEN on public pages stays silent

  if (suppressToast) return Promise.reject(error);

  // ── Status-based toast messages ───────────────────────────────────────────
  switch (status) {
    case 400:
      // Validation errors with field details
      if (data?.errors?.length) {
        toast.error(data.errors.map((e) => `${e.field}: ${e.message}`).join("; "));
      } else {
        toast.error(message || "Invalid request. Please check your input.");
      }
      break;
    case 403:
      // Already handled FORBIDDEN, EMAIL_NOT_VERIFIED, ACCOUNT_BANNED above
      if (!["FORBIDDEN", "EMAIL_NOT_VERIFIED", "ACCOUNT_BANNED"].includes(code || "")) {
        toast.error(message || "You don't have permission to do that.");
      }
      break;
    case 404:
      // 404s are usually handled inline by the caller — don't toast by default
      break;
    case 409:
      // CONFLICT handled above
      if (code !== "CONFLICT") {
        toast.error(message || "A resource with this identifier already exists.");
      }
      break;
    case 413:
      toast.error("Request too large. Please reduce the payload size.");
      break;
    case 429:
      // RATE_LIMIT_EXCEEDED handled above
      if (code !== "RATE_LIMIT_EXCEEDED") {
        toast.error(message || "Too many requests. Please try again later.");
      }
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
      .get<ApiResponse<T>>(endpoint, { headers: mergeHeaders(options), params: options?.params })
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
      .delete<ApiResponse<T>>(endpoint, { headers: mergeHeaders(options), data: options?.data })
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
