import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjects", () => ({
  useProjectDetailsBySlug: vi.fn(),
}));

vi.mock("@/components/Dashboard/ProjectDetails/ViewList", () => ({
  default: ({ projectId }: { projectId: string }) => (
    <div data-testid="view-list">ViewList for {projectId}</div>
  ),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ workspaceSlug: "ws1", projectSlug: "proj1" }),
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import ProjectViewsPage from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/views/page";

describe("ProjectViewsPage", () => {
  it("should render the heading and description", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1" },
    });

    render(<ProjectViewsPage />);
    expect(screen.getByText("Saved Views")).toBeDefined();
    expect(screen.getByText(/Create custom views/i)).toBeDefined();
  });

  it("should render ViewList when project is loaded", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1" },
    });

    render(<ProjectViewsPage />);
    expect(screen.getByTestId("view-list")).toBeDefined();
    expect(screen.getByText("ViewList for proj1")).toBeDefined();
  });

  it("should show loading state when project is not yet loaded", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: null,
    });

    render(<ProjectViewsPage />);
    expect(screen.getByText(/Loading project/i)).toBeDefined();
  });

  it("should render a back button", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1" },
    });

    render(<ProjectViewsPage />);
    expect(screen.getByText("Back")).toBeDefined();
  });

  it("should render a link to project overview", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1" },
    });

    render(<ProjectViewsPage />);
    expect(screen.getByText("Go to project overview")).toBeDefined();
  });
});
