import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkspaceStorageOverviewPage } from '@/components/Dashboard/Storage/WorkspaceStorageOverviewPage';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />;
  return {
    HardDrive: icon('hard-drive'),
    AlertTriangle: icon('alert-triangle'),
    Shield: icon('shield'),
    Users: icon('users'),
    Loader2: icon('loader2'),
    Building2: icon('building2'),
    Crown: icon('crown'),
    Zap: icon('zap'),
    Star: icon('star'),
    Globe: icon('globe'),
    Lock: icon('lock'),
  };
});

vi.mock('@/hooks/useStorage', () => ({
  useWorkspaceStorageOverview: vi.fn(() => ({
    data: null,
    isLoading: true,
    error: null,
  })),
}));

vi.mock('@/hooks/useStoragePage', () => ({
  useStorageWarning: vi.fn(() => ({ level: 'normal', message: null })),
}));

vi.mock('@/components/Dashboard/Storage/StorageSummaryCards', () => ({ StorageSummaryCards: () => <div data-testid="summary-cards" /> }));
vi.mock('@/components/Dashboard/Storage/MyContributionCard', () => ({ MyContributionCard: () => <div data-testid="my-contribution" /> }));
vi.mock('@/components/Dashboard/Storage/UserContributionsTable', () => ({ UserContributionsTable: () => <div data-testid="user-contributions" /> }));
vi.mock('@/components/Dashboard/Storage/StorageBreakdownChart', () => ({ StorageBreakdownChart: () => <div data-testid="breakdown-chart" /> }));
vi.mock('@/components/Dashboard/Storage/StorageTrendChart', () => ({ StorageTrendChart: () => <div data-testid="trend-chart" /> }));
vi.mock('@/components/Dashboard/Storage/LargestFilesTable', () => ({ LargestFilesTable: () => <div data-testid="largest-files" /> }));
vi.mock('@/components/Dashboard/Storage/PlanComparison', () => ({ PlanComparison: () => <div data-testid="plan-comparison" /> }));

describe('WorkspaceStorageOverviewPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading state initially', () => {
    render(<WorkspaceStorageOverviewPage workspaceId="ws-1" />);
    expect(screen.getByText('Loading storage data...')).toBeInTheDocument();
  });

  it('renders the page heading', () => {
    render(<WorkspaceStorageOverviewPage workspaceId="ws-1" />);
    expect(screen.getByText('Storage Overview')).toBeInTheDocument();
  });
});
