import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockHistory = [
  { id: "energy-1", date: "2024-06-01", energyLevel: 7, note: null },
  { id: "energy-2", date: "2024-06-02", energyLevel: 3, note: "Slept badly" },
  { id: "energy-3", date: "2024-06-03", energyLevel: 9, note: null },
];

const mockUseEnergyHistory = vi.fn(() => ({
  data: mockHistory,
  loading: false,
  error: null,
  refetch: vi.fn(),
}));

vi.mock("@/hooks/useEnergyLevel", () => ({
  useEnergyHistory: (...args: any[]) => mockUseEnergyHistory(...args),
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
    Brain: icon("Brain"),
    ChevronDown: icon("ChevronDown"),
    ChevronUp: icon("ChevronUp"),
    Loader2: icon("Loader2"),
    AlertCircle: icon("AlertCircle"),
    RefreshCw: icon("RefreshCw"),
  };
});

import { EnergyTrendChart } from "@/components/Dashboard/Calendar/EnergyTrendChart";

describe("EnergyTrendChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEnergyHistory.mockReturnValue({
      data: mockHistory,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it("renders the title", () => {
    render(<EnergyTrendChart />);
    expect(screen.getByText("Energy Trend")).toBeInTheDocument();
  });

  it("shows the day count and average in the subtitle", () => {
    render(<EnergyTrendChart />);
    // 3 days, avg = (7 + 3 + 9) / 3 = 6.3
    expect(screen.getByText(/3 days/)).toBeInTheDocument();
    expect(screen.getByText(/avg 6.3\/10/)).toBeInTheDocument();
  });

  it("renders ChevronDown icon when collapsed", () => {
    render(<EnergyTrendChart />);
    expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
  });

  it("shows the bar chart and legend when expanded", () => {
    render(<EnergyTrendChart />);
    fireEvent.click(screen.getByText("Energy Trend"));

    expect(screen.getByText("High (8-10)")).toBeInTheDocument();
    expect(screen.getByText("Medium (5-7)")).toBeInTheDocument();
    expect(screen.getByText("Low (1-4)")).toBeInTheDocument();
  });

  it("collapses when clicked again", () => {
    render(<EnergyTrendChart />);
    const header = screen.getByText("Energy Trend");

    fireEvent.click(header);
    expect(screen.getByTestId("ChevronUp-icon")).toBeInTheDocument();

    fireEvent.click(header);
    expect(screen.getByTestId("ChevronDown-icon")).toBeInTheDocument();
  });

  it("renders loading state with spinner", () => {
    mockUseEnergyHistory.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<EnergyTrendChart />);
    expect(screen.getByTestId("Loader2-icon")).toBeInTheDocument();
    expect(screen.getByText(/Loading your energy history/)).toBeInTheDocument();
  });

  it("renders error state with retry button", () => {
    const refetch = vi.fn().mockResolvedValue(undefined);
    mockUseEnergyHistory.mockReturnValue({
      data: [],
      loading: false,
      error: "Unable to fetch energy history. Please try again.",
      refetch,
    });

    render(<EnergyTrendChart />);
    expect(screen.getByText(/Unable to fetch energy history/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it("renders empty state when no history", () => {
    mockUseEnergyHistory.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EnergyTrendChart />);
    expect(screen.getByText(/No energy data yet/)).toBeInTheDocument();
  });
});
