import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjectFeatures", () => ({
  useProjectMilestones: vi.fn(),
  useCreateMilestone: vi.fn(),
  useDeleteMilestone: vi.fn(),
  useUpdateMilestoneProgress: vi.fn(),
}));

import MilestoneList from "@/components/Dashboard/ProjectDetails/MilestoneList";
import { useProjectMilestones } from "@/hooks/useProjectFeatures";

describe("MilestoneList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    (useProjectMilestones as any).mockReturnValue({ data: null, isLoading: true });
    render(<MilestoneList projectId="proj1" />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("should show empty state when no milestones", () => {
    (useProjectMilestones as any).mockReturnValue({
      data: { total: 0, completed: 0, atRisk: 0, delayed: 0, onTrack: 0, avgProgress: 0, milestones: [] },
      isLoading: false,
    });
    render(<MilestoneList projectId="proj1" />);
    expect(screen.getByText(/No milestones yet/i)).toBeDefined();
  });

  it("should render milestones", () => {
    (useProjectMilestones as any).mockReturnValue({
      data: {
        total: 1,
        completed: 0,
        atRisk: 0,
        delayed: 0,
        onTrack: 1,
        avgProgress: 50,
        milestones: [
          { id: "m1", title: "Launch MVP", description: "First release", status: "ON_TRACK", progress: 50, color: "#10b981", completed: false, projectId: "proj1" },
        ],
      },
      isLoading: false,
    });
    render(<MilestoneList projectId="proj1" />);
    expect(screen.getByText("Launch MVP")).toBeDefined();
    // Use getAllByText since "On Track" appears as both label and stat badge
    const onTrackElements = screen.getAllByText("On Track");
    expect(onTrackElements.length).toBeGreaterThanOrEqual(1);
  });

  it("should show stat cards with counts", () => {
    (useProjectMilestones as any).mockReturnValue({
      data: {
        total: 4, completed: 1, atRisk: 1, delayed: 1, onTrack: 1, avgProgress: 47,
        milestones: [],
      },
      isLoading: false,
    });
    render(<MilestoneList projectId="proj1" />);
    // Several stat cards show different numbers, verify total exists
    expect(screen.getByText("4")).toBeDefined();
  });
});
