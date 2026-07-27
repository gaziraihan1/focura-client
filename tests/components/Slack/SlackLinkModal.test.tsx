import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SlackLinkModal } from '@/components/Dashboard/TaskDetails/SlackLinkModal';

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

// Mock the useSlackIntegration hook to return connected by default
vi.mock('@/hooks/integration/useSlackIntegration', () => ({
  useSlackIntegration: vi.fn(() => ({
    isConnected: true,
    integration: { id: 'int-1', provider: 'slack', active: true },
    loading: false,
    error: null,
  })),
}));

describe('SlackLinkModal', () => {
  const defaultProps = {
    taskId: 'task-1',
    onClose: vi.fn(),
    onLinked: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal title', () => {
    render(<SlackLinkModal {...defaultProps} />);
    expect(screen.getByText('Link Slack Message')).toBeInTheDocument();
  });

  it('renders the input field with placeholder', () => {
    render(<SlackLinkModal {...defaultProps} />);
    expect(
      screen.getByPlaceholderText(
        'https://workspace.slack.com/archives/C123/p1234567890',
      ),
    ).toBeInTheDocument();
  });

  it('renders the instructions list', () => {
    render(<SlackLinkModal {...defaultProps} />);
    expect(screen.getByText('How to get a Slack message link:')).toBeInTheDocument();
    expect(screen.getByText('Copy link')).toBeInTheDocument();
  });

  it('closes when the X button is clicked', () => {
    render(<SlackLinkModal {...defaultProps} />);
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows validation error for invalid URL', async () => {
    const user = userEvent.setup();
    render(<SlackLinkModal {...defaultProps} />);

    const input = screen.getByPlaceholderText(
      'https://workspace.slack.com/archives/C123/p1234567890',
    );
    await user.type(input, 'not-a-slack-url');

    const linkBtn = screen.getByText('Link Message');
    await user.click(linkBtn);

    const { default: toast } = await import('react-hot-toast');
    expect(toast.error).toHaveBeenCalledWith(
      'Please enter a valid Slack message URL',
    );
  });

  it('shows error for empty input', async () => {
    render(<SlackLinkModal {...defaultProps} />);

    // Button should be disabled when input is empty
    const linkBtn = screen.getByText('Link Message');
    expect(linkBtn.closest('button')).toBeDisabled();
  });

  it('renders the help link', () => {
    render(<SlackLinkModal {...defaultProps} />);
    const helpLink = screen.getByText('Learn more');
    expect(helpLink).toBeInTheDocument();
    expect(helpLink.closest('a')).toHaveAttribute(
      'href',
      'https://slack.com/help/articles/201925137-Copy-links-to-messages',
    );
  });

  it('link button is disabled when Slack is not connected', async () => {
    // Override the mock for this test
    const useSlackIntegrationModule = await import(
      '@/hooks/integration/useSlackIntegration'
    );
    vi.mocked(useSlackIntegrationModule.useSlackIntegration).mockReturnValue({
      isConnected: false,
      integration: null,
      loading: false,
      error: null,
    });

    render(<SlackLinkModal {...defaultProps} />);
    const linkBtn = screen.getByText('Link Message');
    expect(linkBtn.closest('button')).toBeDisabled();
  });
});
