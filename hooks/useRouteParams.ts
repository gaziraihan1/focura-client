"use client";

import { useParams } from "next/navigation";

// ─── Typed route-param accessors ──────────────────────────────────────────────
// THE single place that knows dynamic segment names. Call these instead of
// `useParams()` + `as string` casts: values are validated at runtime and
// default to "" (falsy) when the segment is absent, so existing `enabled`
// flags and guards keep working unchanged.

function readParam(params: Record<string, string | string[] | undefined> | null | undefined, key: string): string {
  const value = params?.[key];
  return typeof value === "string" ? value : "";
}

export function useWorkspaceSlug(): string {
  const params = useParams();
  return readParam(params, "workspaceSlug");
}

export function useProjectSlug(): string {
  const params = useParams();
  return readParam(params, "projectSlug");
}

/** For nested project routes: /dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/... */
export function useProjectRouteSlugs(): { workspaceSlug: string; projectSlug: string } {
  const params = useParams();
  return {
    workspaceSlug: readParam(params, "workspaceSlug"),
    projectSlug: readParam(params, "projectSlug"),
  };
}
