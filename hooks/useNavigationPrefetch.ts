import { api, unwrap } from "@/lib/axios";
import { qc } from "@/lib/react-query/query-client";
import { workspaceKeys } from "./workspaceKeys";
import { projectKeys } from "./projectKeys";
import { milestoneKeys, sprintKeys, sectionKeys, viewKeys } from "./projectFeatureKeys";
import { fetchWorkspaceOverview } from "./useWorkspaceQueries";

/**
 * Prefetches a workspace's overview payload (and everything it seeds:
 * detail, stats, members, projects) so navigating to the workspace
 * renders from cache instead of showing loading skeletons.
 */
export function prefetchWorkspaceOverview(slug: string): void {
  if (!slug) return;
  void qc.prefetchQuery({
    queryKey: [...workspaceKeys.detail(slug), "overview"] as const,
    queryFn: () => fetchWorkspaceOverview(qc, slug),
    staleTime: 60 * 1000,
  });
}

/**
 * Prefetches a project's details-by-slug plus its milestone/sprint/section/
 * view data in parallel. Called with the full project object available at
 * card/link level, this collapses the details→features waterfall that the
 * project overview page would otherwise pay after navigation.
 */
export function prefetchProjectOverview({ id, slug }: { id: string; slug: string }): void {
  if (!id || !slug) return;

  const prefetches = [
    qc.prefetchQuery({
      queryKey: [...projectKeys.details(), "slug", slug] as const,
      queryFn: async () => unwrap(await api.get(`/api/v1/projects/slug/${slug}`, { showErrorToast: false })),
      staleTime: 2 * 60 * 1000,
    }),
    qc.prefetchQuery({
      queryKey: milestoneKeys.stats(id),
      queryFn: async () => unwrap(await api.get(`/api/v1/projects/${id}/milestones`, { showErrorToast: false })),
      staleTime: 2 * 60 * 1000,
    }),
    qc.prefetchQuery({
      queryKey: sprintKeys.stats(id),
      queryFn: async () => unwrap(await api.get(`/api/v1/projects/${id}/sprints`, { showErrorToast: false })),
      staleTime: 2 * 60 * 1000,
    }),
    qc.prefetchQuery({
      queryKey: sectionKeys.list(id),
      queryFn: async () => unwrap(await api.get(`/api/v1/projects/${id}/sections`, { showErrorToast: false })),
      staleTime: 30 * 1000,
    }),
    qc.prefetchQuery({
      queryKey: viewKeys.list(id),
      queryFn: async () => unwrap(await api.get(`/api/v1/projects/${id}/views`, { showErrorToast: false })),
      staleTime: 5 * 60 * 1000,
    }),
  ];

  void Promise.all(prefetches).catch(() => undefined);
}
