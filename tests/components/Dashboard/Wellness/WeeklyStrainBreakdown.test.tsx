import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockTrends = [
  {
    weekStart: "2024-06-01",
    riskLevel: "LOW",
    consecutiveHeavyDays: 0,
    avgDailyLoad: 0.6,
    avgEnergy: 7.2,
    lowEnergyDays: 0,
    focusMinutes: 360,
    focusOverloadDays: 0,
  },
  {
    weekStart: "2024-06-08",
    riskLevel: "HIGH",
    consecutiveHeavyDays: 3,
    avgDailyLoad: 1.4,
    avgEnergy: 6.5,
    lowEnergyDays: 2,
    focusMinutes: 1320,
    focusOverloadDays: 2,
  },
];

const mockUseBurnoutTrends = vi.fn(() => ({
  data: mockTrends,
  loading: false,
  error: null,
  refetch: vi.fn(),
}));

vi.mock("@/hooks/useBurnoutTrends", () => ({
  useBurnoutTrends: (...args: any[]) => mockUseBurnoutTrends(...args),
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
    Loader2: icon("Loader2"),
    AlertCircle: icon("AlertCircle"),
    RefreshCw: icon("RefreshCw"),
  };
});

import { WeeklyStrainBreakdown } from "@/components/Dashboard/Wellness/WeeklyStrainBreakdown";

describe("WeeklyStrainBreakdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBurnoutTrends.mockReturnValue({
      data: mockTrends,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it("renders the title", () => {
    render(<WeeklyStrainBreakdown />);
    expect(screen.getByText("Weekly Strain Breakdown")).toBeInTheDocument();
  });

  it("shows week count in subtitle", () => {
    render(<WeeklyStrainBreakdown />);
    expect(screen.getByText(/2 weeks of data/)).toBeInTheDocument();
  });

  it("renders the column headers", () => {
    render(<WeeklyStrainBreakdown />);
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Risk")).toBeInTheDocument();
    // Load / Energy / Focus also appear in the legend → assert at least one
    expect(screen.getAllByText("Load").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Energy").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Focus").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Strain")).toBeInTheDocument();
  });

  it("lists the most recent week first", () => {
    render(<WeeklyStrainBreakdown />);
    const rows = screen.getAllByRole("row");
    // rows[0] is the header row; rows[1] should be the newest week (2024-06-08)
    expect(rows[1]).toHaveTextContent("HIGH");
    expect(rows[1]).toHaveTextContent("1.40");
    expect(rows[2]).toHaveTextContent("LOW");
    expect(rows[2]).toHaveTextContent("0.60");
  });

  it("shows load, energy, and focus side by side for a week", () => {
    render(<WeeklyStrainBreakdown />);
    const rows = screen.getAllByRole("row");
    // Newest week: load 1.40, energy 6.5, focus 22h all in the same row
    expect(rows[1]).toHaveTextContent("1.40");
    expect(rows[1]).toHaveTextContent("6.5");
    expect(rows[1]).toHaveTextContent("22.0h");
  });

  it("annotates low-energy and focus-overload days", () => {
    render(<WeeklyStrainBreakdown />);
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("2 low-energy days");
    expect(rows[1]).toHaveTextContent("2 overload days");
    expect(rows[1]).toHaveTextContent("3 heavy days");
  });

  it("summarizes the strain drivers per week", () => {
    render(<WeeklyStrainBreakdown />);
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Energy + focus");
    // The low-risk week has no strain → em dash
    expect(rows[2]).toHaveTextContent("—");
  });

  it("shows an em dash when a week has no energy data", () => {
    mockUseBurnoutTrends.mockReturnValue({
      data: [
        {
          weekStart: "2024-06-08",
          riskLevel: "MODERATE",
          consecutiveHeavyDays: 1,
          avgDailyLoad: 0.9,
          avgEnergy: null,
          lowEnergyDays: 0,
          focusMinutes: 0,
          focusOverloadDays: 0,
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<WeeklyStrainBreakdown />);
    // "—" appears in both the energy cell and the strain column here
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  it("renders loading state with spinner", () => {
    mockUseBurnoutTrends.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<WeeklyStrainBreakdown />);
    expect(screen.getByTestId("Loader2-icon")).toBeInTheDocument();
  });

  it("renders error state with retry button", () => {
    const refetch = vi.fn().mockResolvedValue(undefined);
    mockUseBurnoutTrends.mockReturnValue({
      data: [],
      loading: false,
      error: "Unable to fetch burnout trends. Please try again.",
      refetch,
    });

    render(<WeeklyStrainBreakdown />);
    expect(screen.getByText(/Unable to fetch burnout trends/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it("renders empty state when no data", () => {
    mockUseBurnoutTrends.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<WeeklyStrainBreakdown />);
    expect(screen.getByText(/Not enough data yet/)).toBeInTheDocument();
  });
});
