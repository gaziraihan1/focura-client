// Public entry point for the API client. All implementation lives in
// lib/axios/ (types, instance, broadcast, refresh, session, client); this
// barrel preserves the historical import surface so callers keep importing
// from "@/lib/axios" unchanged.
export { axiosInstance, default } from "./axios/instance";
export { api, normalizeError, unwrap, unwrapList } from "./axios/client";
export { getFreshSession } from "./axios/refresh";
export {
  initializeBackgroundRefresh,
  stopBackgroundRefresh,
  stopSessionTimers,
  updateActivity,
} from "./axios/session";
export type {
  ApiOptions,
  ApiResponse,
  AppError,
  ApiErrorResponse,
} from "./axios/types";
