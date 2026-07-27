import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useProjectSprints: vi.fn(),
  useCreateSprint: vi.fn(),
  useCompleteSprint: vi.fn(),
  useDeleteSprint: vi.fn(),
}));

import SprintList from "@/components/Dashboard/ProjectDetails/SprintList";
import { useProjectSprints } from "@/hooks/useProjectFeatures";

describe("SprintList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    (useProjectSprints as any).mockReturnValue({ data: null, isLoading: true });
    render(<SprintList projectId="proj1" />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
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
