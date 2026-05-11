import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { invalidateCsrfToken } from '../csrf';
import { AppError } from '../axios';


const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
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
