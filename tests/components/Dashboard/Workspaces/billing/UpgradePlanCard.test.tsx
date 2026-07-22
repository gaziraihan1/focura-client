import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Global mocks ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{props.children}</div>,
    button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{props.children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, image, size }: Record<string, unknown>) => (
    <span data-testid="avatar" data-name={name} data-size={size}>
      {image ? <img src={image} alt={name} /> : name?.[0] ?? '?'}
    </span>
  ),
}));

vi.mock('@/components/Shared/Pagination', () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: Record<string, unknown>) => (
    <div data-testid="pagination">
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/billing/Billing/BillingStatusBadge', () => ({
  BillingStatusBadge: ({ status }: { status: string }) => (
    <span data-testid="status-badge">{status}</span>
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/billing/Billing/BillingCancelConfirmation', () => ({
  BillingCancelConfirmation: ({ onConfirm, onCancel, isLoading }: Record<string, unknown>) => (
    <div data-testid="cancel-confirmation">
      <span>{isLoading ? 'Canceling…' : 'Ready'}</span>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Keep</button>
    </div>
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementContentEditor', () => ({
  AnnouncementContentEditor: ({ value, onChange, disabled }: Record<string, unknown>) => (
    <textarea data-testid="content-editor" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/Announcement/DeleteConfirmModal', () => ({
  DeleteConfirmModal: ({ title, isDeleting, onConfirm, onCancel }: Record<string, unknown>) => (
    <div data-testid="delete-confirm-modal">
      <span>Delete {title}?</span>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementEmptyState', () => ({
  AnnouncementEmptyState: () => <div data-testid="empty-state">No announcements yet</div>,
}));

vi.mock('@/components/Dashboard/Workspaces/Announcement/RenderedContent', () => ({
  RenderedContent: ({ raw }: Record<string, unknown>) => <div data-testid="rendered-content">{raw}</div>,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskDescription', () => ({
  TaskDescription: ({ description }: { description: string }) => <div data-testid="task-description">{description}</div>,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskTimeDetails', () => ({
  TaskTimeDetails: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-time-details" data-props={JSON.stringify(props)} />,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskPeopleSection', () => ({
  TaskPeopleSection: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-people-section" />,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskProjectSection', () => ({
  TaskProjectSection: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-project-section" />,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskActivityStats', () => ({
  TaskActivityStats: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="task-activity-stats" />,
}));

vi.mock('@/components/Dashboard/Workspaces/Meeting/MeetingStatusBadge', () => ({
  MeetingStatusBadge: ({ status }: { status: string }) => <span data-testid="meeting-status-badge">{status}</span>,
}));

vi.mock('@/components/Dashboard/Calendar/DayDetailsPanelParts', () => ({
  PlannedHoursCard: () => <div data-testid="planned-hours-card" />,
  FocusSessionsCard: () => <div data-testid="focus-sessions-card" />,
  GoalsCard: () => <div data-testid="goals-card" />,
  BurnoutCard: () => <div data-testid="burnout-card" />,
  EventsCard: () => <div data-testid="events-card" />,
  DaySummaryBar: () => <div data-testid="day-summary-bar" />,
}));

vi.mock('@/hooks/useEnergyLevel', () => ({
  useEnergyLevel: () => ({
    data: null,
    logEnergy: vi.fn().mockResolvedValue(true),
    refetch: vi.fn(),
    loading: false,
  }),
  useEnergyHistory: () => ({
    data: [],
    pagination: null,
    loading: false,
  }),
}));

vi.mock('@/hooks/useMeetingForm', () => ({
  useMeetingForm: () => ({
    form: {
      title: '',
      description: '',
      link: '',
      location: '',
      visibility: 'PUBLIC',
      startTime: '',
      endTime: '',
      attendeeIds: [],
    },
    setField: vi.fn(),
    toggleAttendee: vi.fn(),
    memberSearch: '',
    setMemberSearch: vi.fn(),
    validationError: null,
    handleSubmit: vi.fn(),
  }),
}));

vi.mock('@/hooks/useProjects', () => ({
  useUpdateProject: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  }),
  useDeleteProject: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
  }),
}));

vi.mock('@/components/Dashboard/Workspaces/project/Settings/Section', () => ({
  Section: ({ title, description, children }: Record<string, unknown>) => (
    <div data-testid="section" data-title={title}>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 hours ago',
  format: () => 'Jan 1, 2025 · 12:00 PM',
}));

vi.mock('lucide-react', () => {
  const identity = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon" {...props} />;
  const icons: Record<string, unknown> = {};
  const iconNames = [
    'Check', 'Globe', 'Lock', 'Calendar', 'Clock', 'MapPin', 'Link2', 'MoreVertical',
    'ChevronRight', 'CreditCard', 'ExternalLink', 'X', 'Brain', 'ChevronLeft',
    'BarChart3', 'Sparkles', 'CheckCircle2', 'Rocket', 'Zap', 'Building2',
    'AlertCircle', 'XCircle', 'Loader2', 'Trash2', 'Pin', 'Download',
    'Megaphone', 'FolderOpen', 'ArrowRight', 'AlertTriangle', 'Shield',
    'ArchiveRestore', 'RefreshCw', 'Save', 'CalendarDays',
  ];
  for (const name of iconNames) {
    icons[name] = identity;
  }
  return icons;
});

// ═══════════════════════════════════════════════════════════════════════════════
import { UpgradePlanCard } from '@/components/Dashboard/Workspaces/billing/Upgrade/UpgradePlanCard';

describe('UpgradePlanCard', () => {
  const basePlan = {
    name: 'PRO' as const,
    displayName: 'Pro',
    icon: vi.fn(),
    price: { monthly: 1200, yearly: 12000 },
    description: 'For growing teams',
    features: ['Feature A', 'Feature B'],
    highlight: false,
  };

  it('renders plan name, description, price and features', () => {
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="monthly"
        currentPlan="FREE"
        hasActiveSub={false}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('For growing teams')).toBeInTheDocument();
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
    expect(screen.getByText('$12')).toBeInTheDocument();
  });

  it('shows "/mo" suffix for monthly cycle with non-zero price', () => {
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="monthly"
        currentPlan="FREE"
        hasActiveSub={false}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('/mo')).toBeInTheDocument();
  });

  it('shows yearly billing info for yearly cycle with non-zero price', () => {
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="yearly"
        currentPlan="FREE"
        hasActiveSub={false}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText(/Billed/)).toBeInTheDocument();
  });

  it('shows MOST POPULAR badge when plan.highlight is true', () => {
    render(
      <UpgradePlanCard
        plan={{ ...basePlan, highlight: true }}
        cycle="monthly"
        currentPlan="FREE"
        hasActiveSub={false}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('MOST POPULAR')).toBeInTheDocument();
  });

  it('shows CURRENT badge when plan matches currentPlan', () => {
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="monthly"
        currentPlan="PRO"
        hasActiveSub={true}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('CURRENT')).toBeInTheDocument();
    expect(screen.getByText('✓ Current plan')).toBeInTheDocument();
  });

  it('disables button and shows Processing… when isLoading', () => {
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="monthly"
        currentPlan="FREE"
        hasActiveSub={false}
        isLoading={true}
        onSelect={vi.fn()}
      />
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn.textContent).toContain('Processing');
  });

  it('shows "Downgrade to Free" for FREE plan', () => {
    const freePlan = { ...basePlan, name: 'FREE' as const, displayName: 'Free', price: { monthly: 0, yearly: 0 } };
    render(
      <UpgradePlanCard
        plan={freePlan}
        cycle="monthly"
        currentPlan="PRO"
        hasActiveSub={true}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Downgrade to Free')).toBeInTheDocument();
  });

  it('shows "Switch to Pro" when hasActiveSub', () => {
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="monthly"
        currentPlan="FREE"
        hasActiveSub={true}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Switch to Pro')).toBeInTheDocument();
  });

  it('shows "Get Pro" when no active subscription', () => {
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="monthly"
        currentPlan="FREE"
        hasActiveSub={false}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Get Pro')).toBeInTheDocument();
  });

  it('calls onSelect with plan name when button clicked', () => {
    const onSelect = vi.fn();
    render(
      <UpgradePlanCard
        plan={basePlan}
        cycle="monthly"
        currentPlan="FREE"
        hasActiveSub={false}
        isLoading={false}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith('PRO');
  });

  it('does not show /mo for zero-price plans', () => {
    const freePlan = { ...basePlan, name: 'FREE' as const, displayName: 'Free', price: { monthly: 0, yearly: 0 } };
    render(
      <UpgradePlanCard
        plan={freePlan}
        cycle="monthly"
        currentPlan="BUSINESS"
        hasActiveSub={true}
        isLoading={false}
        onSelect={vi.fn()}
      />
    );
    expect(screen.queryByText('/mo')).not.toBeInTheDocument();
  });
});
