import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockAggregates = [
  {
    id: "agg-1",
    userId: "user-1",
    date: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalTasks: 8,
    dueTasks: 3,
    criticalTasks: 1,
    milestoneCount: 0,
    plannedHours: 6,
    actualHours: 5.5,
    focusMinutes: 90,
    workloadScore: 72,
    overCapacity: false,
    hasPrimaryFocus: true,
    isReviewDay: false,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "agg-2",
    userId: "user-1",
    date: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalTasks: 15,
    dueTasks: 8,
    criticalTasks: 4,
    milestoneCount: 1,
    plannedHours: 12,
    actualHours: 10,
    focusMinutes: 30,
    workloadScore: 98,
    overCapacity: true,
    hasPrimaryFocus: false,
    isReviewDay: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "agg-3",
    userId: "user-1",
    date: new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalTasks: 5,
    dueTasks: 1,
    criticalTasks: 0,
    milestoneCount: 0,
    plannedHours: 4,
    actualHours: 4,
    focusMinutes: 120,
    workloadScore: 50,
    overCapacity: false,
    hasPrimaryFocus: true,
    isReviewDay: false,
    updatedAt: new Date().toISOString(),
  },
];

const mockUseCalendarAggregates = vi.fn(() => ({
  data: mockAggregates,
  isLoading: false,
}));

vi.mock("@/hooks/useCalendar", () => ({
  useCalendarAggregates: (...args: any[]) => mockUseCalendarAggregates(...args),
}));

vi.mock("@/hooks/useUserSettings", () => ({
  useUserCapacity: () => ({
    data: { weeklyHours: 40, dailyCapacityHours: 8, deepWorkHours: 4 },
    loading: false,
  }),
  useUserSchedule: () => ({
    data: {
      workDays: ["MON", "TUE", "WED", "THU", "FRI"],
      workStartHour: 9,
      workEndHour: 17,
    },
    loading: false,
  }),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
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
    BarChart3: icon("BarChart3"),
    ChevronDown: icon("ChevronDown"),
    ChevronUp: icon("ChevronUp"),
    Download: icon("Download"),
    Loader2: icon("Loader2"),
    AlertCircle: icon("AlertCircle"),
    RefreshCw: icon("RefreshCw"),
  };
});

import { CapacityChart } from "@/components/dashboard/calendar/calendar/CapacityChart";

describe("CapacityChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("data state", () => {
    it("renders without crashing", () => {
      const { container } = render(<CapacityChart />);
      expect(container).toBeTruthy();
    });

    it("renders the title", () => {
      render(<CapacityChart />);
      expect(screen.getByText("Capacity vs Planned")).toBeInTheDocument();
    });

    it("shows 'Last 8 weeks' in subtitle", () => {
      render(<CapacityChart />);
      expect(screen.getByText(/Last 8 weeks/)).toBeInTheDocument();
    });

    it("renders ChevronDown icon when collapsed", () => {
      render(<CapacityChart />);
      expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
    });

    it("shows summary cards when expanded", () => {
      render(<CapacityChart />);
      fireEvent.click(screen.getByText("Capacity vs Planned"));

      expect(screen.getByText("Total Planned")).toBeInTheDocument();
      expect(screen.getByText("Total Capacity")).toBeInTheDocument();
      expect(screen.getByText("Weekly Avg Planned")).toBeInTheDocument();
      expect(screen.getByText("Weekly Avg Capacity")).toBeInTheDocument();
    });

    it("shows chart elements when expanded", () => {
      render(<CapacityChart />);
      fireEvent.click(screen.getByText("Capacity vs Planned"));

      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("x-axis")).toBeInTheDocument();
      expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    });

    it("shows ChevronUp when expanded", () => {
      render(<CapacityChart />);
      fireEvent.click(screen.getByText("Capacity vs Planned"));
      expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();
    });

    it("collapses when clicked again", () => {
      render(<CapacityChart />);
      const header = screen.getByText("Capacity vs Planned");

      fireEvent.click(header);
      expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();

      fireEvent.click(header);
      expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
    });

    it("renders legend items when expanded", () => {
      render(<CapacityChart />);
      fireEvent.click(screen.getByText("Capacity vs Planned"));

      expect(screen.getByText("Planned hours")).toBeInTheDocument();
      expect(screen.getByText("Capacity hours")).toBeInTheDocument();
    });

    it("renders summary card with formatted values", () => {
      render(<CapacityChart />);
      fireEvent.click(screen.getByText("Capacity vs Planned"));

      // Total planned should be sum of all planned hours (6 + 12 + 4 = 22)
      expect(screen.getByText("22h")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("renders error message and retry button when aggregates fail", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      });

      render(<CapacityChart />);
      expect(screen.getByText("Capacity vs Planned")).toBeInTheDocument();
      expect(screen.getByText(/Failed to load capacity data/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    });

    it("calls refetch when retry is clicked", () => {
      const refetch = vi.fn().mockResolvedValue(undefined);
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: false,
        isError: true,
        refetch,
      });

      render(<CapacityChart />);
      fireEvent.click(screen.getByRole("button", { name: /retry/i }));
      expect(refetch).toHaveBeenCalled();
    });
  });

  describe("empty state", () => {
    it("renders empty state message when no aggregates", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(<CapacityChart />);
      expect(screen.getByText("Capacity vs Planned")).toBeInTheDocument();
      expect(screen.getByText(/No calendar data yet/i)).toBeInTheDocument();
    });

    it("renders loading spinner when loading", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: true,
      });

      render(<CapacityChart />);
      expect(screen.getByTestId("Loader2-icon")).toBeInTheDocument();
    });
  });
});
