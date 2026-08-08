import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { invalidateCsrfToken } from '../csrf';
import { AppError } from '../axios';


const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    // Don't retry 403/404 (gated/removed access) — retrying only delays the
    // graceful error state and keeps stale caches alive longer.
    retry: (failureCount: number, error: unknown) => {
      const status = (error as AppError)?.response?.status;
      if (status === 403 || status === 404) return false;
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  },
  mutations: {
    retry: 0,
    onError: (error: AppError) => {
        // Invalidate CSRF token on authentication errors
        if (error?.response?.data?.code === 'CSRF_VALIDATION_FAILED') {
          invalidateCsrfToken();
        }
      },
  },
};

export const qc = new QueryClient({
  defaultOptions: queryConfig,
});
