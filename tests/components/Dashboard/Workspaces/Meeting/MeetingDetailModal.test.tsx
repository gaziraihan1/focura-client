import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeetingDetailModal } from '@/components/Dashboard/Workspaces/Meeting/MeetingDetailModal';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />;
  return {
    X: icon('x'),
    Calendar: icon('calendar'),
    Clock: icon('clock'),
    MapPin: icon('map-pin'),
    Link2: icon('link2'),
  };
});

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('@/components/Dashboard/Workspaces/Meeting/MeetingStatusBadge', () => ({
  MeetingStatusBadge: ({ status }: any) => <span data-testid="status-badge">{status}</span>,
}));

vi.mock('@/utils/meeting.utils', () => ({
  formatMeetingDate: () => 'Jan 15, 2025',
  formatMeetingTime: () => '10:00 AM',
  formatMeetingDuration: () => '60 min',
  isMeetingLive: () => false,
  STATUS_COLORS: {},
  STATUS_LABELS: {},
}));

function makeMeeting(overrides: any = {}) {
  return {
    id: 'm-1',
    title: 'Team Standup',
    description: 'Daily standup',
    startTime: '2025-01-15T10:00:00Z',
    endTime: '2025-01-15T11:00:00Z',
    status: 'SCHEDULED',
    visibility: 'PUBLIC',
    location: 'Room A',
    link: null,
    createdById: 'user-1',
    createdBy: { name: 'Alice', email: 'alice@test.com', image: null },
    attendees: [],
    ...overrides,
  };
}

describe('MeetingDetailModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    isAdmin: true,
    currentUserId: 'user-1',
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders meeting title when open', () => {
    render(<MeetingDetailModal meeting={makeMeeting()} {...defaultProps} />);
    expect(screen.getByText('Team Standup')).toBeInTheDocument();
  });

  it('returns null when not open', () => {
    const { container } = render(<MeetingDetailModal meeting={makeMeeting()} {...defaultProps} open={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('returns null when meeting is null', () => {
    const { container } = render(<MeetingDetailModal meeting={null} {...defaultProps} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the meeting description', () => {
    render(<MeetingDetailModal meeting={makeMeeting()} {...defaultProps} />);
    expect(screen.getByText('Daily standup')).toBeInTheDocument();
  });
});
