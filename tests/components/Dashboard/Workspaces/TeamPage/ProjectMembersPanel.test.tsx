import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectMembersPanel } from "@/components/Dashboard/Workspaces/TeamPage/ProjectMembersPanel";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: any) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { Users: icon("Users") };
});

vi.mock("@/hooks/useProjects", () => ({
  useProjectDetails: vi.fn(),
}));

vi.mock("@/components/Dashboard/Workspaces/TeamPage/RoleDropdown", () => ({
  RoleDropdown: (props: any) => <div data-testid="role-dropdown">{props.currentRole}</div>,
}));

vi.mock("@/components/Dashboard/Workspaces/TeamPage/EmptyState", () => ({
  EmptyState: ({ title }: any) => <div data-testid="empty-state">{title}</div>,
}));

vi.mock("@/components/Shared/Avatar", () => ({
  Avatar: (props: any) => <div data-testid="avatar">{props.name}</div>,
}));

vi.mock("@/components/Dashboard/Workspaces/TeamPage/RoleBadge", () => ({
  RoleBadge: ({ role }: any) => <span data-testid="role-badge">{role}</span>,
}));

import { useProjectDetails } from "@/hooks/useProjects";

const mockMembers = [
  { id: "m1", role: "MANAGER", user: { id: "u1", name: "Alice", email: "alice@test.com", image: null } },
  { id: "m2", role: "MEMBER", user: { id: "u2", name: "Bob", email: "bob@test.com", image: null } },
];

describe("ProjectMembersPanel", () => {
  it("shows loading state", () => {
    vi.mocked(useProjectDetails).mockReturnValue({ data: null, isLoading: true } as any);
    render(<ProjectMembersPanel projectId="p1" currentUserId="u1" canManage={false} onRoleChange={vi.fn()} />);
    expect(screen.getByText("Project Members")).toBeInTheDocument();
  });

  it("shows empty state when no members", () => {
    vi.mocked(useProjectDetails).mockReturnValue({ data: { members: [] }, isLoading: false } as any);
    render(<ProjectMembersPanel projectId="p1" currentUserId="u1" canManage={false} onRoleChange={vi.fn()} />);
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No members yet");
  });

  it("renders member names and emails", () => {
    vi.mocked(useProjectDetails).mockReturnValue({ data: { members: mockMembers }, isLoading: false } as any);
    render(<ProjectMembersPanel projectId="p1" currentUserId="u1" canManage={false} onRoleChange={vi.fn()} />);
    expect(screen.getAllByText("Alice").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(screen.getAllByText("Bob").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("bob@test.com")).toBeInTheDocument();
  });

  it("shows role badge when cannot manage", () => {
    vi.mocked(useProjectDetails).mockReturnValue({ data: { members: mockMembers }, isLoading: false } as any);
    render(<ProjectMembersPanel projectId="p1" currentUserId="u3" canManage={false} onRoleChange={vi.fn()} />);
    expect(screen.getAllByTestId("role-badge").length).toBe(2);
  });
});
