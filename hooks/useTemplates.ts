// hooks/useTemplates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { templateKeys } from './templateKeys';
import { projectKeys } from './projectKeys';
import type {
  TemplateCatalogResponse,
  TemplateCatalogItem,
  TemplateImportInput,
  TemplateImportResult,
  SaveAsTemplateInput,
  SaveAsTemplateResult,
} from '@/types/templates.types';

/**
 * Public template catalog + the caller's access tier.
 * Works for logged-out users (tier resolves to FREE server-side).
 */
export function useTemplateCatalog() {
  return useQuery({
    queryKey: templateKeys.catalog(),
    queryFn: async (): Promise<TemplateCatalogResponse> => {
      const res = await api.get<TemplateCatalogResponse>('/api/v1/templates/catalog', {
        showErrorToast: false,
      });
      return (
        res?.data ?? { templates: [], access: { tier: 'FREE' } }
      );
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Public detail for a single template slug. */
export function useTemplateDetail(slug: string) {
  return useQuery({
    queryKey: templateKeys.detail(slug),
    queryFn: async (): Promise<TemplateCatalogItem | null> => {
      const res = await api.get<TemplateCatalogItem>(`/api/v1/templates/${slug}`, {
        showErrorToast: false,
      });
      return res?.data ?? null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/** Import a template into a workspace as a brand-new project. */
export function useTemplateImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TemplateImportInput & { slug: string }): Promise<TemplateImportResult> => {
      const { slug, ...body } = input;
      const res = await api.post<TemplateImportResult>(
        `/api/v1/templates/${slug}/use`,
        body,
        { showSuccessToast: true, showErrorToast: true },
      );
      return res!.data!;
    },
    onSuccess: (data, vars) => {
      // The imported project invalidates the destination workspace's project list.
      qc.invalidateQueries({ queryKey: projectKeys.list(vars.workspaceId) });
    },
  });
}

/** Snapshot a project as a template (structure only). */
export function useSaveAsTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { projectId: string; input?: SaveAsTemplateInput }): Promise<SaveAsTemplateResult> => {
      const res = await api.post<SaveAsTemplateResult>(
        `/api/v1/templates/save-as-template/${vars.projectId}`,
        vars.input ?? {},
        { showSuccessToast: true, showErrorToast: true },
      );
      return res!.data!;
    },
    onSuccess: () => {
      // templateKeys.all ('templates') partial-matches the catalog, detail and
      // every workspace's private list, so a single invalidation refreshes all.
      qc.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
}

/** Private templates saved inside a workspace (members only). */
export function useWorkspacePrivateTemplates(workspaceId: string) {
  return useQuery({
    queryKey: templateKeys.private(workspaceId),
    queryFn: async (): Promise<TemplateCatalogItem[]> => {
      const res = await api.get<TemplateCatalogItem[]>('/api/v1/templates/private', {
        params: { workspaceId },
        showErrorToast: false,
      });
      return res?.data ?? [];
    },
    enabled: !!workspaceId,
    staleTime: 30 * 1000,
  });
}
