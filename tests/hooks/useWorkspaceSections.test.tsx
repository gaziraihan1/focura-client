import { describe, it, expect } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHookWithProviders } from "../utils/renderWithProviders";
import { useWorkspaceSections } from "@/hooks/useWorkspaceSections";
import { server } from "@/tests/mock/server";
import { http, HttpResponse } from "msw";

describe("useWorkspaceSections", () => {
  it("aggregates sections across projects with project names, sorted by project then name", async () => {
    server.use(
      http.get("*/api/v1/projects/proj-a/sections", () =>
        HttpResponse.json({
          success: true,
          data: [
            { id: "s1", name: "Backlog", color: "#94a3b8", status: "ACTIVE", position: 0, projectId: "proj-a" },
            { id: "s2", name: "Done", color: "#10b981", status: "ACTIVE", position: 1, projectId: "proj-a" },
          ],
        }),
      ),
      http.get("*/api/v1/projects/proj-b/sections", () =>
        HttpResponse.json({
          success: true,
          data: [
            { id: "s3", name: "Research", color: "#a855f7", status: "ACTIVE", position: 0, projectId: "proj-b" },
          ],
        }),
      ),
    );

    const { result } = renderHookWithProviders(() =>
      useWorkspaceSections("ws-1", [
        { id: "proj-a", name: "Alpha" },
        { id: "proj-b", name: "Beta" },
      ]),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { id: "s1", name: "Backlog", color: "#94a3b8", projectId: "proj-a", projectName: "Alpha" },
      { id: "s2", name: "Done", color: "#10b981", projectId: "proj-a", projectName: "Alpha" },
      { id: "s3", name: "Research", color: "#a855f7", projectId: "proj-b", projectName: "Beta" },
    ]);
  });

  it("is disabled when there are no projects", () => {
    const { result } = renderHookWithProviders(() => useWorkspaceSections("ws-1", []));
    expect(result.current.isEnabled).toBe(false);
  });
});
