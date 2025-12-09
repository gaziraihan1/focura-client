// lib/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://focura-backend-production.up.railway.app";

// Axios instance with credentials support
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔵 API Request:', {
        url: config.url,
        method: config.method,
        cookies: document.cookie,
        withCredentials: config.withCredentials
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.headers?.["x-show-success-toast"] === "true") {
      toast.success(response.data?.message || "Success!");
    }
    return response;
  },
  async (error: AxiosError<{ message?: string; success?: boolean; code?: string }>) => {
    // Early return if error object is malformed
    if (!error || !error.config) {
      console.error('🔴 Malformed error object');
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.code;
    const showErrorToast = error.config?.headers?.["x-show-error-toast"] !== "false";
    const message = error.response?.data?.message || "Something went wrong";
    const status = error.response?.status;

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 API Error:', {
        url: error.config?.url || 'unknown',
        status: status || 'no status',
        message: message,
        code: errorCode || 'no code',
        showErrorToast,
        hasResponse: !!error.response,
      });
    }

    // Show toast for errors with response
    if (error.response && showErrorToast) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📢 Showing error toast:', message);
      }
      
      switch (status) {
        case 401:
          toast.error(message || "Session expired. Please log in again.");
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/authentication')) {
            // Handle redirect if needed
          }
          break;
        case 403:
          toast.error(message || "You do not have permission");
          break;
        case 404:
          toast.error(message || "Resource not found");
          break;
        case 429:
          toast.error(message || "Too many requests. Try later");
          break;
        case 500:
          toast.error(message || "Server error. Try later");
          break;
        default:
          toast.error(message);
      }
    } else if (error.request && showErrorToast) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📢 Showing network error toast');
      }
      toast.error("Network error. Check your connection");
    } else if (showErrorToast && !error.response) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📢 Showing generic error toast');
      }
      toast.error(error.message || "Unexpected error");
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Toast suppressed (showErrorToast = false)');
      }
    }

    return Promise.reject(error);
  }
);

const configureRequest = (options?: ApiOptions) => {
  const headers: Record<string, string> = {};

  if (options?.showSuccessToast) headers["x-show-success-toast"] = "true";
  
  // Explicitly set to "false" when showErrorToast is false
  if (options?.showErrorToast === false) {
    headers["x-show-error-toast"] = "false";
  } else if (options?.showErrorToast === true) {
    headers["x-show-error-toast"] = "true";
  }
  // If undefined, don't set the header (will default to showing toast)

  return { headers };
};

export const api = {
  get: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance.get<ApiResponse<T>>(
      endpoint,
      configureRequest(options)
    );
    if (options?.showSuccessToast && res.data.message)
      toast.success(res.data.message);
    return res.data;
  },

  post: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance.post<ApiResponse<T>>(
      endpoint,
      data,
      configureRequest(options)
    );
    if (options?.showSuccessToast && res.data.message)
      toast.success(res.data.message);
    return res.data;
  },

  put: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance.put<ApiResponse<T>>(
      endpoint,
      data,
      configureRequest(options)
    );
    if (options?.showSuccessToast && res.data.message)
      toast.success(res.data.message);
    return res.data;
  },

  patch: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance.patch<ApiResponse<T>>(
      endpoint,
      data,
      configureRequest(options)
    );
    if (options?.showSuccessToast && res.data.message)
      toast.success(res.data.message);
    return res.data;
  },

  delete: async <T = unknown>(endpoint: string, options?: ApiOptions) => {
    const res = await axiosInstance.delete<ApiResponse<T>>(
      endpoint,
      configureRequest(options)
    );
    if (options?.showSuccessToast && res.data.message)
      toast.success(res.data.message);
    return res.data;
  },

  upload: async <T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: ApiOptions
  ) => {
    const res = await axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
      ...configureRequest(options),
      headers: {
        ...configureRequest(options).headers,
        "Content-Type": "multipart/form-data",
      },
    });
    if (options?.showSuccessToast && res.data.message)
      toast.success(res.data.message);
    return res.data;
  },
};

export default axiosInstance;