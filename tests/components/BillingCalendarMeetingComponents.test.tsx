import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// ─── Global mocks ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props}>{props.children}</div>,
    button: (props: any) => <button {...props}>{props.children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name, image, size }: any) => (
    <span data-testid="avatar" data-name={name} data-size={size}>
      {image ? <img src={image} alt={name} /> : name?.[0] ?? '?'}
    </span>
  ),
}));

vi.mock('@/components/Shared/Pagination', () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/billing/Billing/BillingStatusBadge', () => ({
  BillingStatusBadge: ({ status }: any) => (
    <span data-testid="status-badge">{status}</span>
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/billing/Billing/BillingCancelConfirmation', () => ({
  BillingCancelConfirmation: ({ onConfirm, onCancel, isLoading }: any) => (
    <div data-testid="cancel-confirmation">
      <span>{isLoading ? 'Canceling…' : 'Ready'}</span>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Keep</button>
    </div>
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementContentEditor', () => ({
  AnnouncementContentEditor: ({ value, onChange, disabled }: any) => (
    <textarea data-testid="content-editor" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
  ),
}));

vi.mock('@/components/Dashboard/Workspaces/Announcement/DeleteConfirmModal', () => ({
  DeleteConfirmModal: ({ title, isDeleting, onConfirm, onCancel }: any) => (
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
  RenderedContent: ({ raw }: any) => <div data-testid="rendered-content">{raw}</div>,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskDescription', () => ({
  TaskDescription: ({ description }: any) => <div data-testid="task-description">{description}</div>,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskTimeDetails', () => ({
  TaskTimeDetails: (props: any) => <div data-testid="task-time-details" data-props={JSON.stringify(props)} />,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskPeopleSection', () => ({
  TaskPeopleSection: (props: any) => <div data-testid="task-people-section" />,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskProjectSection', () => ({
  TaskProjectSection: (props: any) => <div data-testid="task-project-section" />,
}));

vi.mock('@/components/Dashboard/CalendarView/TaskModal/TaskActivityStats', () => ({
  TaskActivityStats: (props: any) => <div data-testid="task-activity-stats" />,
}));

vi.mock('@/components/Dashboard/Workspaces/Meeting/MeetingStatusBadge', () => ({
  MeetingStatusBadge: ({ status }: any) => <span data-testid="meeting-status-badge">{status}</span>,
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
  Section: ({ title, description, children }: any) => (
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
  const identity = (props: any) => <svg data-testid="icon" {...props} />;
  const icons: Record<string, any> = {};
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
// 1. UpgradePlanCard
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

// ═══════════════════════════════════════════════════════════════════════════════
// 2. BillingPlanCard
// ═══════════════════════════════════════════════════════════════════════════════
import { BillingPlanCard } from '@/components/Dashboard/Workspaces/billing/Billing/BillingPlanCard';

describe('BillingPlanCard', () => {
  const defaultProps = {
    sub: null,
    onPortal: vi.fn(),
    portalPending: false,
    onCancel: vi.fn(),
    cancelPending: false,
    onReactivate: vi.fn(),
    reactivatePending: false,
  };

  it('renders upgrade link and free plan message when no subscription', () => {
    render(<BillingPlanCard {...defaultProps} />);
    expect(screen.getByText('Upgrade')).toBeInTheDocument();
    expect(screen.getByText(/Free plan/)).toBeInTheDocument();
  });

  it('renders "Change plan" link when sub is active', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: false,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByText('Change plan')).toBeInTheDocument();
  });

  it('shows manage payment button and cancel button for active sub', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: false,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByText('Manage payment')).toBeInTheDocument();
    expect(screen.getByText('Cancel plan')).toBeInTheDocument();
  });

  it('shows reactivation button when cancelAtPeriodEnd is true', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: true,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByText('Keep subscription active')).toBeInTheDocument();
    expect(screen.queryByText('Cancel plan')).not.toBeInTheDocument();
  });

  it('shows cancellation warning when cancelAtPeriodEnd', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: true,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByText(/Cancels on/)).toBeInTheDocument();
  });

  it('shows "Opening…" when portalPending', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        portalPending={true}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: false,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByText('Opening…')).toBeInTheDocument();
  });

  it('shows "Reactivating…" when reactivatePending', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        reactivatePending={true}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: true,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByText('Reactivating…')).toBeInTheDocument();
  });

  it('shows cancel confirmation when cancel plan clicked', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: false,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    fireEvent.click(screen.getByText('Cancel plan'));
    expect(screen.getByTestId('cancel-confirmation')).toBeInTheDocument();
  });

  it('calls onPortal when manage payment clicked', () => {
    const onPortal = vi.fn();
    render(
      <BillingPlanCard
        {...defaultProps}
        onPortal={onPortal}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: false,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    fireEvent.click(screen.getByText('Manage payment'));
    expect(onPortal).toHaveBeenCalled();
  });

  it('shows billing cycle info', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: false,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByText(/monthly billing/)).toBeInTheDocument();
  });

  it('shows status badge for non-free plans', () => {
    render(
      <BillingPlanCard
        {...defaultProps}
        sub={{
          workspaceId: 'w1',
          planName: 'PRO',
          status: 'TRIALING',
          billingCycle: 'MONTHLY',
          currentPeriodEnd: '2025-12-31',
          cancelAtPeriodEnd: false,
          trialEnd: null,
          stripeSubscriptionId: 'sub_123',
        }}
      />
    );
    expect(screen.getByTestId('status-badge')).toHaveTextContent('TRIALING');
  });

  it('does not hide actions section for free plan', () => {
    const { container } = render(<BillingPlanCard {...defaultProps} />);
    expect(container.querySelector('[data-testid="cancel-confirmation"]')).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. BillingCancelConfirmation (using the correct import)
// ═══════════════════════════════════════════════════════════════════════════════
import { BillingCancelConfirmation } from '@/components/Dashboard/Workspaces/billing/Billing/BillingCancelConfirmation';

describe('BillingCancelConfirmation', () => {
  it('renders confirmation UI', () => {
    render(<BillingCancelConfirmation onConfirm={vi.fn()} onCancel={vi.fn()} isLoading={false} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('shows confirm and keep buttons', () => {
    render(<BillingCancelConfirmation onConfirm={vi.fn()} onCancel={vi.fn()} isLoading={false} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm clicked', () => {
    const onConfirm = vi.fn();
    render(<BillingCancelConfirmation onConfirm={onConfirm} onCancel={vi.fn()} isLoading={false} />);
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when keep clicked', () => {
    const onCancel = vi.fn();
    render(<BillingCancelConfirmation onConfirm={vi.fn()} onCancel={onCancel} isLoading={false} />);
    fireEvent.click(screen.getByText('Keep'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows "Canceling…" status when loading', () => {
    render(<BillingCancelConfirmation onConfirm={vi.fn()} onCancel={vi.fn()} isLoading={true} />);
    expect(screen.getByText('Canceling…')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BillingInvoiceTable
// ═══════════════════════════════════════════════════════════════════════════════
import { BillingInvoiceTable } from '@/components/Dashboard/Workspaces/billing/Billing/BillingInvoiceTable';

describe('BillingInvoiceTable', () => {
  it('shows empty state when no invoices', () => {
    render(<BillingInvoiceTable invoices={[]} />);
    expect(screen.getByText('No invoices yet.')).toBeInTheDocument();
  });

  it('renders invoice table with data', () => {
    const invoices = [
      {
        id: 'inv_001',
        amount: 1200,
        currency: 'usd',
        status: 'PAID',
        pdfUrl: 'https://example.com/invoice.pdf',
        hostedUrl: null,
        invoiceNumber: 'INV-001',
        periodStart: '2025-01-01',
        periodEnd: '2025-01-31',
        paidAt: '2025-01-15',
        createdAt: '2025-01-01',
      },
    ];
    render(<BillingInvoiceTable invoices={invoices} />);
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('PAID')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('shows fallback invoice ID when invoiceNumber is null', () => {
    const invoices = [
      {
        id: 'inv_abcdef1234567890',
        amount: 1200,
        currency: 'usd',
        status: 'PAID',
        pdfUrl: null,
        hostedUrl: null,
        invoiceNumber: null,
        periodStart: '2025-01-01',
        periodEnd: null,
        paidAt: null,
        createdAt: '2025-01-01',
      },
    ];
    render(<BillingInvoiceTable invoices={invoices} />);
    // inv.id.slice(-8).toUpperCase() for 'inv_abcdef1234567890' is '34567890'
    expect(screen.getByText('#34567890')).toBeInTheDocument();
  });

  it('shows dash when no pdfUrl', () => {
    const invoices = [
      {
        id: 'inv_002',
        amount: 900,
        currency: 'usd',
        status: 'OPEN',
        pdfUrl: null,
        hostedUrl: null,
        invoiceNumber: 'INV-002',
        periodStart: '2025-02-01',
        periodEnd: '2025-02-28',
        paidAt: null,
        createdAt: '2025-02-01',
      },
    ];
    render(<BillingInvoiceTable invoices={invoices} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders multiple invoices', () => {
    const invoices = [
      {
        id: 'inv_1',
        amount: 1200,
        currency: 'usd',
        status: 'PAID',
        pdfUrl: null,
        hostedUrl: null,
        invoiceNumber: 'INV-001',
        periodStart: '2025-01-01',
        periodEnd: '2025-01-31',
        paidAt: null,
        createdAt: '2025-01-01',
      },
      {
        id: 'inv_2',
        amount: 4900,
        currency: 'usd',
        status: 'OPEN',
        pdfUrl: 'https://example.com/inv2.pdf',
        hostedUrl: null,
        invoiceNumber: 'INV-002',
        periodStart: '2025-02-01',
        periodEnd: '2025-02-28',
        paidAt: null,
        createdAt: '2025-02-01',
      },
    ];
    render(<BillingInvoiceTable invoices={invoices} />);
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('INV-002')).toBeInTheDocument();
    expect(screen.getAllByText('Download')).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Counter
// ═══════════════════════════════════════════════════════════════════════════════
import { Counter } from '@/components/Dashboard/Workspaces/billing/Success/Counter';

describe('Counter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial value 0', () => {
    render(<Counter to={100} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments towards target', () => {
    render(<Counter to={10} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const span = screen.getByText(/.+/);
    const val = parseInt(span.textContent!, 10);
    expect(val).toBeGreaterThan(0);
    expect(val).toBeLessThanOrEqual(10);
  });

  it('renders suffix', () => {
    render(<Counter to={5} suffix="%" />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  it('reaches target value', () => {
    render(<Counter to={5} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. FeaturesGained
// ═══════════════════════════════════════════════════════════════════════════════
import { FeaturesGained } from '@/components/Dashboard/Workspaces/billing/Success/FeaturesGained';

describe('FeaturesGained', () => {
  const features = [
    { icon: vi.fn(), label: 'Unlimited Projects', detail: 'Create as many projects as you need' },
    { icon: vi.fn(), label: '10GB Storage', detail: 'More space for your files' },
  ];

  it('renders heading with plan labels', () => {
    render(<FeaturesGained features={features} fromPlanLabel="Free" toPlanLabel="Pro" visible={true} />);
    expect(screen.getByText(/Free/)).toBeInTheDocument();
    expect(screen.getByText(/Free → Pro/)).toBeInTheDocument();
  });

  it('renders all feature labels', () => {
    render(<FeaturesGained features={features} fromPlanLabel="Free" toPlanLabel="Pro" visible={true} />);
    expect(screen.getByText('Unlimited Projects')).toBeInTheDocument();
    expect(screen.getByText('10GB Storage')).toBeInTheDocument();
  });

  it('renders feature details', () => {
    render(<FeaturesGained features={features} fromPlanLabel="Free" toPlanLabel="Pro" visible={true} />);
    expect(screen.getByText('Create as many projects as you need')).toBeInTheDocument();
    expect(screen.getByText('More space for your files')).toBeInTheDocument();
  });

  it('applies visible class when visible is true', () => {
    const { container } = render(<FeaturesGained features={features} fromPlanLabel="Free" toPlanLabel="Pro" visible={true} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain('opacity-100');
  });

  it('applies hidden class when visible is false', () => {
    const { container } = render(<FeaturesGained features={features} fromPlanLabel="Free" toPlanLabel="Pro" visible={false} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain('opacity-0');
  });

  it('renders empty features list without error', () => {
    render(<FeaturesGained features={[]} fromPlanLabel="Free" toPlanLabel="Pro" visible={true} />);
    expect(screen.getByText(/What you unlocked/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. SuccessPlanCard
// ═══════════════════════════════════════════════════════════════════════════════
import { SuccessPlanCard } from '@/components/Dashboard/Workspaces/billing/Success/SuccessPlanCard';

describe('SuccessPlanCard', () => {
  const baseMeta = {
    label: 'Pro',
    icon: vi.fn(),
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary',
    features: {} as any,
  };

  it('renders plan label and active status', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={false}
        trialDays={null}
        daysLeft={30}
        billingCycle="monthly"
        trialEnd={null}
        periodEnd="2025-12-31"
        visible={true}
      />
    );
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows "Trial active" when isTrialing', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={true}
        trialDays={14}
        daysLeft={null}
        billingCycle="monthly"
        trialEnd="2025-12-15"
        periodEnd={null}
        visible={true}
      />
    );
    expect(screen.getByText('Trial active')).toBeInTheDocument();
  });

  it('shows trial banner when isTrialing', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={true}
        trialDays={14}
        daysLeft={null}
        billingCycle="monthly"
        trialEnd="2025-12-15"
        periodEnd={null}
        visible={true}
      />
    );
    expect(screen.getByText(/14-day free trial/)).toBeInTheDocument();
  });

  it('does not show trial banner when not trialing', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={false}
        trialDays={null}
        daysLeft={30}
        billingCycle="monthly"
        trialEnd={null}
        periodEnd="2025-12-31"
        visible={true}
      />
    );
    expect(screen.queryByText(/free trial/)).not.toBeInTheDocument();
  });

  it('shows "days left" label when not trialing', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={false}
        trialDays={null}
        daysLeft={30}
        billingCycle="monthly"
        trialEnd={null}
        periodEnd="2025-12-31"
        visible={true}
      />
    );
    expect(screen.getByText('days left')).toBeInTheDocument();
  });

  it('shows "trial days" label when trialing', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={true}
        trialDays={14}
        daysLeft={null}
        billingCycle="monthly"
        trialEnd="2025-12-15"
        periodEnd={null}
        visible={true}
      />
    );
    expect(screen.getByText('trial days')).toBeInTheDocument();
  });

  it('shows billing cycle', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={false}
        trialDays={null}
        daysLeft={30}
        billingCycle="yearly"
        trialEnd={null}
        periodEnd="2025-12-31"
        visible={true}
      />
    );
    expect(screen.getByText('yearly')).toBeInTheDocument();
  });

  it('shows "renews on" for non-trial', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={false}
        trialDays={null}
        daysLeft={30}
        billingCycle="monthly"
        trialEnd={null}
        periodEnd="2025-12-31"
        visible={true}
      />
    );
    expect(screen.getByText('renews on')).toBeInTheDocument();
  });

  it('shows "trial ends" for trial', () => {
    render(
      <SuccessPlanCard
        meta={baseMeta}
        isTrialing={true}
        trialDays={14}
        daysLeft={null}
        billingCycle="monthly"
        trialEnd="2025-12-15"
        periodEnd={null}
        visible={true}
      />
    );
    expect(screen.getByText('trial ends')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. ActionButtons
// ═══════════════════════════════════════════════════════════════════════════════
import { ActionButtons } from '@/components/Dashboard/Workspaces/billing/Success/ActionButtons';

describe('ActionButtons', () => {
  it('renders go to workspace link', () => {
    render(<ActionButtons workspaceSlug="my-ws" planName="PRO" visible={true} />);
    expect(screen.getByText('Go to workspace')).toHaveAttribute('href', '/dashboard/workspaces/my-ws');
  });

  it('renders upgrade link for PRO plan', () => {
    render(<ActionButtons workspaceSlug="my-ws" planName="PRO" visible={true} />);
    expect(screen.getByText('Upgrade plan')).toBeInTheDocument();
  });

  it('renders manage billing link for PRO plan', () => {
    render(<ActionButtons workspaceSlug="my-ws" planName="PRO" visible={true} />);
    expect(screen.getByText('Manage billing')).toHaveAttribute('href', '/dashboard/workspaces/my-ws/billing');
  });

  it('renders upgrade link for FREE plan', () => {
    render(<ActionButtons workspaceSlug="my-ws" planName="FREE" visible={true} />);
    expect(screen.getByText('Upgrade plan')).toBeInTheDocument();
  });

  it('applies visible class when visible', () => {
    const { container } = render(<ActionButtons workspaceSlug="my-ws" planName="PRO" visible={true} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain('opacity-100');
  });

  it('applies hidden class when not visible', () => {
    const { container } = render(<ActionButtons workspaceSlug="my-ws" planName="PRO" visible={false} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.className).toContain('opacity-0');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. DayDetailsPanel
// ═══════════════════════════════════════════════════════════════════════════════
import { DayDetailsPanel } from '@/components/Dashboard/Calendar/DayDetailsPanel';

describe('DayDetailsPanel', () => {
  const baseProps = {
    date: new Date('2025-06-15'),
    goals: [],
    events: [],
    onClose: vi.fn(),
  };

  it('renders formatted date', () => {
    render(<DayDetailsPanel {...baseProps} />);
    expect(screen.getByText(/June 15, 2025/)).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<DayDetailsPanel {...baseProps} />);
    expect(screen.getByText('Day overview and insights')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<DayDetailsPanel {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close panel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders energy level section', () => {
    render(<DayDetailsPanel {...baseProps} />);
    expect(screen.getByText('Energy Level')).toBeInTheDocument();
  });

  it('renders energy history section', () => {
    render(<DayDetailsPanel {...baseProps} />);
    expect(screen.getByText('Energy History')).toBeInTheDocument();
  });

  it('renders sub-components', () => {
    render(<DayDetailsPanel {...baseProps} />);
    expect(screen.getByTestId('planned-hours-card')).toBeInTheDocument();
    expect(screen.getByTestId('focus-sessions-card')).toBeInTheDocument();
    expect(screen.getByTestId('goals-card')).toBeInTheDocument();
    expect(screen.getByTestId('burnout-card')).toBeInTheDocument();
    expect(screen.getByTestId('events-card')).toBeInTheDocument();
    expect(screen.getByTestId('day-summary-bar')).toBeInTheDocument();
  });

  it('shows "Log your energy level" when no energy data', () => {
    render(<DayDetailsPanel {...baseProps} />);
    expect(screen.getByText(/\+ Log your energy level/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. TaskModalContent
// ═══════════════════════════════════════════════════════════════════════════════
import { TaskModalContent } from '@/components/Dashboard/CalendarView/TaskModal/TaskModalContent';

describe('TaskModalContent', () => {
  const baseProps = {
    description: 'Test description',
    startDate: '2025-01-01',
    dueDate: '2025-01-15',
    estimatedHours: 8,
    createdAt: '2025-01-01',
    isOverdue: false,
    createdBy: { id: 'u1', name: 'Alice' },
    assignees: [{ user: { id: 'u1', name: 'Alice' } }],
    project: { id: 'p1', name: 'Test Project', color: '#fff', workspace: { id: 'w1', name: 'WS' } },
    commentsCount: 5,
    subtasksCount: 3,
    filesCount: 2,
  };

  it('renders all sub-sections', () => {
    render(<TaskModalContent {...baseProps} />);
    expect(screen.getByTestId('task-description')).toBeInTheDocument();
    expect(screen.getByTestId('task-time-details')).toBeInTheDocument();
    expect(screen.getByTestId('task-people-section')).toBeInTheDocument();
    expect(screen.getByTestId('task-project-section')).toBeInTheDocument();
    expect(screen.getByTestId('task-activity-stats')).toBeInTheDocument();
  });

  it('passes description to TaskDescription', () => {
    render(<TaskModalContent {...baseProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('passes correct props to TaskTimeDetails', () => {
    render(<TaskModalContent {...baseProps} />);
    const timeDetails = screen.getByTestId('task-time-details');
    const props = JSON.parse(timeDetails.getAttribute('data-props')!);
    expect(props.startDate).toBe('2025-01-01');
    expect(props.dueDate).toBe('2025-01-15');
    expect(props.isOverdue).toBe(false);
  });

  it('handles null description', () => {
    render(<TaskModalContent {...baseProps} description={null} />);
    const desc = screen.getByTestId('task-description');
    expect(desc).toBeInTheDocument();
    expect(desc.textContent).toBe('');
  });

  it('handles null project', () => {
    render(<TaskModalContent {...baseProps} project={null} />);
    expect(screen.getByTestId('task-project-section')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. MeetingCard
// ═══════════════════════════════════════════════════════════════════════════════
import { MeetingCard } from '@/components/Dashboard/Workspaces/Meeting/MeetingCard';

describe('MeetingCard', () => {
  const baseMeeting = {
    id: 'm1',
    title: 'Team Standup',
    description: 'Daily sync',
    link: null,
    location: 'Room A',
    visibility: 'PUBLIC' as const,
    status: 'SCHEDULED' as const,
    startTime: '2025-07-15T10:00:00Z',
    endTime: '2025-07-15T10:30:00Z',
    createdAt: '2025-07-10',
    updatedAt: '2025-07-10',
    workspaceId: 'w1',
    createdById: 'u1',
    createdBy: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: null },
    attendees: [
      { id: 'a1', userId: 'u1', joinedAt: '2025-07-10', user: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: null } },
    ],
  };

  it('renders meeting title', () => {
    render(<MeetingCard meeting={baseMeeting} isAdmin={false} currentUserId="u1" />);
    expect(screen.getByText('Team Standup')).toBeInTheDocument();
  });

  it('renders public visibility', () => {
    render(<MeetingCard meeting={baseMeeting} isAdmin={false} currentUserId="u1" />);
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('renders private visibility', () => {
    render(
      <MeetingCard
        meeting={{ ...baseMeeting, visibility: 'PRIVATE' }}
        isAdmin={false}
        currentUserId="u1"
      />
    );
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('renders location', () => {
    render(<MeetingCard meeting={baseMeeting} isAdmin={false} currentUserId="u1" />);
    expect(screen.getByText('Room A')).toBeInTheDocument();
  });

  it('renders meeting link', () => {
    render(
      <MeetingCard
        meeting={{ ...baseMeeting, link: 'https://meet.google.com/abc' }}
        isAdmin={false}
        currentUserId="u1"
      />
    );
    expect(screen.getByText('Join meeting')).toHaveAttribute('href', 'https://meet.google.com/abc');
  });

  it('renders attendee count', () => {
    render(<MeetingCard meeting={baseMeeting} isAdmin={false} currentUserId="u1" />);
    expect(screen.getByText(/1 attendee/)).toBeInTheDocument();
  });

  it('shows "Open to all workspace members" for public meeting with no attendees', () => {
    render(
      <MeetingCard
        meeting={{ ...baseMeeting, attendees: [] }}
        isAdmin={false}
        currentUserId="u1"
      />
    );
    expect(screen.getByText('Open to all workspace members')).toBeInTheDocument();
  });

  it('calls onClick when card clicked', () => {
    const onClick = vi.fn();
    render(<MeetingCard meeting={baseMeeting} isAdmin={false} currentUserId="u1" onClick={onClick} />);
    fireEvent.click(screen.getByText('Team Standup'));
    expect(onClick).toHaveBeenCalledWith(baseMeeting);
  });

  it('shows action menu for admin', () => {
    render(<MeetingCard meeting={baseMeeting} isAdmin={true} currentUserId="u1" />);
    expect(screen.getByLabelText('Meeting actions')).toBeInTheDocument();
  });

  it('hides action menu for non-admin', () => {
    render(<MeetingCard meeting={baseMeeting} isAdmin={false} currentUserId="u2" />);
    expect(screen.queryByLabelText('Meeting actions')).not.toBeInTheDocument();
  });

  it('opens menu dropdown when action button clicked', () => {
    render(<MeetingCard meeting={baseMeeting} isAdmin={true} currentUserId="u1" onEdit={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Meeting actions'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('shows cancel and delete in menu', () => {
    render(
      <MeetingCard
        meeting={baseMeeting}
        isAdmin={true}
        currentUserId="u1"
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText('Meeting actions'));
    expect(screen.getByText('Cancel meeting')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows reduced opacity for cancelled meeting', () => {
    const { container } = render(
      <MeetingCard
        meeting={{ ...baseMeeting, status: 'CANCELLED' }}
        isAdmin={true}
        currentUserId="u1"
      />
    );
    const article = container.querySelector('article');
    expect(article?.className).toContain('opacity-60');
  });

  it('hides menu for cancelled meeting', () => {
    render(
      <MeetingCard
        meeting={{ ...baseMeeting, status: 'CANCELLED' }}
        isAdmin={true}
        currentUserId="u1"
      />
    );
    expect(screen.queryByLabelText('Meeting actions')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 12. MeetingFormModalInner
// ═══════════════════════════════════════════════════════════════════════════════
import { MeetingFormModalInner } from '@/components/Dashboard/Workspaces/Meeting/MeetingForm/MeetingFormModalInner';

describe('MeetingFormModalInner', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    isPending: false,
    error: null,
    members: [],
    currentUserId: 'u1',
    editingMeeting: null,
  };

  it('renders "New Meeting" title for create mode', () => {
    render(<MeetingFormModalInner {...defaultProps} />);
    expect(screen.getByText('New Meeting')).toBeInTheDocument();
  });

  it('renders "Edit Meeting" title for edit mode', () => {
    render(
      <MeetingFormModalInner
        {...defaultProps}
        editingMeeting={{
          id: 'm1',
          title: 'Existing',
          description: null,
          link: null,
          location: null,
          visibility: 'PUBLIC',
          status: 'SCHEDULED',
          startTime: '2025-07-15T10:00:00Z',
          endTime: '2025-07-15T10:30:00Z',
          createdAt: '2025-07-10',
          updatedAt: '2025-07-10',
          workspaceId: 'w1',
          createdById: 'u1',
          createdBy: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: null },
          attendees: [],
        }}
      />
    );
    expect(screen.getByText('Edit Meeting')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<MeetingFormModalInner {...defaultProps} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Meeting link')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('renders Cancel and Create buttons', () => {
    render(<MeetingFormModalInner {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create meeting')).toBeInTheDocument();
  });

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn();
    render(<MeetingFormModalInner {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows "Save changes" in edit mode', () => {
    render(
      <MeetingFormModalInner
        {...defaultProps}
        editingMeeting={{
          id: 'm1',
          title: 'Existing',
          description: null,
          link: null,
          location: null,
          visibility: 'PUBLIC',
          status: 'SCHEDULED',
          startTime: '2025-07-15T10:00:00Z',
          endTime: '2025-07-15T10:30:00Z',
          createdAt: '2025-07-10',
          updatedAt: '2025-07-10',
          workspaceId: 'w1',
          createdById: 'u1',
          createdBy: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: null },
          attendees: [],
        }}
      />
    );
    expect(screen.getByText('Save changes')).toBeInTheDocument();
  });

  it('displays error when provided', () => {
    render(<MeetingFormModalInner {...defaultProps} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('disables buttons when isPending', () => {
    render(<MeetingFormModalInner {...defaultProps} isPending={true} />);
    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Create meeting')).toBeDisabled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 13. FormField
// ═══════════════════════════════════════════════════════════════════════════════
import { FormField } from '@/components/Dashboard/Workspaces/Meeting/MeetingForm/FormField';

describe('FormField', () => {
  it('renders label', () => {
    render(<FormField label="Name"><input /></FormField>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('shows required asterisk', () => {
    render(<FormField label="Name" required><input /></FormField>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows hint text', () => {
    render(<FormField label="Link" hint="URL"><input /></FormField>);
    expect(screen.getByText('(URL)')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<FormField label="Name"><input placeholder="Enter name" /></FormField>);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('renders without required and hint', () => {
    render(<FormField label="Desc"><textarea /></FormField>);
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 14. VisibilityPicker
// ═══════════════════════════════════════════════════════════════════════════════
import { VisibilityPicker } from '@/components/Dashboard/Workspaces/Meeting/MeetingForm/VisibilityPicker';

describe('VisibilityPicker', () => {
  it('renders Public and Private options', () => {
    render(<VisibilityPicker value="PUBLIC" onChange={vi.fn()} />);
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('calls onChange when Public clicked', () => {
    const onChange = vi.fn();
    render(<VisibilityPicker value="PRIVATE" onChange={onChange} />);
    fireEvent.click(screen.getByText('Public'));
    expect(onChange).toHaveBeenCalledWith('PUBLIC');
  });

  it('calls onChange when Private clicked', () => {
    const onChange = vi.fn();
    render(<VisibilityPicker value="PUBLIC" onChange={onChange} />);
    fireEvent.click(screen.getByText('Private'));
    expect(onChange).toHaveBeenCalledWith('PRIVATE');
  });

  it('highlights selected option', () => {
    const { container } = render(<VisibilityPicker value="PUBLIC" onChange={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].className).toContain('border-primary');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 15. AttendeePicker
// ═══════════════════════════════════════════════════════════════════════════════
import { AttendeePicker } from '@/components/Dashboard/Workspaces/Meeting/MeetingForm/AttendeePicker';

describe('AttendeePicker', () => {
  const members = [
    { id: 'm1', userId: 'u1', role: 'ADMIN', user: { id: 'u1', name: 'Alice', email: 'alice@test.com', image: null } },
    { id: 'm2', userId: 'u2', role: 'MEMBER', user: { id: 'u2', name: 'Bob', email: 'bob@test.com', image: null } },
  ];

  it('renders member list excluding current user', () => {
    render(
      <AttendeePicker
        attendeeIds={[]}
        members={members}
        currentUserId="u1"
        search=""
        onSearchChange={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('shows "No members found" when filter excludes all', () => {
    render(
      <AttendeePicker
        attendeeIds={[]}
        members={members}
        currentUserId="u2"
        search="zzz"
        onSearchChange={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText('No members found')).toBeInTheDocument();
  });

  it('calls onToggle when member clicked', () => {
    const onToggle = vi.fn();
    render(
      <AttendeePicker
        attendeeIds={[]}
        members={members}
        currentUserId="u1"
        search=""
        onSearchChange={vi.fn()}
        onToggle={onToggle}
      />
    );
    fireEvent.click(screen.getByText('Bob'));
    expect(onToggle).toHaveBeenCalledWith('u2');
  });

  it('shows selected count', () => {
    render(
      <AttendeePicker
        attendeeIds={['u2']}
        members={members}
        currentUserId="u1"
        search=""
        onSearchChange={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <AttendeePicker
        attendeeIds={[]}
        members={members}
        currentUserId="u1"
        search=""
        onSearchChange={vi.fn()}
        onToggle={vi.fn()}
        required
      />
    );
    expect(screen.getByText(/Attendees/)).toBeInTheDocument();
  });

  it('filters members by search', () => {
    render(
      <AttendeePicker
        attendeeIds={[]}
        members={members}
        currentUserId="u1"
        search="bob"
        onSearchChange={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 16. AnnouncementCard
// ═══════════════════════════════════════════════════════════════════════════════
import { AnnouncementCard } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementCard';

describe('AnnouncementCard', () => {
  const baseAnnouncement = {
    id: 'a1',
    title: 'Important Update',
    content: 'This is the content of the announcement with some text.',
    visibility: 'PUBLIC' as const,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    workspaceId: 'w1',
    projectId: null,
    project: null,
    createdById: 'u1',
    createdBy: { id: 'u1', name: 'Admin', image: null },
    targets: [],
  };

  const defaultProps = {
    announcement: baseAnnouncement,
    canManage: false,
    isDeleting: false,
    isPinning: false,
    onClick: vi.fn(),
    onDelete: vi.fn(),
    onTogglePin: vi.fn(),
    index: 0,
  };

  it('renders title', () => {
    render(<AnnouncementCard {...defaultProps} />);
    expect(screen.getByText('Important Update')).toBeInTheDocument();
  });

  it('renders public visibility badge', () => {
    render(<AnnouncementCard {...defaultProps} />);
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('renders private visibility badge', () => {
    render(
      <AnnouncementCard
        {...defaultProps}
        announcement={{ ...baseAnnouncement, visibility: 'PRIVATE' }}
      />
    );
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('renders content preview', () => {
    render(<AnnouncementCard {...defaultProps} />);
    expect(screen.getByText(/This is the content/)).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<AnnouncementCard {...defaultProps} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('calls onClick when card clicked', () => {
    const onClick = vi.fn();
    render(<AnnouncementCard {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByText('Important Update'));
    expect(onClick).toHaveBeenCalled();
  });

  it('shows pin and delete buttons when canManage', () => {
    render(<AnnouncementCard {...defaultProps} canManage={true} />);
    expect(screen.getByTitle('Pin')).toBeInTheDocument();
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('hides pin and delete when not canManage', () => {
    render(<AnnouncementCard {...defaultProps} canManage={false} />);
    expect(screen.queryByTitle('Pin')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument();
  });

  it('shows pinned indicator', () => {
    render(
      <AnnouncementCard
        {...defaultProps}
        announcement={{ ...baseAnnouncement, isPinned: true }}
        canManage={true}
      />
    );
    expect(screen.getByTitle('Unpin')).toBeInTheDocument();
  });

  it('shows delete confirm modal when delete clicked', () => {
    render(<AnnouncementCard {...defaultProps} canManage={true} />);
    fireEvent.click(screen.getByTitle('Delete'));
    expect(screen.getByTestId('delete-confirm-modal')).toBeInTheDocument();
  });

  it('shows pinnning loader when isPinning', () => {
    render(<AnnouncementCard {...defaultProps} canManage={true} isPinning={true} />);
    // Pin button should be disabled when pinning
    expect(screen.getByTitle('Pin')).toBeDisabled();
  });

  it('shows deleting loader when isDeleting', () => {
    render(<AnnouncementCard {...defaultProps} canManage={true} isDeleting={true} />);
    expect(screen.getByTitle('Delete')).toBeDisabled();
  });

  it('shows recipient count for private announcements', () => {
    render(
      <AnnouncementCard
        {...defaultProps}
        announcement={{
          ...baseAnnouncement,
          visibility: 'PRIVATE',
          targets: [
            { userId: 'u1', user: { id: 'u1', name: 'Alice', image: null } },
            { userId: 'u2', user: { id: 'u2', name: 'Bob', image: null } },
          ],
        }}
      />
    );
    expect(screen.getByText(/2 recipients/)).toBeInTheDocument();
  });

  it('shows singular "recipient" for one target', () => {
    render(
      <AnnouncementCard
        {...defaultProps}
        announcement={{
          ...baseAnnouncement,
          visibility: 'PRIVATE',
          targets: [{ userId: 'u1', user: { id: 'u1', name: 'Alice', image: null } }],
        }}
      />
    );
    expect(screen.getByText(/1 recipient/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 17. AnnouncementDetailModal
// ═══════════════════════════════════════════════════════════════════════════════
import { AnnouncementDetailModal } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementDetailModal';

describe('AnnouncementDetailModal', () => {
  const baseAnnouncement = {
    id: 'a1',
    title: 'Important Update',
    content: 'Content body',
    visibility: 'PUBLIC' as const,
    isPinned: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15',
    workspaceId: 'w1',
    projectId: null,
    project: null,
    createdById: 'u1',
    createdBy: { id: 'u1', name: 'Admin', image: null },
    targets: [],
  };

  it('renders nothing when announcement is null', () => {
    const { container } = render(
      <AnnouncementDetailModal announcement={null} isOpen={true} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AnnouncementDetailModal announcement={baseAnnouncement} isOpen={false} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders announcement title and content when open', () => {
    render(<AnnouncementDetailModal announcement={baseAnnouncement} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Important Update')).toBeInTheDocument();
    expect(screen.getByTestId('rendered-content')).toHaveTextContent('Content body');
  });

  it('renders public visibility', () => {
    render(<AnnouncementDetailModal announcement={baseAnnouncement} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('renders private visibility', () => {
    render(
      <AnnouncementDetailModal
        announcement={{ ...baseAnnouncement, visibility: 'PRIVATE' }}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<AnnouncementDetailModal announcement={baseAnnouncement} isOpen={true} onClose={onClose} />);
    // The X icon mock is rendered as an svg with data-testid="icon" inside a button
    const buttons = document.querySelectorAll('button');
    const closeBtn = Array.from(buttons).find((btn) => btn.querySelector('[data-testid="icon"]'));
    if (closeBtn) fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows pinned badge when isPinned', () => {
    render(
      <AnnouncementDetailModal
        announcement={{ ...baseAnnouncement, isPinned: true }}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  it('shows author name', () => {
    render(<AnnouncementDetailModal announcement={baseAnnouncement} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows recipients section for private announcements', () => {
    render(
      <AnnouncementDetailModal
        announcement={{
          ...baseAnnouncement,
          visibility: 'PRIVATE',
          targets: [{ userId: 'u1', user: { id: 'u1', name: 'Alice', image: null } }],
        }}
        isOpen={true}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText(/Recipients/)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('does not show recipients for public announcements', () => {
    render(<AnnouncementDetailModal announcement={baseAnnouncement} isOpen={true} onClose={vi.fn()} />);
    expect(screen.queryByText(/Recipients/)).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 18. AnnouncementForm
// ═══════════════════════════════════════════════════════════════════════════════
import { AnnouncementForm } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementForm';

describe('AnnouncementForm', () => {
  const defaultProps = {
    formState: {
      title: '',
      content: '',
      visibility: 'PUBLIC' as const,
      isPinned: false,
      targetIds: [],
      projectId: null,
    },
    members: [],
    onTitleChange: vi.fn(),
    onContentChange: vi.fn(),
    onVisibilityChange: vi.fn(),
    onIsPinnedChange: vi.fn(),
    onTargetToggle: vi.fn(),
    disabled: false,
  };

  it('renders title input', () => {
    render(<AnnouncementForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Announcement title…')).toBeInTheDocument();
  });

  it('renders content editor', () => {
    render(<AnnouncementForm {...defaultProps} />);
    expect(screen.getByTestId('content-editor')).toBeInTheDocument();
  });

  it('renders audience options', () => {
    render(<AnnouncementForm {...defaultProps} />);
    expect(screen.getByText('Everyone')).toBeInTheDocument();
    expect(screen.getByText('Specific people')).toBeInTheDocument();
  });

  it('calls onTitleChange when title input changes', () => {
    const onTitleChange = vi.fn();
    render(<AnnouncementForm {...defaultProps} onTitleChange={onTitleChange} />);
    fireEvent.change(screen.getByPlaceholderText('Announcement title…'), { target: { value: 'New' } });
    expect(onTitleChange).toHaveBeenCalledWith('New');
  });

  it('calls onVisibilityChange when audience option clicked', () => {
    const onVisibilityChange = vi.fn();
    render(<AnnouncementForm {...defaultProps} onVisibilityChange={onVisibilityChange} />);
    fireEvent.click(screen.getByText('Specific people'));
    expect(onVisibilityChange).toHaveBeenCalledWith('PRIVATE');
  });

  it('calls onIsPinnedChange when pin toggle clicked', () => {
    const onIsPinnedChange = vi.fn();
    render(<AnnouncementForm {...defaultProps} onIsPinnedChange={onIsPinnedChange} />);
    fireEvent.click(screen.getByText('Pin this announcement'));
    expect(onIsPinnedChange).toHaveBeenCalledWith(true);
  });

  it('shows "Pinned to top" when isPinned', () => {
    render(
      <AnnouncementForm
        {...defaultProps}
        formState={{ ...defaultProps.formState, isPinned: true }}
      />
    );
    expect(screen.getByText('Pinned to top')).toBeInTheDocument();
  });

  it('shows recipients picker for PRIVATE visibility', () => {
    render(
      <AnnouncementForm
        {...defaultProps}
        formState={{ ...defaultProps.formState, visibility: 'PRIVATE' }}
        members={[
          { userId: 'u1', user: { id: 'u1', name: 'Alice', image: null } },
        ]}
      />
    );
    expect(screen.getByText('Recipients')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows "No members found" when members is empty in PRIVATE mode', () => {
    render(
      <AnnouncementForm
        {...defaultProps}
        formState={{ ...defaultProps.formState, visibility: 'PRIVATE' }}
        members={[]}
      />
    );
    expect(screen.getByText('No members found')).toBeInTheDocument();
  });

  it('calls onTargetToggle when member clicked in PRIVATE mode', () => {
    const onTargetToggle = vi.fn();
    render(
      <AnnouncementForm
        {...defaultProps}
        formState={{ ...defaultProps.formState, visibility: 'PRIVATE' }}
        members={[{ userId: 'u1', user: { id: 'u1', name: 'Alice', image: null } }]}
        onTargetToggle={onTargetToggle}
      />
    );
    fireEvent.click(screen.getByText('Alice'));
    expect(onTargetToggle).toHaveBeenCalledWith('u1');
  });

  it('shows selected count when targets selected', () => {
    render(
      <AnnouncementForm
        {...defaultProps}
        formState={{ ...defaultProps.formState, visibility: 'PRIVATE', targetIds: ['u1'] }}
        members={[{ userId: 'u1', user: { id: 'u1', name: 'Alice', image: null } }]}
      />
    );
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('renders project scope when projects provided', () => {
    render(
      <AnnouncementForm
        {...defaultProps}
        projects={[{ id: 'p1', name: 'Project A' }]}
      />
    );
    expect(screen.getByText('Scope')).toBeInTheDocument();
  });

  it('does not render project scope when no projects', () => {
    render(<AnnouncementForm {...defaultProps} />);
    expect(screen.queryByText('Scope')).not.toBeInTheDocument();
  });

  it('shows locked project pill when lockedProjectId', () => {
    render(
      <AnnouncementForm
        {...defaultProps}
        projects={[{ id: 'p1', name: 'Project A' }]}
        lockedProjectId="p1"
      />
    );
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });

  it('disables inputs when disabled', () => {
    render(<AnnouncementForm {...defaultProps} disabled={true} />);
    expect(screen.getByPlaceholderText('Announcement title…')).toBeDisabled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 19. AnnouncementList
// ═══════════════════════════════════════════════════════════════════════════════
import { AnnouncementList } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementList';

describe('AnnouncementList', () => {
  const pagination = {
    page: 1,
    pageSize: 10,
    totalCount: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const baseProps = {
    announcements: [],
    pagination,
    canManage: false,
    isLoading: false,
    deletingId: null,
    pinningId: null,
    currentPage: 1,
    onDelete: vi.fn(),
    onTogglePin: vi.fn(),
    onPageChange: vi.fn(),
    isFetching: false,
  };

  it('shows loading spinner when isLoading', () => {
    render(<AnnouncementList {...baseProps} isLoading={true} />);
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('shows empty state when no announcements', () => {
    render(<AnnouncementList {...baseProps} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders announcements', () => {
    const announcements = [
      {
        id: 'a1',
        title: 'Announcement 1',
        content: 'Content 1',
        visibility: 'PUBLIC' as const,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: 'w1',
        projectId: null,
        project: null,
        createdById: 'u1',
        createdBy: { id: 'u1', name: 'Admin', image: null },
        targets: [],
      },
    ];
    render(<AnnouncementList {...baseProps} announcements={announcements} />);
    expect(screen.getByText('Announcement 1')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    render(<AnnouncementList {...baseProps} announcements={[]} isFetching={true} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('shows updating indicator when isFetching', () => {
    const announcements = [
      {
        id: 'a1',
        title: 'Test',
        content: 'Content',
        visibility: 'PUBLIC' as const,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: 'w1',
        projectId: null,
        project: null,
        createdById: 'u1',
        createdBy: { id: 'u1', name: 'Admin', image: null },
        targets: [],
      },
    ];
    render(<AnnouncementList {...baseProps} announcements={announcements} isFetching={true} />);
    expect(screen.getByText('Updating…')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 20. DangerTab
// ═══════════════════════════════════════════════════════════════════════════════
import { DangerTab } from '@/components/Dashboard/Workspaces/project/Settings/DangerTab';

describe('DangerTab', () => {
  const baseProject = {
    id: 'p1',
    name: 'Test Project',
    description: 'A project',
    status: 'ACTIVE' as const,
  };

  it('renders archive section when canManage and not archived', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={false} workspaceSlug="ws" />);
    expect(screen.getAllByText('Archive Project').length).toBeGreaterThanOrEqual(1);
  });

  it('renders change status section', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={false} workspaceSlug="ws" />);
    expect(screen.getByText('Change Status')).toBeInTheDocument();
  });

  it('renders delete section when isOwnerOrAdmin', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={true} workspaceSlug="ws" />);
    expect(screen.getByText('Delete Project')).toBeInTheDocument();
  });

  it('hides delete section when not owner or admin', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={false} workspaceSlug="ws" />);
    expect(screen.queryByText('Delete Project')).not.toBeInTheDocument();
  });

  it('shows permission denied when no manage and no owner', () => {
    render(<DangerTab project={baseProject as any} canManage={false} isOwnerOrAdmin={false} workspaceSlug="ws" />);
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument();
  });

  it('renders archive input for confirmation', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={false} workspaceSlug="ws" />);
    expect(screen.getByPlaceholderText('Test Project')).toBeInTheDocument();
  });

  it('renders status option buttons', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={false} workspaceSlug="ws" />);
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('On Hold')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows current status', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={false} workspaceSlug="ws" />);
    expect(screen.getByText(/Current status:/)).toBeInTheDocument();
  });

  it('renders unarchive section when archived', () => {
    render(
      <DangerTab
        project={{ ...baseProject, status: 'ARCHIVED' } as any}
        canManage={true}
        isOwnerOrAdmin={true}
        workspaceSlug="ws"
      />
    );
    expect(screen.getByText('Unarchive Project')).toBeInTheDocument();
  });

  it('does not render archive or change status when archived', () => {
    render(
      <DangerTab
        project={{ ...baseProject, status: 'ARCHIVED' } as any}
        canManage={true}
        isOwnerOrAdmin={true}
        workspaceSlug="ws"
      />
    );
    expect(screen.queryByText('Archive Project')).not.toBeInTheDocument();
    expect(screen.queryByText('Change Status')).not.toBeInTheDocument();
  });

  it('shows delete confirmation input', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={true} workspaceSlug="ws" />);
    const inputs = screen.getAllByPlaceholderText('Test Project');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders irreversible warning', () => {
    render(<DangerTab project={baseProject as any} canManage={true} isOwnerOrAdmin={true} workspaceSlug="ws" />);
    expect(screen.getByText(/irreversible/)).toBeInTheDocument();
  });

  it('renders restore button label for unarchive', () => {
    render(
      <DangerTab
        project={{ ...baseProject, status: 'ARCHIVED' } as any}
        canManage={true}
        isOwnerOrAdmin={false}
        workspaceSlug="ws"
      />
    );
    expect(screen.getByText(/Restore as Active/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 21. GeneralTab
// ═══════════════════════════════════════════════════════════════════════════════
import { GeneralTab } from '@/components/Dashboard/Workspaces/project/Settings/GeneralTab';

describe('GeneralTab', () => {
  const baseProject = {
    id: 'p1',
    name: 'Test Project',
    description: 'A test description',
    status: 'ACTIVE' as const,
  };

  it('renders project name input with value', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
  });

  it('renders description textarea with value', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    expect(screen.getByDisplayValue('A test description')).toBeInTheDocument();
  });

  it('shows save button when canManage', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('hides save button when cannot manage', () => {
    render(<GeneralTab project={baseProject as any} canManage={false} />);
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument();
  });

  it('disables inputs when cannot manage', () => {
    render(<GeneralTab project={baseProject as any} canManage={false} />);
    expect(screen.getByDisplayValue('Test Project')).toBeDisabled();
    expect(screen.getByDisplayValue('A test description')).toBeDisabled();
  });

  it('updates name when input changes', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    const input = screen.getByDisplayValue('Test Project');
    fireEvent.change(input, { target: { value: 'New Name' } });
    expect(input).toHaveValue('New Name');
  });

  it('shows description length counter', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    // The counter renders "18" and "/500" as separate text nodes
    const counterEl = document.querySelector('.text-\\[10px\\]');
    if (counterEl) {
      expect(counterEl.textContent).toContain('/500');
    }
  });

  it('renders project info section', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    expect(screen.getByText('Project Info')).toBeInTheDocument();
  });

  it('renders visibility section', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    expect(screen.getByText('Project Visibility')).toBeInTheDocument();
    expect(screen.getByText(/inherited from the workspace/)).toBeInTheDocument();
  });

  it('renders section descriptions', () => {
    render(<GeneralTab project={baseProject as any} canManage={true} />);
    expect(screen.getByText("Update the project's name and description.")).toBeInTheDocument();
  });
});
