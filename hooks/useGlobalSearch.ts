"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useWorkspaces, type Workspace } from "./useWorkspace";
import type { ProjectDetails } from "./useProjects";

export interface SearchResult {
  id: string;
  title: string;
  type: "project" | "file" | "workspace";
  subtitle: string;
  href: string;
  color?: string;
}

// ─── Project search (server-side) ────────────────────────────────────────────

async function searchProjectsFromAPI(
  query: string
): Promise<SearchResult[]> {
  try {
    const result = await api.get<ProjectDetails[]>(
      "/api/v1/projects/user/all"
    );
    const projects = result?.data ?? [];
    const lower = query.toLowerCase();
    return projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower)
      )
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.name,
        type: "project" as const,
        subtitle: p.workspace?.name ?? "Project",
        href: p.workspace?.slug
          ? `/dashboard/workspaces/${p.workspace.slug}/projects/${p.slug}`
          : `/dashboard/projects`,
        color: p.color,
      }));
  } catch {
    return [];
  }
}

// ─── File search ─────────────────────────────────────────────────────────────

interface FileSearchResult {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  project?: { id: string; name: string } | null;
  task?: { id: string; title: string } | null;
}

async function searchFilesForWorkspace(
  query: string,
  workspaceId: string
): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({ search: query, limit: "5" });
    const result = await api.get<{ files: FileSearchResult[] }>(
      `/api/v1/file-management/${workspaceId}/files?${params}`
    );
    const files = result?.data?.files ?? [];
    return files.map((f) => ({
      id: f.id,
      title: f.name,
      type: "file" as const,
      subtitle: f.project?.name ?? f.task?.title ?? "Uploaded file",
      href: `/dashboard/workspaces/${workspaceId}/files`,
    }));
  } catch {
    return [];
  }
}

// ─── Workspace search (client-side filter) ───────────────────────────────────

function searchWorkspaces(
  query: string,
  workspaces: Workspace[] | undefined
): SearchResult[] {
  if (!query.trim() || !workspaces) return [];
  const lower = query.toLowerCase();
  return workspaces
    .filter(
      (w) =>
        w.name.toLowerCase().includes(lower) ||
        w.description?.toLowerCase().includes(lower)
    )
    .slice(0, 5)
    .map((w) => ({
      id: w.id,
      title: w.name,
      type: "workspace" as const,
      subtitle: `${w.plan} plan`,
      href: `/dashboard/workspaces/${w.slug}`,
      color: w.color ?? undefined,
    }));
}

// ─── Main hook ───────────────────────────────────────────────────────────────

export function useGlobalSearch(query: string) {
  const trimmed = query.trim();
  const hasQuery = trimmed.length >= 2;

  const { data: workspaces } = useWorkspaces();

  // Projects — fetch all, filter client-side
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["global-search", "projects", trimmed],
    queryFn: () => searchProjectsFromAPI(trimmed),
    enabled: hasQuery,
    staleTime: 60_000,
  });

  // Files — search across all user workspaces
  const workspaceIds = workspaces?.map((w) => w.id) ?? [];
  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ["global-search", "files", trimmed, ...workspaceIds],
    queryFn: async () => {
      const results = await Promise.all(
        workspaceIds.map((wid) => searchFilesForWorkspace(trimmed, wid))
      );
      return results.flat().slice(0, 5);
    },
    enabled: hasQuery && workspaceIds.length > 0,
    staleTime: 30_000,
  });

  // Workspaces — filter from cache
  const workspacesResults = searchWorkspaces(trimmed, workspaces);

  const results: SearchResult[] = [
    ...workspacesResults,
    ...projects,
    ...files,
  ];
  const isLoading = projectsLoading || filesLoading;

  return { results, isLoading, hasQuery };
}
