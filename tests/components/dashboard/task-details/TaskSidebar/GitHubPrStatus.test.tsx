import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

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
    Github: icon('Github'),
    GitPullRequest: icon('GitPullRequest'),
    CheckCircle2: icon('CheckCircle2'),
    XCircle: icon('XCircle'),
    AlertCircle: icon('AlertCircle'),
  };
});

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubPrStatus } from '@/components/dashboard/task-details/TaskSidebar/GitHubPrStatus';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubPrStatus', () => {
  const defaultProps = {
    prUrl: 'https://github.com/owner/repo/pull/123',
    prNumber: 123,
    prStatus: 'open' as const,
    prChecks: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PR number', () => {
    render(<GitHubPrStatus {...defaultProps} />);
    expect(screen.getByText('#123')).toBeInTheDocument();
  });

  it('renders open status badge', () => {
    render(<GitHubPrStatus {...defaultProps} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders merged status badge', () => {
    render(<GitHubPrStatus {...defaultProps} prStatus="merged" />);
    expect(screen.getByText('Merged')).toBeInTheDocument();
  });

  it('renders closed status badge', () => {
    render(<GitHubPrStatus {...defaultProps} prStatus="closed" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders PR link with correct href', () => {
    render(<GitHubPrStatus {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/pull/123');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders checks when provided', () => {
    render(
      <GitHubPrStatus
        {...defaultProps}
        prChecks={{ totalChecks: 5, passingChecks: 5 }}
      />
    );
    expect(screen.getByText('5/5 checks passing')).toBeInTheDocument();
  });

  it('renders partial checks', () => {
    render(
      <GitHubPrStatus
        {...defaultProps}
        prChecks={{ totalChecks: 5, passingChecks: 3 }}
      />
    );
    expect(screen.getByText('3/5 checks passing')).toBeInTheDocument();
  });

  it('does not render checks when totalChecks is 0', () => {
    render(
      <GitHubPrStatus
        {...defaultProps}
        prChecks={{ totalChecks: 0, passingChecks: 0 }}
      />
    );
    expect(screen.queryByText('checks passing')).not.toBeInTheDocument();
  });

  it('does not render checks when prChecks is null', () => {
    render(<GitHubPrStatus {...defaultProps} prChecks={null} />);
    expect(screen.queryByText('checks passing')).not.toBeInTheDocument();
  });

  it('renders GitHub icon', () => {
    render(<GitHubPrStatus {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders PR icon', () => {
    render(<GitHubPrStatus {...defaultProps} />);
    expect(screen.getByTestId('icon-GitPullRequest')).toBeInTheDocument();
  });

  it('renders Pull Request label', () => {
    render(<GitHubPrStatus {...defaultProps} />);
    expect(screen.getByText('Pull Request')).toBeInTheDocument();
  });
});
