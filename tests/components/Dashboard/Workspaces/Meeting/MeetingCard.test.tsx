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
