import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { getSession, signOut } from "next-auth/react";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  code?: string;
}

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not set");
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let cachedBackendToken: string | null = null;
let cachedTokenExpiry = 0;

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const now = Date.now();

    if (!cachedBackendToken || now > cachedTokenExpiry) {
      const session = await getSession();
      cachedBackendToken = session?.backendToken ?? null;
      cachedTokenExpiry = session ? now + 60 * 60 * 1000 : now;
    }

    if (cachedBackendToken) {
      config.headers.Authorization = `Bearer ${cachedBackendToken}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", {
        url: config.url,
        method: config.method,
        hasAuth: !!config.headers.Authorization,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const handleAxiosError = async (
  error: AxiosError<ApiErrorResponse>,
  showErrorToast = true
) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message || error.message || "Unknown error";
  const url = error.config?.url || "";

  const code = error.response?.data?.code;
  
  if (code === "TOKEN_EXPIRED" || code === "INVALID_TOKEN") {
    toast.error("Session expired. Please login again.");
    signOut({ callbackUrl: "/authentication/login" });
    return Promise.reject(error);
  }

  const suppressToast =
    !showErrorToast ||
    status === 404 ||
    status === 403 || 
    url.includes("/analytics/"); 

  if (suppressToast) {
    return Promise.reject(error);
  }

  switch (status) {
    case 401:
      toast.error(message || "Session expired. Please login again.");
      break;
    case 429:
      toast.error(message || "Too many requests. Try later.");
      break;
    case 500:
      toast.error(message || "Server error. Try later.");
      break;
    default:
      if (status && status >= 400 && status < 500) {
        toast.error(message);
      } else if (status && status >= 500) {
        toast.error("Server error. Please try again later.");
      }
  }

  return Promise.reject(error);
};

const mergeHeaders = (
  options?: ApiOptions,
  extra?: Record<string, string>
) => ({
  ...extra,
});

export const api = {
  get: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance
      .get<ApiResponse<T>>(endpoint, {
        headers: mergeHeaders(options),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message)
      toast.success(res.data.message);
    return res?.data;
  },

  post: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance
      .post<ApiResponse<T>>(endpoint, data, {
        headers: mergeHeaders(options),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message)
      toast.success(res.data.message);
    return res?.data;
  },

  put: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance
      .put<ApiResponse<T>>(endpoint, data, {
        headers: mergeHeaders(options),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message)
      toast.success(res.data.message);
    return res?.data;
  },

  patch: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance
      .patch<ApiResponse<T>>(endpoint, data, {
        headers: mergeHeaders(options),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message)
      toast.success(res.data.message);
    return res?.data;
  },

  delete: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance
      .delete<ApiResponse<T>>(endpoint, {
        headers: mergeHeaders(options),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message)
      toast.success(res.data.message);
    return res?.data;
  },

  upload: async <T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance
      .post<ApiResponse<T>>(endpoint, formData, {
        headers: mergeHeaders(options, {
          "Content-Type": "multipart/form-data",
        }),
      })
      .catch((err) => handleAxiosError(err, options?.showErrorToast));
    if (options?.showSuccessToast && res?.data?.message)
      toast.success(res.data.message);
    return res?.data;
  },
};

export default axiosInstance;