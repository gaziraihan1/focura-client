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

vi.mock("@/hooks/useWorkspaceQueries", () => ({
  useWorkspace: (...args: unknown[]) => mockUseWorkspace(...args),
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
  });

  it("renders workspace entries with task titles, project names, authors, and durations", () => {
    render(<WorkspaceTimeLogView workspaceSlug="test-ws" />);

    expect(screen.getByText("Time Log")).toBeInTheDocument();
    expect(screen.getByText("Build landing page")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Sprint planning")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
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
});
