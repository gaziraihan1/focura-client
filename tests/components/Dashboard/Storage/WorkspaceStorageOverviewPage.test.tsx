import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkspaceStorageOverviewPage } from '@/components/Dashboard/Storage/WorkspaceStorageOverviewPage';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
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

const mockStorageInfo = {
  workspaceName: 'Test Workspace',
  plan: 'PRO',
  usedMB: 2048,
  totalMB: 10240,
  percentage: 20,
  fileCount: 150,
  userCount: 5,
};

const mockData = {
  storageInfo: mockStorageInfo,
  breakdown: { byType: [], byProject: [], byUser: [] },
  trend: [],
  largestFiles: [],
  myContribution: { usedMB: 500, fileCount: 30 },
  isAdmin: true,
  userContributions: [],
};

const mockUseStorageOverview = vi.fn(() => ({
  data: null,
  isLoading: true,
  error: null,
}));

vi.mock('@/hooks/useStorage', () => ({
  useWorkspaceStorageOverview: () => mockUseStorageOverview(),
}));

vi.mock('@/hooks/useStoragePage', () => ({
  useStorageWarning: vi.fn(() => ({ level: 'normal', message: null })),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}));

vi.mock('@/components/Dashboard/Storage/StorageSummaryCards', () => ({ StorageSummaryCards: () => <div data-testid="summary-cards" /> }));
vi.mock('@/components/Dashboard/Storage/MyContributionCard', () => ({ MyContributionCard: () => <div data-testid="my-contribution" /> }));
vi.mock('@/components/Dashboard/Storage/UserContributionsTable', () => ({ UserContributionsTable: () => <div data-testid="user-contributions" /> }));
vi.mock('@/components/Dashboard/Storage/StorageBreakdownChart', () => ({ StorageBreakdownChart: () => <div data-testid="breakdown-chart" /> }));
vi.mock('@/components/Dashboard/Storage/StorageTrendChart', () => ({ StorageTrendChart: () => <div data-testid="trend-chart" /> }));
vi.mock('@/components/Dashboard/Storage/LargestFilesTable', () => ({ LargestFilesTable: () => <div data-testid="largest-files" /> }));
vi.mock('@/components/Dashboard/Storage/PlanComparison', () => ({ PlanComparison: () => <div data-testid="plan-comparison" /> }));

vi.mock('@/components/Shared/UpgradeSectionCard', () => ({
  UpgradeSectionCard: ({ title, ctaLabel }: { title: string; ctaLabel?: string }) => (
    <div data-testid="upgrade-section-card">
      <span>{title}</span>
      {ctaLabel && <span data-testid="cta-label">{ctaLabel}</span>}
    </div>
  ),
}));

describe('WorkspaceStorageOverviewPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStorageOverview.mockReturnValue({ data: null, isLoading: true, error: null });
  });

  it('shows loading state initially', () => {
    render(<WorkspaceStorageOverviewPage workspaceId="ws-1" />);
    expect(screen.getByText('Loading storage data...')).toBeInTheDocument();
  });

  it('renders the page heading', () => {
    render(<WorkspaceStorageOverviewPage workspaceId="ws-1" />);
    expect(screen.getByText('Storage Overview')).toBeInTheDocument();
  });

  it('renders breakdown chart when isPro is false', () => {
    mockUseStorageOverview.mockReturnValue({ data: mockData, isLoading: false, error: null });
    render(<WorkspaceStorageOverviewPage workspaceId="ws-1" isPro={false} />);
    expect(screen.getByTestId('breakdown-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('upgrade-section-card')).not.toBeInTheDocument();
  });

  it('shows upgrade card instead of breakdown chart when isPro is true', () => {
    mockUseStorageOverview.mockReturnValue({ data: mockData, isLoading: false, error: null });
    render(<WorkspaceStorageOverviewPage workspaceId="ws-1" isPro={true} />);
    expect(screen.queryByTestId('breakdown-chart')).not.toBeInTheDocument();
    const upgradeCards = screen.getAllByTestId('upgrade-section-card');
    expect(upgradeCards.length).toBe(1);
    expect(upgradeCards[0]).toHaveTextContent('Storage Breakdown Chart');
  });
});