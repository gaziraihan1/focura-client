"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ProjectDetails } from "./useProjects";

export interface SearchResult {
  id: string;
  title: string;
  type: "task" | "project" | "file";
  subtitle: string;
  href: string;
  status?: string;
  color?: string;
}

interface TaskSearchResult {
  id: string;
  title: string;
  status: string;
  priority: string;
  project?: { id: string; slug: string; name: string; color: string; workspace: { id: string; name: string; slug: string } };
}

interface FileSearchResult {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  project?: { id: string; name: string } | null;
  task?: { id: string; title: string } | null;
}

async function searchTasks(query: string): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({ search: query, limit: "5" });
    const result = await api.get<{ tasks: TaskSearchResult[] }>(`/api/v1/tasks?${params}`);
    const tasks = result?.data?.tasks ?? [];
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      type: "task" as const,
      subtitle: t.project?.name ?? "Personal task",
      href: t.project?.workspace?.slug
        ? `/dashboard/workspaces/${t.project.workspace.slug}/projects/${t.project.slug}/tasks/${t.id}`
        : `/dashboard/tasks/${t.id}`,
      status: t.status,
      color: t.project?.color,
    }));
  } catch {
    return [];
  }
}

async function searchProjects(query: string): Promise<SearchResult[]> {
  try {
    const result = await api.get<ProjectDetails[]>("/api/v1/projects/user/all");
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

async function searchFiles(query: string): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({ search: query, limit: "5" });
    const result = await api.get<{ files: FileSearchResult[] }>(`/api/v1/files?${params}`);
    const files = result?.data?.files ?? [];
    return files.map((f) => ({
      id: f.id,
      title: f.name,
      type: "file" as const,
      subtitle: f.project?.name ?? f.task?.title ?? "Uploaded file",
      href: f.project
        ? `/dashboard/storage`
        : `/dashboard/storage`,
    }));
  } catch {
    return [];
  }
}

export function useGlobalSearch(query: string) {
  const trimmed = query.trim();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["global-search", "tasks", trimmed],
    queryFn: () => searchTasks(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 30_000,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["global-search", "projects", trimmed],
    queryFn: () => searchProjects(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 60_000,
  });

  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ["global-search", "files", trimmed],
    queryFn: () => searchFiles(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 30_000,
  });

  const results: SearchResult[] = [...tasks, ...projects, ...files];
  const isLoading = tasksLoading || projectsLoading || filesLoading;

  return { results, isLoading, hasQuery: trimmed.length >= 2 };
}
