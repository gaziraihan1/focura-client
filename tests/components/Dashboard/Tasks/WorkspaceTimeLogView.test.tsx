/**
 * tests/components/Dashboard/Tasks/WorkspaceTimeLogView.test.tsx
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockEntries = [
  {
    id: "entry-1",
    taskId: "task-1",
    userId: "user-2",
    duration: 30,
    category: "DEEP_WORK",
    billable: true,
    description: "Focused work",
    startedAt: "2024-06-01T10:00:00.000Z",
    endedAt: null,
    task: { id: "task-1", title: "Build landing page", project: { id: "proj-1", name: "Website" } },
    user: { id: "user-2", name: "Bob", email: "bob@test.com" },
  },
  {
    id: "entry-2",
    taskId: "task-2",
    userId: "user-1",
    duration: 90,
    category: "MEETINGS",
    billable: false,
    description: null,
    startedAt: "2024-06-02T10:00:00.000Z",
    endedAt: null,
    task: { id: "task-2", title: "Sprint planning", project: null },
    user: { id: "user-1", name: "Alice", email: "alice@test.com" },
  },
];

const mockUseWorkspaceTimeEntries = vi.fn(() => ({ data: mockEntries, isLoading: false }));
const mockUseWorkspace = vi.fn(() => ({ data: { id: "ws-1", name: "Test WS", slug: "test-ws" } }));

vi.mock("@/hooks/useTimeEntries", () => ({
  useWorkspaceTimeEntries: (...args: unknown[]) => mockUseWorkspaceTimeEntries(...args),
}));

const mockUseWorkspaceMembers = vi.fn(() => ({
  data: [
    { id: "wm-1", userId: "user-1", role: "OWNER", user: { id: "user-1", name: "Alice" } },
    { id: "wm-2", userId: "user-2", role: "MEMBER", user: { id: "user-2", name: "Bob" } },
  ],
}));

vi.mock("@/hooks/useWorkspaceQueries", () => ({
  useWorkspace: (...args: unknown[]) => mockUseWorkspace(...args),
  useWorkspaceMembers: (...args: unknown[]) => mockUseWorkspaceMembers(...args),
}));

const mockUseWorkspaceRoleFromWorkspace = vi.fn(() => ({
  isOwner: true,
  isAdmin: false,
}));

vi.mock("@/hooks/useWorkspaceRole", () => ({
  useWorkspaceRoleFromWorkspace: (...args: unknown[]) =>
    mockUseWorkspaceRoleFromWorkspace(...args),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    Clock: icon("Clock"),
    Briefcase: icon("Briefcase"),
    CalendarDays: icon("CalendarDays"),
    Folder: icon("Folder"),
    X: icon("X"),
  };
});

import { WorkspaceTimeLogView } from "@/components/Dashboard/Tasks/WorkspaceTimeLogView";

describe("WorkspaceTimeLogView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWorkspaceTimeEntries.mockReturnValue({ data: mockEntries, isLoading: false });
    mockUseWorkspace.mockReturnValue({ data: { id: "ws-1", name: "Test WS", slug: "test-ws" } });
    // Default: owner/admin — sees all entries with author names + member filter.
    mockUseWorkspaceRoleFromWorkspace.mockReturnValue({ isOwner: true, isAdmin: false });
    mockUseWorkspaceMembers.mockReturnValue({
      data: [
        { id: "wm-1", userId: "user-1", role: "OWNER", user: { id: "user-1", name: "Alice" } },
        { id: "wm-2", userId: "user-2", role: "MEMBER", user: { id: "user-2", name: "Bob" } },
      ],
    });
  });

  it("renders workspace entries with task titles, project names, authors, and durations", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    expect(screen.getByText("Time Log")).toBeInTheDocument();
    expect(screen.getByText("Build landing page")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Sprint planning")).toBeInTheDocument();
    // Author names appear both as entry authors and as dropdown options.
    expect(screen.getAllByText("Bob").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Alice").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("30m")).toBeInTheDocument();
    expect(screen.getByText("1h 30m")).toBeInTheDocument();
  });

  it("links tasks into the workspace tasks route", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    const taskLink = screen.getByText("Build landing page");
    expect(taskLink.getAttribute("href")).toBe("/dashboard/workspaces/test-ws/tasks/task-1");
  });

  it("shows the summed total duration", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);
    expect(screen.getByText("2h")).toBeInTheDocument(); // 30 + 90 = 120
  });

  it("renders the empty state when there are no entries", () => {
    mockUseWorkspaceTimeEntries.mockReturnValue({ data: [], isLoading: false });
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);
    expect(screen.getByText(/no time entries yet/i)).toBeInTheDocument();
  });

  it("passes the resolved workspace id and the selected date range to the hook", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    const from = screen.getByLabelText("From date");
    const to = screen.getByLabelText("To date");

    fireEvent.change(from, { target: { value: "2026-08-01" } });
    fireEvent.change(to, { target: { value: "2026-08-05" } });

    const call = mockUseWorkspaceTimeEntries.mock.calls[mockUseWorkspaceTimeEntries.mock.calls.length - 1];
    expect(call[0]).toBe("ws-1");
    const fromIso = call[1] as string;
    const toIso = call[2] as string;

    expect(new Date(fromIso).toLocaleDateString("en-CA")).toBe("2026-08-01");
    expect(new Date(toIso).toLocaleDateString("en-CA")).toBe("2026-08-05");
    expect(toIso.endsWith("Z")).toBe(true);
  });

  it("hides author names for normal members and shows member copy", () => {
    mockUseWorkspaceRoleFromWorkspace.mockReturnValue({ isOwner: false, isAdmin: false });
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    expect(screen.getByText(/Your time entries on tasks in this workspace/)).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    // Task + durations still render.
    expect(screen.getByText("Build landing page")).toBeInTheDocument();
    expect(screen.getByText("30m")).toBeInTheDocument();
  });

  it("shows the all-members copy and author names for admins", () => {
    mockUseWorkspaceRoleFromWorkspace.mockReturnValue({ isOwner: false, isAdmin: true });
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    expect(screen.getByText(/Every time entry logged on tasks in this workspace/)).toBeInTheDocument();
    // Author names appear both as entry authors and as dropdown options.
    expect(screen.getAllByText("Bob").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Alice").length).toBeGreaterThanOrEqual(1);
  });

  it("hides author names for guests too", () => {
    mockUseWorkspaceRoleFromWorkspace.mockReturnValue({ isOwner: false, isAdmin: false });
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    expect(screen.getByText("Build landing page")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("shows the member filter for admins/owners only", () => {
    // Owner — filter visible.
    const { unmount } = render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);
    expect(screen.getByLabelText("Filter by member")).toBeInTheDocument();
    unmount();

    // Member — filter hidden.
    mockUseWorkspaceRoleFromWorkspace.mockReturnValue({ isOwner: false, isAdmin: false });
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);
    expect(screen.queryByLabelText("Filter by member")).not.toBeInTheDocument();
  });

  it("passes the selected memberUserId to the hook when filtering", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    fireEvent.change(screen.getByLabelText("Filter by member"), {
      target: { value: "user-2" },
    });

    const call = mockUseWorkspaceTimeEntries.mock.calls[mockUseWorkspaceTimeEntries.mock.calls.length - 1];
    expect(call[3]).toBe("user-2");
  });

  it("passes no memberUserId when All members is selected", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);
    const call = mockUseWorkspaceTimeEntries.mock.calls[mockUseWorkspaceTimeEntries.mock.calls.length - 1];
    expect(call[3]).toBeUndefined();
  });

  it("ignores a member filter for normal members (never forwards memberUserId)", () => {
    mockUseWorkspaceRoleFromWorkspace.mockReturnValue({ isOwner: false, isAdmin: false });
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    expect(screen.queryByLabelText("Filter by member")).not.toBeInTheDocument();
    const call = mockUseWorkspaceTimeEntries.mock.calls[mockUseWorkspaceTimeEntries.mock.calls.length - 1];
    expect(call[3]).toBeUndefined();
  });

  it("clears the member filter when Clear is pressed", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    fireEvent.change(screen.getByLabelText("Filter by member"), {
      target: { value: "user-2" },
    });
    fireEvent.click(screen.getByText("Clear"));

    const call = mockUseWorkspaceTimeEntries.mock.calls[mockUseWorkspaceTimeEntries.mock.calls.length - 1];
    expect(call[3]).toBeUndefined();
  });
});
