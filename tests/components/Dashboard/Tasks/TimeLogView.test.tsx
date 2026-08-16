import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockEntries = [
  {
    id: "entry-1",
    taskId: "task-1",
    userId: "user-1",
    duration: 30,
    category: "DEEP_WORK",
    billable: true,
    description: "Focused work",
    startedAt: "2024-06-01T10:00:00.000Z",
    endedAt: null,
    task: { id: "task-1", title: "Build landing page", project: { id: "proj-1", name: "Website" } },
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
  },
];

const mockUseMyTimeEntries = vi.fn(() => ({ data: mockEntries, isLoading: false }));

vi.mock("@/hooks/useTimeEntries", () => ({
  useMyTimeEntries: (...args: unknown[]) => mockUseMyTimeEntries(...args),
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

import { TimeLogView } from "@/components/Dashboard/Tasks/TimeLogView";

describe("TimeLogView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMyTimeEntries.mockReturnValue({ data: mockEntries, isLoading: false });
  });

  it("renders entries with task titles, project names, and durations", () => {
    render(<TimeLogView />);

    expect(screen.getByText("Build landing page")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Sprint planning")).toBeInTheDocument();
    expect(screen.getByText("30m")).toBeInTheDocument();
    expect(screen.getByText("1h 30m")).toBeInTheDocument();
  });

  it("shows the summed total duration", () => {
    render(<TimeLogView />);
    expect(screen.getByText("2h")).toBeInTheDocument(); // 30 + 90 = 120
  });

  it("renders the empty state when there are no entries", () => {
    mockUseMyTimeEntries.mockReturnValue({ data: [], isLoading: false });
    render(<TimeLogView />);
    expect(screen.getByText(/no time entries yet/i)).toBeInTheDocument();
  });

  it("passes the selected date range to the hook as ISO bounds", () => {
    render(<TimeLogView />);

    const from = screen.getByLabelText("From date");
    const to = screen.getByLabelText("To date");

    fireEvent.change(from, { target: { value: "2026-08-01" } });
    fireEvent.change(to, { target: { value: "2026-08-05" } });

    const call = mockUseMyTimeEntries.mock.calls[mockUseMyTimeEntries.mock.calls.length - 1];
    const fromIso = call[0] as string;
    const toIso = call[1] as string;

    // Bounds are ISO datetimes: from = start of day, to = end of day (inclusive).
    expect(new Date(fromIso).toLocaleDateString("en-CA")).toBe("2026-08-01");
    expect(new Date(toIso).toLocaleDateString("en-CA")).toBe("2026-08-05");
    expect(toIso.endsWith("Z")).toBe(true);
  });
});
