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
        <div data-testid="content">Protected content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("renders children for a project member (MANAGER)", () => {
    render(
      <ProjectMemberOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "MANAGER" }],
        }}
      >
        <div data-testid="content">Protected content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("renders children for a project member (COLLABORATOR)", () => {
    render(
      <ProjectMemberOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "COLLABORATOR" }],
        }}
      >
        <div data-testid="content">Protected content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("renders children for a project member (VIEWER)", () => {
    render(
      <ProjectMemberOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "VIEWER" }],
        }}
      >
        <div data-testid="content">Protected content</div>
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
          members: [{ userId: "user-999", user: { id: "user-999" }, role: "COLLABORATOR" }],
        }}
      >
        <div data-testid="content">Protected content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByText("Access Restricted")).toBeDefined();
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("blocks non-members when members list is empty", () => {
    render(
      <ProjectMemberOnly project={{ ...projectBase, members: [] }}>
        <div data-testid="content">Protected content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.getByText("Access Restricted")).toBeDefined();
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("shows a loader while the user profile resolves", () => {
    (useUserProfile as any).mockReturnValue({ userId: undefined, isLoading: true });
    render(
      <ProjectMemberOnly project={projectBase}>
        <div data-testid="content">Protected content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.queryByTestId("content")).toBeNull();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("shows a loader when project is not provided", () => {
    render(
      <ProjectMemberOnly project={undefined}>
        <div data-testid="content">Protected content</div>
      </ProjectMemberOnly>,
    );
    expect(screen.queryByTestId("content")).toBeNull();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });
});
