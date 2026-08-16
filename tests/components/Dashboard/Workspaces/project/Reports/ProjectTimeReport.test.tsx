import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockReport = {
  totalMinutes: 300,
  totalHours: 5,
  entryCount: 3,
  entries: [
    {
      id: "e1",
      taskId: "t1",
      taskTitle: "Build report",
      userId: "u1",
      userName: "Alice",
      userEmail: "alice@x.com",
      duration: 120,
      category: "DEEP_WORK",
      billable: true,
      description: "Work",
      startedAt: "2024-06-08T10:00:00.000Z",
      endedAt: null,
    },
    {
      id: "e2",
      taskId: "t2",
      taskTitle: "Weekly sync",
      userId: "u2",
      userName: "Bob",
      userEmail: "bob@x.com",
      duration: 60,
      category: "MEETINGS",
      billable: false,
      description: null,
      startedAt: "2024-06-07T10:00:00.000Z",
      endedAt: null,
    },
    {
      id: "e3",
      taskId: "t1",
      taskTitle: "Build report",
      userId: "u1",
      userName: "Alice",
      userEmail: "alice@x.com",
      duration: 120,
      category: "DEEP_WORK",
      billable: false,
      description: "More work",
      startedAt: "2024-06-06T10:00:00.000Z",
      endedAt: null,
    },
  ],
  byTask: [
    { id: "t1", name: "Build report", minutes: 240, hours: 4 },
    { id: "t2", name: "Weekly sync", minutes: 60, hours: 1 },
  ],
  byMember: [
    { id: "u1", name: "Alice", minutes: 240, hours: 4 },
    { id: "u2", name: "Bob", minutes: 60, hours: 1 },
  ],
  byCategory: [
    { category: "DEEP_WORK", minutes: 240, hours: 4 },
    { category: "MEETINGS", minutes: 60, hours: 1 },
  ],
};

const mockUseProjectTimeReport = vi.fn();

vi.mock("@/hooks/useProjectAnalytics", () => ({
  useProjectTimeReport: (...args: any[]) => mockUseProjectTimeReport(...args),
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
    Loader2: icon("Loader2"),
    AlertCircle: icon("AlertCircle"),
    RefreshCw: icon("RefreshCw"),
    Users: icon("Users"),
    ListTodo: icon("ListTodo"),
    PieChart: icon("PieChart"),
    Briefcase: icon("Briefcase"),
    Timer: icon("Timer"),
  };
});

import { ProjectTimeReport } from "@/components/Dashboard/Workspaces/project/Reports/ProjectTimeReport";

describe("ProjectTimeReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProjectTimeReport.mockReturnValue({
      data: mockReport,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it("renders the header and summary stats", () => {
    render(
      <ProjectTimeReport workspaceId="w1" projectId="p1" projectName="My Project" />
    );
    expect(screen.getByText("Time Report")).toBeInTheDocument();
    expect(screen.getByText("My Project")).toBeInTheDocument();
    expect(screen.getByText("5.0h")).toBeInTheDocument(); // total hours
    expect(screen.getByText("3")).toBeInTheDocument(); // entries
    expect(screen.getByText("2.0h")).toBeInTheDocument(); // billable
  });

  it("renders member and task rollups", () => {
    render(
      <ProjectTimeReport workspaceId="w1" projectId="p1" projectName="My Project" />
    );
    expect(screen.getByText("By Member")).toBeInTheDocument();
    expect(screen.getByText("By Task")).toBeInTheDocument();
    expect(screen.getAllByText("Alice").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Build report").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the category breakdown and recent entries table", () => {
    render(
      <ProjectTimeReport workspaceId="w1" projectId="p1" projectName="My Project" />
    );
    expect(screen.getByText("By Category")).toBeInTheDocument();
    // These labels appear in both the rollups and the entries table
    expect(screen.getAllByText("Deep Work").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Recent Entries")).toBeInTheDocument();
    expect(screen.getAllByText("Weekly sync").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("3 shown")).toBeInTheDocument();
  });

  it("switches the days range and refetches with the new window", () => {
    render(
      <ProjectTimeReport workspaceId="w1" projectId="p1" projectName="My Project" />
    );
    fireEvent.click(screen.getByRole("button", { name: "30d" }));
    expect(mockUseProjectTimeReport).toHaveBeenLastCalledWith("w1", "p1", 30);
  });

  it("renders the loading state", () => {
    mockUseProjectTimeReport.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    render(
      <ProjectTimeReport workspaceId="w1" projectId="p1" projectName="My Project" />
    );
    expect(screen.getByTestId("Loader2-icon")).toBeInTheDocument();
    expect(screen.getByText(/Loading time report/)).toBeInTheDocument();
  });

  it("renders the error state with a working retry button", () => {
    const refetch = vi.fn();
    mockUseProjectTimeReport.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    render(
      <ProjectTimeReport workspaceId="w1" projectId="p1" projectName="My Project" />
    );
    expect(screen.getByText(/Failed to load the time report/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows an empty state when there is no time logged", () => {
    mockUseProjectTimeReport.mockReturnValue({
      data: {
        totalMinutes: 0,
        totalHours: 0,
        entryCount: 0,
        entries: [],
        byTask: [],
        byMember: [],
        byCategory: [],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(
      <ProjectTimeReport workspaceId="w1" projectId="p1" projectName="My Project" />
    );
    expect(screen.getAllByText(/No time logged in this period/).length).toBeGreaterThanOrEqual(1);
    // "0.0h" appears in both the total and billable stat cards
    expect(screen.getAllByText("0.0h").length).toBeGreaterThanOrEqual(1);
  });
});
