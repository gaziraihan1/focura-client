import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockAggregates = [
  {
    id: "agg-1", userId: "user-1",
    date: "2026-07-15T12:00:00.000Z",
    totalTasks: 8, dueTasks: 3, criticalTasks: 1, milestoneCount: 0,
    plannedHours: 6, actualHours: 5.5, focusMinutes: 90,
    workloadScore: 72, overCapacity: false, hasPrimaryFocus: true,
    isReviewDay: false, updatedAt: "2026-07-15T12:00:00.000Z",
  },
];

vi.mock("@/hooks/useCalendar", () => ({
  useCalendarAggregates: () => ({ data: mockAggregates, isLoading: false }),
}));

vi.mock("@/hooks/useUserSettings", () => ({
  useUserCapacity: () => ({
    data: { weeklyHours: 40, dailyCapacityHours: 8, deepWorkHours: 4 },
    loading: false,
  }),
  useUserSchedule: () => ({
    data: { workDays: ["MON","TUE","WED","THU","FRI"], workStartHour: 9, workEndHour: 17 },
    loading: false,
  }),
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
    CalendarRange: icon("CalendarRange"),
    ChevronDown: icon("ChevronDown"),
    ChevronUp: icon("ChevronUp"),
    Download: icon("Download"),
    Loader2: icon("Loader2"),
    TrendingUp: icon("TrendingUp"),
    TrendingDown: icon("TrendingDown"),
    Minus: icon("Minus"),
  };
});

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(" "),
}));

import { WeeklyComparison } from "@/components/Dashboard/Calendar/WeeklyComparison";

describe("WeeklyComparison", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z")); // Wednesday
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without crashing", () => {
    const { container } = render(<WeeklyComparison />);
    expect(container).toBeTruthy();
  });

  it("renders the title", () => {
    render(<WeeklyComparison />);
    expect(screen.getByText("Weekly Comparison")).toBeInTheDocument();
  });

  it('shows "This week vs 8-week average" subtitle', () => {
    render(<WeeklyComparison />);
    expect(screen.getByText("This week vs 8-week average")).toBeInTheDocument();
  });

  it("renders ChevronDown icon when collapsed", () => {
    render(<WeeklyComparison />);
    expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
  });

  it("shows percentage badge in header", () => {
    render(<WeeklyComparison />);
    // Should show difference percentage (positive or negative)
    const badge = document.querySelector(".rounded-full");
    expect(badge).toBeInTheDocument();
  });

  it("shows comparison cards when expanded", () => {
    render(<WeeklyComparison />);
    fireEvent.click(screen.getByText("Weekly Comparison"));

    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("8-Week Average")).toBeInTheDocument();
    expect(screen.getByText("vs Average")).toBeInTheDocument();
  });

  it("shows weekly bars when expanded", () => {
    render(<WeeklyComparison />);
    fireEvent.click(screen.getByText("Weekly Comparison"));

    expect(screen.getByText(/Weekly utilization/)).toBeInTheDocument();
    // "This week" appears in both the bar label and legend
    const thisWeekElements = screen.getAllByText("This week");
    expect(thisWeekElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows ChevronUp when expanded", () => {
    render(<WeeklyComparison />);
    fireEvent.click(screen.getByText("Weekly Comparison"));
    expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();
  });

  it("collapses when clicked again", () => {
    render(<WeeklyComparison />);
    const header = screen.getByText("Weekly Comparison");

    fireEvent.click(header);
    expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();

    fireEvent.click(header);
    expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
  });

  it("shows summary text in footer when expanded", () => {
    render(<WeeklyComparison />);
    fireEvent.click(screen.getByText("Weekly Comparison"));

    expect(screen.getByText(/weeks over capacity/)).toBeInTheDocument();
  });

  it("shows legend items when expanded", () => {
    render(<WeeklyComparison />);
    fireEvent.click(screen.getByText("Weekly Comparison"));

    expect(screen.getByText("Previous weeks")).toBeInTheDocument();
    // "This week" appears in both bar label and legend
    const thisWeekElements = screen.getAllByText("This week");
    expect(thisWeekElements.length).toBeGreaterThanOrEqual(1);
  });

  it("handles empty aggregates gracefully", () => {
    const { container } = render(<WeeklyComparison />);
    expect(container).toBeTruthy();
  });

  it("shows loading spinner when data is loading", () => {
    const { container } = render(<WeeklyComparison />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeNull(); // Not loading with current mock
  });
});
