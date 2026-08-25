import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useUser", () => ({
  useUserProfile: vi.fn(),
}));

import { ProjectManagerOnly } from "@/components/dashboard/projects/project-details/ProjectManagerOnly";
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

describe("ProjectManagerOnly", () => {
  beforeEach(() => {
    (useUserProfile as any).mockReturnValue({ userId: "user-1", isLoading: false });
  });

  it("renders children for a workspace admin", () => {
    (useUserProfile as any).mockReturnValue({ userId: "user-1", isLoading: false });
    render(
      <ProjectManagerOnly project={{ ...projectBase, isAdmin: true }}>
        <div data-testid="content">Secret manager content</div>
      </ProjectManagerOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("renders children for a project MANAGER member", () => {
    render(
      <ProjectManagerOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "MANAGER" }],
        }}
      >
        <div data-testid="content">Secret manager content</div>
      </ProjectManagerOnly>,
    );
    expect(screen.getByTestId("content")).toBeDefined();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });

  it("blocks collaborators with the access restricted screen", () => {
    render(
      <ProjectManagerOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "COLLABORATOR" }],
        }}
      >
        <div data-testid="content">Secret manager content</div>
      </ProjectManagerOnly>,
    );
    expect(screen.getByText("Access Restricted")).toBeDefined();
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("blocks viewers with the access restricted screen", () => {
    render(
      <ProjectManagerOnly
        project={{
          ...projectBase,
          members: [{ userId: "user-1", user: { id: "user-1" }, role: "VIEWER" }],
        }}
      >
        <div data-testid="content">Secret manager content</div>
      </ProjectManagerOnly>,
    );
    expect(screen.getByText("Access Restricted")).toBeDefined();
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("shows a loader while the user profile resolves", () => {
    (useUserProfile as any).mockReturnValue({ userId: undefined, isLoading: true });
    render(
      <ProjectManagerOnly project={projectBase}>
        <div data-testid="content">Secret manager content</div>
      </ProjectManagerOnly>,
    );
    expect(screen.queryByTestId("content")).toBeNull();
    expect(screen.queryByText("Access Restricted")).toBeNull();
  });
});
