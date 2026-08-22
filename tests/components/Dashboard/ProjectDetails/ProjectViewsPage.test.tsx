import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useProjects", () => ({
  useProjectDetailsBySlug: vi.fn(),
}));

vi.mock("@/hooks/useUser", () => ({
  useUserProfile: () => ({ userId: "user-1", isLoading: false }),
}));

vi.mock("@/components/Dashboard/ProjectDetails/ViewList", () => ({
  default: ({ projectId }: { projectId: string }) => (
    <div data-testid="view-list">ViewList for {projectId}</div>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { ViewsPageContent } from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/views/ViewsPageContent";

describe("ProjectViewsPage", () => {
  it("should render the heading and description", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1", isAdmin: true },
    });

    render(<ViewsPageContent workspaceSlug="ws1" projectSlug="proj1" />);
    expect(screen.getByText("Saved Views")).toBeDefined();
    expect(screen.getByText(/Create custom views/i)).toBeDefined();
  });

  it("should render ViewList when project is loaded", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1", isAdmin: true },
    });

    render(<ViewsPageContent workspaceSlug="ws1" projectSlug="proj1" />);
    expect(screen.getByTestId("view-list")).toBeDefined();
    expect(screen.getByText("ViewList for proj1")).toBeDefined();
  });

  it("should show the access restricted screen for non-managers", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1", isAdmin: false, members: [] },
    });

    render(<ViewsPageContent workspaceSlug="ws1" projectSlug="proj1" />);
    expect(screen.getByText("Access Restricted")).toBeDefined();
    expect(screen.queryByTestId("view-list")).toBeNull();
  });

  it("should show loading state when project is not yet loaded", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: null,
    });

    render(<ViewsPageContent workspaceSlug="ws1" projectSlug="proj1" />);
    expect(screen.queryByTestId("view-list")).toBeNull();
  });

  it("should render a back button", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1", isAdmin: true },
    });

    render(<ViewsPageContent workspaceSlug="ws1" projectSlug="proj1" />);
    expect(screen.getByText("Back")).toBeDefined();
  });

  it("should render a link to project overview", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: { id: "proj1", isAdmin: true },
    });

    render(<ViewsPageContent workspaceSlug="ws1" projectSlug="proj1" />);
    expect(screen.getByText("Go to project overview")).toBeDefined();
  });
});
