import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StorageOverviewPage } from "@/components/Dashboard/Storage/StorageOverviewPage";

vi.mock("@/hooks/useStorageOverview", () => ({
  useStorageOverview: vi.fn(),
}));

vi.mock("@/components/Dashboard/Storage/StorageOverviewPage/LoadingState", () => ({
  LoadingState: ({ message }: any) => <div data-testid="loading-state">{message}</div>,
}));

vi.mock("@/components/Dashboard/Storage/StorageOverviewPage/EmptyState", () => ({
  EmptyState: () => <div data-testid="empty-state">No workspaces</div>,
}));

vi.mock("@/components/Dashboard/Storage/StorageOverviewPage/ErrorState", () => ({
  ErrorState: ({ error }: any) => <div data-testid="error-state">{error}</div>,
}));

vi.mock("@/components/Dashboard/Storage/StorageOverviewPage/PageHeader", () => ({
  PageHeader: (props: any) => <div data-testid="page-header" />,
}));

vi.mock("@/components/Dashboard/Storage/StorageOverviewPage/StorageWarningBanner", () => ({
  StorageWarningBanner: (props: any) => <div data-testid="warning-banner" />,
}));

vi.mock("@/components/Dashboard/Storage/StorageSummaryCards", () => ({
  StorageSummaryCards: (props: any) => <div data-testid="summary-cards" />,
}));

vi.mock("@/components/Dashboard/Storage/MyContributionCard", () => ({
  MyContributionCard: (props: any) => <div data-testid="my-contribution" />,
}));

vi.mock("@/components/Dashboard/Storage/UserContributionsTable", () => ({
  UserContributionsTable: (props: any) => <div data-testid="user-contributions" />,
}));

vi.mock("@/components/Dashboard/Storage/StorageBreakdownChart", () => ({
  StorageBreakdownChart: (props: any) => <div data-testid="breakdown-chart" />,
}));

vi.mock("@/components/Dashboard/Storage/StorageTrendChart", () => ({
  StorageTrendChart: (props: any) => <div data-testid="trend-chart" />,
}));

vi.mock("@/components/Dashboard/Storage/LargestFilesTable", () => ({
  LargestFilesTable: (props: any) => <div data-testid="largest-files" />,
}));

vi.mock("@/components/Dashboard/Storage/PlanComparison", () => ({
  PlanComparison: (props: any) => <div data-testid="plan-comparison" />,
}));

import { useStorageOverview } from "@/hooks/useStorageOverview";

describe("StorageOverviewPage", () => {
  it("shows loading state when workspaces are loading", () => {
    vi.mocked(useStorageOverview).mockReturnValue({
      loadingWorkspaces: true,
      hasWorkspaces: false,
      selectedWorkspaceId: "",
      setSelectedWorkspaceId: vi.fn(),
      currentWorkspaceId: "",
      data: null,
      isLoading: false,
      error: null,
      warning: null,
    } as any);

    render(<StorageOverviewPage />);
    expect(screen.getByTestId("loading-state")).toHaveTextContent("Loading workspaces...");
  });

  it("shows empty state when no workspaces exist", () => {
    vi.mocked(useStorageOverview).mockReturnValue({
      loadingWorkspaces: false,
      hasWorkspaces: false,
      selectedWorkspaceId: "",
      setSelectedWorkspaceId: vi.fn(),
      currentWorkspaceId: "",
      data: null,
      isLoading: false,
      error: null,
      warning: null,
    } as any);

    render(<StorageOverviewPage />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows error state when data fetch fails", () => {
    vi.mocked(useStorageOverview).mockReturnValue({
      loadingWorkspaces: false,
      hasWorkspaces: true,
      selectedWorkspaceId: "ws1",
      setSelectedWorkspaceId: vi.fn(),
      currentWorkspaceId: "ws1",
      data: null,
      isLoading: false,
      error: "Something went wrong",
      warning: null,
    } as any);

    render(<StorageOverviewPage />);
    expect(screen.getByTestId("error-state")).toHaveTextContent("Something went wrong");
  });
});
