// hooks/templateKeys.ts — React Query keys for the templates catalog & import.
export const templateKeys = {
  all: ['templates'] as const,
  catalog: () => [...templateKeys.all, 'catalog'] as const,
  detail: (slug: string) => [...templateKeys.all, 'detail', slug] as const,
  private: (workspaceId: string) => [...templateKeys.all, 'private', workspaceId] as const,
};
