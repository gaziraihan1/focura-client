import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StorageOverviewPage } from "@/components/dashboard/storage/overview/StorageOverviewPage";

vi.mock("@/hooks/useStorageOverview", () => ({
  useStorageOverview: vi.fn(),
}));

vi.mock("@/components/dashboard/storage/overview/StorageOverviewPage/LoadingState", () => ({
  LoadingState: ({ message }: { message: string }) => <div data-testid="loading-state">{message}</div>,
}));

vi.mock("@/components/shared/EmptyState", () => ({
  EmptyState: () => <div data-testid="empty-state">No workspaces</div>,
}));

vi.mock("@/components/dashboard/storage/overview/StorageOverviewPage/ErrorState", () => ({
  ErrorState: ({ error }: { error: unknown }) => <div data-testid="error-state">{error}</div>,
}));

vi.mock("@/components/dashboard/storage/overview/StorageOverviewPage/PageHeader", () => ({
  PageHeader: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="page-header" />,
}));

vi.mock("@/components/dashboard/storage/overview/StorageOverviewPage/StorageWarningBanner", () => ({
  StorageWarningBanner: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="warning-banner" />,
}));

vi.mock("@/components/dashboard/storage/overview/StorageSummaryCards", () => ({
  StorageSummaryCards: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="summary-cards" />,
}));

vi.mock("@/components/dashboard/storage/overview/MyContributionCard", () => ({
  MyContributionCard: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="my-contribution" />,
}));

vi.mock("@/components/dashboard/storage/overview/UserContributionsTable", () => ({
  UserContributionsTable: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="user-contributions" />,
}));

vi.mock("@/components/dashboard/storage/overview/StorageBreakdownChart", () => ({
  StorageBreakdownChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="breakdown-chart" />,
}));

vi.mock("@/components/dashboard/storage/overview/StorageTrendChart", () => ({
  StorageTrendChart: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="trend-chart" />,
}));

vi.mock("@/components/dashboard/storage/overview/LargestFilesTable", () => ({
  LargestFilesTable: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="largest-files" />,
}));

vi.mock("@/components/dashboard/storage/overview/PlanComparison", () => ({
  PlanComparison: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="plan-comparison" />,
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
    } as any as Record<string, unknown>);

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
    } as any as Record<string, unknown>);

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
    } as any as Record<string, unknown>);

    render(<StorageOverviewPage />);
    expect(screen.getByTestId("error-state")).toHaveTextContent("Something went wrong");
  });
});
