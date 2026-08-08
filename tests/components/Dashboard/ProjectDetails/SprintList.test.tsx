import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useProjectSprints: vi.fn(),
  useCreateSprint: vi.fn(),
  useCompleteSprint: vi.fn(),
  useDeleteSprint: vi.fn(),
}));

import SprintList from "@/components/Dashboard/ProjectDetails/SprintList";
import { useProjectSprints, useDeleteSprint } from "@/hooks/useProjectFeatures";

describe("SprintList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    (useProjectSprints as any).mockReturnValue({ data: null, isLoading: true });
    render(<SprintList projectId="proj1" />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("should show an error state when the query fails (e.g. removed from project)", () => {
    (useProjectSprints as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Request failed with status code 404"),
    });
    render(<SprintList projectId="proj1" />);
    expect(screen.getByText(/couldn't load sprints/i)).toBeDefined();
  });

  it("should show empty state when no sprints", () => {
    (useProjectSprints as any).mockReturnValue({
      data: { sprints: [], activeSprint: null, avgVelocity: 0 },
      isLoading: false,
    });
    render(<SprintList projectId="proj1" />);
    expect(screen.getByText(/No sprints yet/i)).toBeDefined();
  });

  it("should render sprint list", () => {
    (useProjectSprints as any).mockReturnValue({
      data: {
        sprints: [
          { id: "s1", name: "Sprint 1", status: "ACTIVE", startDate: "2024-01-01", endDate: "2024-01-14", goal: "MVP", projectId: "proj1" },
          { id: "s2", name: "Sprint 2", status: "PLANNING", startDate: "2024-01-15", endDate: "2024-01-28", projectId: "proj1" },
        ],
        activeSprint: { id: "s1", name: "Sprint 1", status: "ACTIVE", startDate: "2024-01-01", endDate: "2024-01-14", goal: "MVP", projectId: "proj1" },
        avgVelocity: 0,
      },
      isLoading: false,
    });
    render(<SprintList projectId="proj1" />);
    // Use getAllByText since "Sprint 1" appears in both the banner and card
    const sprint1Elements = screen.getAllByText("Sprint 1");
    expect(sprint1Elements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Sprint 2")).toBeDefined();
  });

  it("opens a confirmation modal before deleting", async () => {
    const deleteSprint = { mutateAsync: vi.fn() };
    (useProjectSprints as any).mockReturnValue({
      data: {
        sprints: [{ id: "s1", name: "Sprint 1", status: "PLANNING", startDate: "2024-01-01", endDate: "2024-01-14", projectId: "proj1" }],
        activeSprint: null,
        avgVelocity: 0,
      },
      isLoading: false,
    });
    (useDeleteSprint as any).mockReturnValue(deleteSprint);

    render(<SprintList projectId="proj1" />);
    // open the card menu
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Delete sprint?")).toBeDefined();
    // confirm actually deletes
    fireEvent.click(screen.getAllByRole("button").find((b) => b.textContent === "Delete")!);
    expect(deleteSprint.mutateAsync).toHaveBeenCalledWith({ sprintId: "s1", projectId: "proj1" });
  });

  it("should show active sprint banner", () => {
    (useProjectSprints as any).mockReturnValue({
      data: {
        sprints: [{ id: "s1", name: "Current Sprint", status: "ACTIVE", startDate: "2024-01-01", endDate: "2024-01-14", projectId: "proj1" }],
        activeSprint: { id: "s1", name: "Current Sprint", status: "ACTIVE", startDate: "2024-01-01", endDate: "2024-01-14", goal: "Ship features", projectId: "proj1" },
        avgVelocity: 0,
      },
      isLoading: false,
    });
    render(<SprintList projectId="proj1" />);
    expect(screen.getByText(/Active Sprint/i)).toBeDefined();
    // Current Sprint appears in both the banner and sprint card
    const currentElements = screen.getAllByText(/Current Sprint/i);
    expect(currentElements.length).toBeGreaterThanOrEqual(1);
  });
});
