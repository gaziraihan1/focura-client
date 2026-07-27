import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlackMessageLink } from '@/components/Dashboard/TaskDetails/TaskSidebar/SlackMessageLink';

// Mock the api module
vi.mock('@/lib/axios', () => ({
  api: {
    put: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SlackMessageLink', () => {
  const defaultProps = {
    taskId: 'task-1',
    channelId: 'C123456',
    messageTs: '1234567890.123456',
    messageUrl: 'https://workspace.slack.com/archives/C123456/p1234567890123456',
    userDisplayName: 'John Doe',
    onUnlinked: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the channel ID', () => {
    render(<SlackMessageLink {...defaultProps} />);
    expect(screen.getByText('#C123456')).toBeInTheDocument();
  });

  it('renders the user display name', () => {
    render(<SlackMessageLink {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders the "Linked Slack Message" heading', () => {
    render(<SlackMessageLink {...defaultProps} />);
    expect(screen.getByText('Linked Slack Message')).toBeInTheDocument();
  });

  it('renders the "Open in Slack" link with correct href', () => {
    render(<SlackMessageLink {...defaultProps} />);
    const link = screen.getByText('Open in Slack');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute(
      'href',
      'https://workspace.slack.com/archives/C123456/p1234567890123456',
    );
  });

  it('returns null if channelId is null', () => {
    const { container } = render(
      <SlackMessageLink {...defaultProps} channelId={null} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('returns null if messageTs is null', () => {
    const { container } = render(
      <SlackMessageLink {...defaultProps} messageTs={null} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders without user display name when not provided', () => {
    render(<SlackMessageLink {...defaultProps} userDisplayName={null} />);
    expect(screen.getByText('#C123456')).toBeInTheDocument();
    expect(screen.queryByText('From:')).not.toBeInTheDocument();
  });

  it('renders without message URL when not provided', () => {
    render(<SlackMessageLink {...defaultProps} messageUrl={null} />);
    expect(screen.getByText('#C123456')).toBeInTheDocument();
    expect(screen.queryByText('Open in Slack')).not.toBeInTheDocument();
  });
});
