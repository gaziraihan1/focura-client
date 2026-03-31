import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  },
  mutations: {
    retry: 0,
  },
};

export const qc = new QueryClient({
  defaultOptions: queryConfig,
});
