import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Global mocks ────────────────────────────────────────────────────────────
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
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
