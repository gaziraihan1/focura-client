import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useParams: () => ({ workspaceSlug: "acme", projectSlug: "web-app" }),
  usePathname: () => "/dashboard/workspaces/acme/projects/web-app/tasks",
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

vi.mock("@/hooks/useProjects", () => ({
  useProjectDetailsBySlug: vi.fn(),
}));

vi.mock("@/hooks/useUser", () => ({
  useUserProfile: () => ({ userId: "user-1", user: { id: "user-1" } }),
}));

vi.mock("@/components/Dashboard/Workspaces/project/Layout", () => ({
  MobileDrawer: () => <div data-testid="mobile-drawer" />,
  MobileTopBar: () => <div data-testid="mobile-topbar" />,
  SidebarContent: () => <div data-testid="sidebar-content" />,
  useProjectNav: () => [],
}));

vi.mock("@/lib/react-query/query-client", () => ({
  qc: { removeQueries: vi.fn() },
}));

import ProjectLayout from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/layout";
import { useProjectDetailsBySlug } from "@/hooks/useProjects";
import { qc } from "@/lib/react-query/query-client";

describe("ProjectLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the access-denied screen and clears stale caches on a 404", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 404 } },
    });
    render(
      <ProjectLayout>
        <div>Secret page content</div>
      </ProjectLayout>,
    );
    expect(screen.getByText("Access Denied")).toBeDefined();
    // Children must not render for a removed member
    expect(screen.queryByText("Secret page content")).toBeNull();
    // Stale project + feature caches are dropped so nothing keeps rendering from cache
    expect(qc.removeQueries).toHaveBeenCalledWith({ queryKey: ["projects", "detail"] });
    expect(qc.removeQueries).toHaveBeenCalledWith({ queryKey: ["sections"] });
    expect(qc.removeQueries).toHaveBeenCalledWith({ queryKey: ["sprints"] });
    expect(qc.removeQueries).toHaveBeenCalledWith({ queryKey: ["milestones"] });
    expect(qc.removeQueries).toHaveBeenCalledWith({ queryKey: ["project-views"] });
  });

  it("renders the access-denied screen and blocks children on a 403", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 403 } },
    });
    render(
      <ProjectLayout>
        <div>Secret page content</div>
      </ProjectLayout>,
    );
    expect(screen.getByText("Access Denied")).toBeDefined();
    expect(screen.queryByText("Secret page content")).toBeNull();
    expect(qc.removeQueries).toHaveBeenCalledWith({ queryKey: ["projects", "detail"] });
  });

  it("renders children normally when the project is accessible", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: {
        name: "Web App",
        status: "ACTIVE",
        color: "#667eea",
        workspaceId: "w1",
        members: [{ userId: "user-1" }],
      },
      isLoading: false,
      error: undefined,
    });
    render(
      <ProjectLayout>
        <div>Page content</div>
      </ProjectLayout>,
    );
    expect(screen.getByText("Page content")).toBeDefined();
    expect(qc.removeQueries).not.toHaveBeenCalled();
  });

  it("does not block children or clear caches for non-access errors", () => {
    (useProjectDetailsBySlug as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });
    render(
      <ProjectLayout>
        <div>Page content</div>
      </ProjectLayout>,
    );
    expect(screen.getByText("Page content")).toBeDefined();
    expect(qc.removeQueries).not.toHaveBeenCalled();
  });

  it("self-heals a stale member list by refetching before denying access", async () => {
    let includeMember = false;
    const refetch = vi.fn(async () => {
      includeMember = true;
    });

    // Simulates a collaborator whose browser cached the project detail before
    // they were added: the first read has an empty member list, the refetch
    // (after the backend invalidation) includes them.
    (useProjectDetailsBySlug as any).mockImplementation(() => ({
      data: {
        name: "Web App",
        status: "ACTIVE",
        color: "#667eea",
        workspaceId: "w1",
        members: includeMember ? [{ userId: "user-1" }] : [],
        isAdmin: false,
      },
      isLoading: false,
      error: undefined,
      refetch,
    }));

    render(
      <ProjectLayout>
        <div>Secret page content</div>
      </ProjectLayout>,
    );

    // The gate denies once, refetches, and then lets the user in
    expect(refetch).toHaveBeenCalled();
    expect(await screen.findByText("Secret page content")).toBeDefined();
    expect(screen.queryByText("Access Denied")).toBeNull();
    // A self-heal must not wipe the shared caches
    expect(qc.removeQueries).not.toHaveBeenCalled();
  });
});
