import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export const labelKeys = {
  all: ['labels'] as const,
  lists: () => [...labelKeys.all, 'list'] as const,
};

export function useLabels() {
  return useQuery({
    queryKey: labelKeys.lists(),
    queryFn: async () => {
      const response = await api.get<Label[]>('/api/labels');
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, 
  });
}