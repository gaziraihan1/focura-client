import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockTrends = [
  { weekStart: "2024-06-01", riskLevel: "LOW", consecutiveHeavyDays: 0, avgDailyLoad: 0.6 },
  { weekStart: "2024-06-08", riskLevel: "MODERATE", consecutiveHeavyDays: 1, avgDailyLoad: 0.9 },
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
    TrendingUp: icon("TrendingUp"),
    ChevronDown: icon("ChevronDown"),
    ChevronUp: icon("ChevronUp"),
    Loader2: icon("Loader2"),
    AlertCircle: icon("AlertCircle"),
    RefreshCw: icon("RefreshCw"),
  };
});

import { BurnoutTrendsChart } from "@/components/dashboard/calendar/calendar/BurnoutTrendsChart";

describe("BurnoutTrendsChart", () => {
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
    render(<BurnoutTrendsChart />);
    expect(screen.getByText("Burnout Trends")).toBeInTheDocument();
  });

  it("shows week count in subtitle", () => {
    render(<BurnoutTrendsChart />);
    expect(screen.getByText(/2 weeks of data/)).toBeInTheDocument();
  });

  it("shows the latest risk level badge", () => {
    render(<BurnoutTrendsChart />);
    expect(screen.getByText("MODERATE")).toBeInTheDocument();
  });

  it("renders ChevronDown icon when collapsed", () => {
    render(<BurnoutTrendsChart />);
    expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
  });

  it("shows legend when expanded", () => {
    render(<BurnoutTrendsChart />);
    fireEvent.click(screen.getByText("Burnout Trends"));
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("collapses when clicked again", () => {
    render(<BurnoutTrendsChart />);
    const header = screen.getByText("Burnout Trends");

    fireEvent.click(header);
    expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();

    fireEvent.click(header);
    expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
  });

  it("renders loading state with spinner", () => {
    mockUseBurnoutTrends.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<BurnoutTrendsChart />);
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

    render(<BurnoutTrendsChart />);
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

    render(<BurnoutTrendsChart />);
    expect(screen.getByText(/Not enough data yet/)).toBeInTheDocument();
  });

  describe("auto-expand behavior", () => {
    it("auto-expands when the latest risk is HIGH", () => {
      mockUseBurnoutTrends.mockReturnValue({
        data: [
          { weekStart: "2024-06-01", riskLevel: "LOW", consecutiveHeavyDays: 0, avgDailyLoad: 0.5 },
          { weekStart: "2024-06-08", riskLevel: "HIGH", consecutiveHeavyDays: 3, avgDailyLoad: 1.4 },
        ],
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<BurnoutTrendsChart />);
      // Expanded immediately → chevron up
      expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();
      expect(screen.getByText("High")).toBeInTheDocument();
    });

    it("auto-expands when the latest risk is CRITICAL", () => {
      mockUseBurnoutTrends.mockReturnValue({
        data: [
          { weekStart: "2024-06-01", riskLevel: "MODERATE", consecutiveHeavyDays: 1, avgDailyLoad: 0.9 },
          { weekStart: "2024-06-08", riskLevel: "CRITICAL", consecutiveHeavyDays: 5, avgDailyLoad: 1.8 },
        ],
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<BurnoutTrendsChart />);
      expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();
    });

    it("does not auto-expand when the latest risk is LOW or MODERATE", () => {
      render(<BurnoutTrendsChart />);
      expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
    });

    it("stays collapsed after the user collapses an auto-expanded chart", () => {
      mockUseBurnoutTrends.mockReturnValue({
        data: [
          { weekStart: "2024-06-01", riskLevel: "MODERATE", consecutiveHeavyDays: 1, avgDailyLoad: 0.9 },
          { weekStart: "2024-06-08", riskLevel: "HIGH", consecutiveHeavyDays: 3, avgDailyLoad: 1.4 },
        ],
        loading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<BurnoutTrendsChart />);
      expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();

      // User collapses it
      fireEvent.click(screen.getByText("Burnout Trends"));
      expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
    });
  });
});
