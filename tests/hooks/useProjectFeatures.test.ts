import { describe, it, expect, vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { renderHookWithProviders } from "../utils/renderWithProviders";
import {
  useReorderSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useProjectSprints,
  useCreateSprint,
  useUpdateSprint,
  useDeleteSprint,
  useCompleteSprint,
  useProjectMilestones,
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
  useUpdateMilestoneProgress,
  useProjectViews,
  useCreateView,
  useUpdateView,
  useDeleteView,
  useMyFavorites,
  useCheckFavorite,
  useToggleFavorite,
} from "@/hooks/useProjectFeatures";
import { sectionKeys, sprintKeys, milestoneKeys, viewKeys, favoriteKeys } from "@/hooks/projectFeatureKeys";
import { server } from "@/tests/mock/server";
import { http, HttpResponse } from "msw";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PROJECT_ID = "project-1";

// ─── Sections ────────────────────────────────────────────────────────────────

describe("Section hooks", () => {
  describe("useReorderSections", () => {
    it("calls the reorder endpoint with ordered ids and invalidates the list", async () => {
      const { result, qc } = renderHookWithProviders(() => useReorderSections());
      qc.setQueryData(sectionKeys.list(PROJECT_ID), [{ id: "s1", name: "A" }]);

      server.use(
        http.put(`${BASE}/api/v1/projects/${PROJECT_ID}/sections/reorder`, () =>
          HttpResponse.json({ success: true, message: "Sections reordered" }),
        ),
      );
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ projectId: PROJECT_ID, sectionIds: ["s2", "s1"] });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionKeys.list(PROJECT_ID) });
    });

    it("propagates endpoint errors", async () => {
      const { result } = renderHookWithProviders(() => useReorderSections());

      server.use(
        http.put(`${BASE}/api/v1/projects/${PROJECT_ID}/sections/reorder`, () =>
          new HttpResponse(null, { status: 500 }),
        ),
      );

      await act(async () => {
        await expect(
          result.current.mutateAsync({ projectId: PROJECT_ID, sectionIds: ["s1"] }),
        ).rejects.toBeTruthy();
      });
    });
  });

  describe("useCreateSection", () => {
    it("sends wipLimit and taskStatus in the payload", async () => {
      let captured: Record<string, unknown> | undefined;
      server.use(
        http.post(`${BASE}/api/v1/projects/${PROJECT_ID}/sections`, async ({ request }) => {
          captured = await request.json();
          return HttpResponse.json({ success: true, data: { id: "s1", projectId: PROJECT_ID } });
        }),
      );

      const { result } = renderHookWithProviders(() => useCreateSection());

      await act(async () => {
        await result.current.mutateAsync({
          name: "Backlog",
          projectId: PROJECT_ID,
          wipLimit: 20,
          taskStatus: "TODO",
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(captured).toMatchObject({
        name: "Backlog",
        projectId: PROJECT_ID,
        wipLimit: 20,
        taskStatus: "TODO",
      });
    });
  });

  describe("useUpdateSection", () => {
    it("sends partial updates through", async () => {
      let captured: Record<string, unknown> | undefined;
      server.use(
        http.patch(`${BASE}/api/v1/projects/${PROJECT_ID}/sections/sec1`, async ({ request }) => {
          captured = await request.json();
          return HttpResponse.json({ success: true, data: { id: "sec1", taskStatus: "IN_REVIEW" } });
        }),
      );

      const { result } = renderHookWithProviders(() => useUpdateSection());

      await act(async () => {
        await result.current.mutateAsync({ sectionId: "sec1", projectId: PROJECT_ID, taskStatus: "IN_REVIEW" });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(captured).toEqual({ taskStatus: "IN_REVIEW" });
    });
  });

  describe("useDeleteSection", () => {
    it("deletes a section and invalidates the list", async () => {
      const { result, qc } = renderHookWithProviders(() => useDeleteSection());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ sectionId: "s1", projectId: PROJECT_ID });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionKeys.list(PROJECT_ID) });
    });
  });
});

// ─── Sprints ─────────────────────────────────────────────────────────────────

describe("Sprint hooks", () => {
  describe("useProjectSprints", () => {
    it("fetches sprint stats for a project", async () => {
      const { result } = renderHookWithProviders(() => useProjectSprints(PROJECT_ID));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.sprints).toHaveLength(2);
      expect(result.current.data?.activeSprint?.name).toBe("Sprint 2");
      expect(result.current.data?.avgVelocity).toBe(18);
    });

    it("is disabled when projectId is not provided", () => {
      const { result } = renderHookWithProviders(() => useProjectSprints(undefined));
      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("useCreateSprint", () => {
    it("creates a sprint and invalidates the sprint list", async () => {
      const { result, qc } = renderHookWithProviders(() => useCreateSprint());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({
          name: "Sprint 3",
          startDate: "2024-02-01",
          endDate: "2024-02-14",
          projectId: PROJECT_ID,
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.id).toBe("sp-new");
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sprintKeys.stats(PROJECT_ID) });
    });
  });

  describe("useUpdateSprint", () => {
    it("updates a sprint and invalidates the sprint list", async () => {
      const { result, qc } = renderHookWithProviders(() => useUpdateSprint());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ sprintId: "sp-1", projectId: PROJECT_ID, name: "Updated Sprint" });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sprintKeys.stats(PROJECT_ID) });
    });
  });

  describe("useDeleteSprint", () => {
    it("deletes a sprint and invalidates the sprint list", async () => {
      const { result, qc } = renderHookWithProviders(() => useDeleteSprint());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ sprintId: "sp-1", projectId: PROJECT_ID });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sprintKeys.stats(PROJECT_ID) });
    });
  });

  describe("useCompleteSprint", () => {
    it("completes a sprint with optional retrospective", async () => {
      const { result } = renderHookWithProviders(() => useCompleteSprint());

      await act(async () => {
        await result.current.mutateAsync({
          sprintId: "sp-1",
          projectId: PROJECT_ID,
          retrospective: "Good sprint, delivered 18 points",
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.status).toBe("COMPLETED");
    });
  });
});

// ─── Milestones ──────────────────────────────────────────────────────────────

describe("Milestone hooks", () => {
  describe("useProjectMilestones", () => {
    it("fetches milestone stats for a project", async () => {
      const { result } = renderHookWithProviders(() => useProjectMilestones(PROJECT_ID));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.total).toBe(2);
      expect(result.current.data?.completed).toBe(1);
      expect(result.current.data?.milestones).toHaveLength(2);
      expect(result.current.data?.avgProgress).toBe(50);
    });

    it("is disabled when projectId is not provided", () => {
      const { result } = renderHookWithProviders(() => useProjectMilestones(undefined));
      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("useCreateMilestone", () => {
    it("creates a milestone and invalidates the milestone stats", async () => {
      const { result, qc } = renderHookWithProviders(() => useCreateMilestone());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({
          title: "v1.0 Release",
          projectId: PROJECT_ID,
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.id).toBe("m-new");
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: milestoneKeys.stats(PROJECT_ID) });
    });
  });

  describe("useUpdateMilestone", () => {
    it("updates a milestone and invalidates the milestone stats", async () => {
      const { result, qc } = renderHookWithProviders(() => useUpdateMilestone());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ milestoneId: "m1", projectId: PROJECT_ID, title: "Updated Title" });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: milestoneKeys.stats(PROJECT_ID) });
    });
  });

  describe("useDeleteMilestone", () => {
    it("deletes a milestone and invalidates the milestone stats", async () => {
      const { result, qc } = renderHookWithProviders(() => useDeleteMilestone());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ milestoneId: "m1", projectId: PROJECT_ID });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: milestoneKeys.stats(PROJECT_ID) });
    });
  });

  describe("useUpdateMilestoneProgress", () => {
    it("updates milestone progress and invalidates the milestone stats", async () => {
      const { result, qc } = renderHookWithProviders(() => useUpdateMilestoneProgress());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ milestoneId: "m1", projectId: PROJECT_ID, progress: 75 });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.progress).toBe(75);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: milestoneKeys.stats(PROJECT_ID) });
    });
  });
});

// ─── Views ───────────────────────────────────────────────────────────────────

describe("View hooks", () => {
  describe("useProjectViews", () => {
    it("fetches views for a project", async () => {
      const { result } = renderHookWithProviders(() => useProjectViews(PROJECT_ID));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].type).toBe("KANBAN");
      expect(result.current.data?.[0].isDefault).toBe(true);
    });

    it("is disabled when projectId is not provided", () => {
      const { result } = renderHookWithProviders(() => useProjectViews(undefined));
      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("useCreateView", () => {
    it("creates a view and invalidates the view list", async () => {
      const { result, qc } = renderHookWithProviders(() => useCreateView());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({
          name: "My Timeline",
          type: "TIMELINE",
          projectId: PROJECT_ID,
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.id).toBe("v-new");
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: viewKeys.list(PROJECT_ID) });
    });
  });

  describe("useUpdateView", () => {
    it("updates a view and invalidates the view list", async () => {
      const { result, qc } = renderHookWithProviders(() => useUpdateView());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ viewId: "v1", projectId: PROJECT_ID, isDefault: true });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: viewKeys.list(PROJECT_ID) });
    });
  });

  describe("useDeleteView", () => {
    it("deletes a view and invalidates the view list", async () => {
      const { result, qc } = renderHookWithProviders(() => useDeleteView());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ viewId: "v1", projectId: PROJECT_ID });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: viewKeys.list(PROJECT_ID) });
    });
  });
});

// ─── Favorites ───────────────────────────────────────────────────────────────

describe("Favorite hooks", () => {
  describe("useMyFavorites", () => {
    it("fetches the user's grouped and ungrouped favorites", async () => {
      const { result } = renderHookWithProviders(() => useMyFavorites());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.ungrouped).toHaveLength(1);
      expect(result.current.data?.ungrouped[0].project.name).toBe("Test Project");
    });
  });

  describe("useCheckFavorite", () => {
    it("checks if a project is favorited", async () => {
      const { result } = renderHookWithProviders(() => useCheckFavorite(PROJECT_ID));

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.favorited).toBe(true);
    });

    it("is disabled when projectId is not provided", () => {
      const { result } = renderHookWithProviders(() => useCheckFavorite(undefined));
      expect(result.current.fetchStatus).toBe("idle");
    });
  });

  describe("useToggleFavorite", () => {
    it("toggles a favorite and invalidates related queries", async () => {
      const { result, qc } = renderHookWithProviders(() => useToggleFavorite());
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync(PROJECT_ID);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.favorited).toBe(false);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: favoriteKeys.mine() });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: favoriteKeys.check(PROJECT_ID) });
    });
  });
});
