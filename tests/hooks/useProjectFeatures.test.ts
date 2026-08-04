import { describe, it, expect, vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { renderHookWithProviders } from "../utils/renderWithProviders";
import {
  useReorderSections,
  useCreateSection,
  useUpdateSection,
} from "@/hooks/useProjectFeatures";
import { sectionKeys } from "@/hooks/projectFeatureKeys";
import { server } from "@/tests/mock/server";
import { http, HttpResponse } from "msw";

describe("Section hooks", () => {
  describe("useReorderSections", () => {
    it("calls the reorder endpoint with ordered ids and invalidates the list", async () => {
      const { result, qc } = renderHookWithProviders(() => useReorderSections());
      qc.setQueryData(sectionKeys.list("proj1"), [{ id: "s1", name: "A" }]);

      server.use(
        http.put("*/api/v1/projects/proj1/sections/reorder", () =>
          HttpResponse.json({ success: true, message: "Sections reordered" }),
        ),
      );
      const invalidateSpy = vi.spyOn(qc, "invalidateQueries");

      await act(async () => {
        await result.current.mutateAsync({ projectId: "proj1", sectionIds: ["s2", "s1"] });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionKeys.list("proj1") });
    });

    it("propagates endpoint errors", async () => {
      const { result } = renderHookWithProviders(() => useReorderSections());

      server.use(
        http.put("*/api/v1/projects/proj1/sections/reorder", () =>
          new HttpResponse(null, { status: 500 }),
        ),
      );

      await act(async () => {
        await expect(
          result.current.mutateAsync({ projectId: "proj1", sectionIds: ["s1"] }),
        ).rejects.toBeTruthy();
      });
    });
  });

  describe("useCreateSection", () => {
    it("sends wipLimit and taskStatus in the payload", async () => {
      let captured: Record<string, unknown> | undefined;
      server.use(
        http.post("*/api/v1/projects/proj1/sections", async ({ request }) => {
          captured = await request.json();
          return HttpResponse.json({ success: true, data: { id: "s1", projectId: "proj1" } });
        }),
      );

      const { result } = renderHookWithProviders(() => useCreateSection());

      await act(async () => {
        await result.current.mutateAsync({
          name: "Backlog",
          projectId: "proj1",
          wipLimit: 20,
          taskStatus: "TODO",
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(captured).toMatchObject({
        name: "Backlog",
        projectId: "proj1",
        wipLimit: 20,
        taskStatus: "TODO",
      });
    });
  });

  describe("useUpdateSection", () => {
    it("sends partial updates through", async () => {
      let captured: Record<string, unknown> | undefined;
      server.use(
        http.patch("*/api/v1/projects/proj1/sections/sec1", async ({ request }) => {
          captured = await request.json();
          return HttpResponse.json({ success: true, data: { id: "sec1", taskStatus: "IN_REVIEW" } });
        }),
      );

      const { result } = renderHookWithProviders(() => useUpdateSection());

      await act(async () => {
        await result.current.mutateAsync({ sectionId: "sec1", projectId: "proj1", taskStatus: "IN_REVIEW" });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(captured).toEqual({ taskStatus: "IN_REVIEW" });
    });
  });
});
