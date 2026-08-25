import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

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
    GitBranch: icon('GitBranch'),
    Shield: icon('Shield'),
  };
});

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubBranchLink } from '@/components/dashboard/task-details/TaskSidebar/GitHubBranchLink';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubBranchLink', () => {
  const defaultProps = {
    branchName: 'feature/new-feature',
    branchUrl: 'https://github.com/owner/repo/tree/feature/new-feature',
    isProtected: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders branch name', () => {
    render(<GitHubBranchLink {...defaultProps} />);
    expect(screen.getByText('feature/new-feature')).toBeInTheDocument();
  });

  it('renders branch link with correct href', () => {
    render(<GitHubBranchLink {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/tree/feature/new-feature');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub icon', () => {
    render(<GitHubBranchLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders GitBranch icon', () => {
    render(<GitHubBranchLink {...defaultProps} />);
    expect(screen.getByTestId('icon-GitBranch')).toBeInTheDocument();
  });

  it('renders Branch label', () => {
    render(<GitHubBranchLink {...defaultProps} />);
    expect(screen.getByText('Branch')).toBeInTheDocument();
  });

  it('renders protected badge when isProtected is true', () => {
    render(<GitHubBranchLink {...defaultProps} isProtected={true} />);
    expect(screen.getByText('Protected')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Shield')).toBeInTheDocument();
  });

  it('does not render protected badge when isProtected is false', () => {
    render(<GitHubBranchLink {...defaultProps} isProtected={false} />);
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-Shield')).not.toBeInTheDocument();
  });

  it('does not render protected badge when isProtected is not provided', () => {
    render(<GitHubBranchLink branchName="main" branchUrl="https://github.com/owner/repo/tree/main" />);
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('truncates long branch names', () => {
    const longBranchName = 'feature/very-long-branch-name-that-should-be-truncated';
    render(<GitHubBranchLink {...defaultProps} branchName={longBranchName} />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('truncate');
  });
});
