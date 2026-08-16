import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useUser", () => ({
  useUserProfile: vi.fn(),
}));

import { ProjectMemberOnly } from "@/components/Dashboard/ProjectDetails/ProjectMemberOnly";
import { useUserProfile } from "@/hooks/useUser";

const projectBase = {
  id: "proj-1",
  slug: "web-app",
  name: "Web App",
  color: "#667eea",
  status: "ACTIVE",
  priority: "MEDIUM",
  workspaceId: "ws-1",
  isAdmin: false,
  members: [] as any[],
};

describe("ProjectMemberOnly", () => {
  beforeEach(() => {
    (useUserProfile as any).mockReturnValue({ userId: "user-1", isLoading: false });
  });

  it("renders children for a workspace admin", () => {
    render(
      <ProjectMemberOnly project={{ ...projectBase, isAdmin: true }}>
        <div data-testid="content">Member content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("renders children for any project member (not just managers)", () => {
    render(
      <ProjectMemberOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "COLLABORATOR" }],
        }}
      >
        <div data-testid="content">Member content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("renders children for a project VIEWER member", () => {
    render(
      <ProjectMemberOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "VIEWER" }],
        }}
      >
        <div data-testid="content">Member content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("blocks non-members with the access restricted screen", () => {
    render(
      <ProjectMemberOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-2", user: { id: "user-2" }, role: "COLLABORATOR" }],
        }}
      >
        <div data-testid="content">Member content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByText("Access Restricted")).toBeDefined();
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("shows a loader while the user profile resolves", () => {
    (useUserProfile as any).mockReturnValue({ userId: undefined, isLoading: true });
    render(
      <ProjectMemberOnly project={projectBase}>
        <div data-testid="content">Member content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.queryByTestId("content")).toBeNull();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });
});
