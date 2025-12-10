// lib/axios.ts
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

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_URL;

// Axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// Request interceptor - ADD AUTHORIZATION HEADER
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get NextAuth session and extract backend token
    const session = await getSession();
    
    if (session?.backendToken) {
      config.headers.Authorization = `Bearer ${session.backendToken}`;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Added Authorization header with backend token');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No backend token found in session');
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔵 API Request:', {
        url: config.url,
        method: config.method,
        hasAuthHeader: !!config.headers.Authorization,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.headers?.["x-show-success-toast"] === "true") {
      toast.success(response.data?.message || "Success!");
    }
    return response;
  },
  async (error: AxiosError<{ message?: string; success?: boolean; code?: string }>) => {
    if (!error || !error.config) {
      console.error('🔴 Malformed error object');
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.code;
    const showErrorToast = error.config?.headers?.["x-show-error-toast"] !== "false";
    const message = error.response?.data?.message || "Something went wrong";
    const status = error.response?.status;

    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 API Error:', {
        url: error.config?.url || 'unknown',
        status: status || 'no status',
        message: message,
        code: errorCode || 'no code',
      });
    }

    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
  toast.error("Session expired. Please login again.");
  // Clear session and redirect
  signOut({ callbackUrl: '/authentication/login' });
} else if (error.response?.data?.code === 'INVALID_TOKEN') {
  toast.error("Invalid session. Please login again.");
  signOut({ callbackUrl: '/authentication/login' });
}
    if (error.response && showErrorToast) {
      switch (status) {
        case 401:
          toast.error(message || "Session expired. Please log in again.");
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/authentication')) {
            setTimeout(() => {
              window.location.href = '/authentication/login';
            }, 1500);
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
      toast.error("Network error. Check your connection");
    } else if (showErrorToast && !error.response) {
      toast.error(error.message || "Unexpected error");
    }

    return Promise.reject(error);
  }
);

const configureRequest = (options?: ApiOptions) => {
  const headers: Record<string, string> = {};

  if (options?.showSuccessToast) headers["x-show-success-toast"] = "true";
  
  if (options?.showErrorToast === false) {
    headers["x-show-error-toast"] = "false";
  } else if (options?.showErrorToast === true) {
    headers["x-show-error-toast"] = "true";
  }

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