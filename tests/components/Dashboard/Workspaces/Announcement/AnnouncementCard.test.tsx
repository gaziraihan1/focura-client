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
