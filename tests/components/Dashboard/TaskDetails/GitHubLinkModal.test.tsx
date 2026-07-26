import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`icon-${name}`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    X: icon('X'),
    Link2: icon('Link2'),
    GitPullRequest: icon('GitPullRequest'),
    CircleDot: icon('CircleDot'),
    GitBranch: icon('GitBranch'),
    GitCommit: icon('GitCommit'),
    Loader2: icon('Loader2'),
    AlertCircle: icon('AlertCircle'),
  };
});

vi.mock('@/lib/axios', () => ({
  api: {
    put: vi.fn().mockResolvedValue({ success: true }),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubLinkModal } from '@/components/Dashboard/TaskDetails/GitHubLinkModal';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubLinkModal', () => {
  const defaultProps = {
    taskId: 'task-123',
    onClose: vi.fn(),
    onLinked: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with title', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    expect(screen.getByText('Link GitHub')).toBeInTheDocument();
  });

  it('renders link type buttons', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    expect(screen.getByText('Pull Request')).toBeInTheDocument();
    expect(screen.getByText('Issue')).toBeInTheDocument();
    expect(screen.getByText('Branch')).toBeInTheDocument();
    expect(screen.getByText('Commit')).toBeInTheDocument();
  });

  it('renders input field', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    expect(screen.getByPlaceholderText(/123 or https/)).toBeInTheDocument();
  });

  it('renders Cancel and Link buttons', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when X button is clicked', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('icon-X'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('disables Link button when input is empty', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    const linkButton = screen.getByText('Link');
    expect(linkButton).toBeDisabled();
  });

  it('calls API when input is provided', async () => {
    render(<GitHubLinkModal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/123 or https/);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByText('Link'));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/v1/tasks/task-123/github-link', {
        type: 'pr',
        number: 123,
      });
    });
  });

  it('calls onLinked after successful link', async () => {
    render(<GitHubLinkModal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/123 or https/);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByText('Link'));
    await waitFor(() => {
      expect(defaultProps.onLinked).toHaveBeenCalled();
    });
  });

  it('changes link type when button is clicked', () => {
    render(<GitHubLinkModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Issue'));
    expect(screen.getByPlaceholderText(/456 or https/)).toBeInTheDocument();
  });

  it('parses GitHub URL correctly', async () => {
    render(<GitHubLinkModal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/123 or https/);
    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo/pull/456' } });
    fireEvent.click(screen.getByText('Link'));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/v1/tasks/task-123/github-link', {
        type: 'pr',
        url: 'https://github.com/owner/repo/pull/456',
        number: 456,
      });
    });
  });
});
