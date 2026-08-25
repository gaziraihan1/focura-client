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
    GitCommit: icon('GitCommit'),
    User: icon('User'),
  };
});

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubCommitLink } from '@/components/dashboard/task-details/TaskSidebar/GitHubCommitLink';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubCommitLink', () => {
  const defaultProps = {
    commitSha: 'abc1234567890def',
    commitUrl: 'https://github.com/owner/repo/commit/abc1234567890def',
    commitMessage: 'feat: add new feature',
    commitAuthor: 'John Doe',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders short commit SHA', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    expect(screen.getByText('abc1234')).toBeInTheDocument();
  });

  it('renders commit link with correct href', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/commit/abc1234567890def');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders commit message', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    expect(screen.getByText('feat: add new feature')).toBeInTheDocument();
  });

  it('renders commit author', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders GitHub icon', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders GitCommit icon', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    expect(screen.getByTestId('icon-GitCommit')).toBeInTheDocument();
  });

  it('renders Latest Commit label', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    expect(screen.getByText('Latest Commit')).toBeInTheDocument();
  });

  it('renders without commit message', () => {
    render(<GitHubCommitLink commitSha="abc123" commitUrl="https://example.com" />);
    expect(screen.getByText('abc123')).toBeInTheDocument();
    expect(screen.queryByText('feat: add new feature')).not.toBeInTheDocument();
  });

  it('renders without commit author', () => {
    render(<GitHubCommitLink commitSha="abc123" commitUrl="https://example.com" />);
    expect(screen.getByText('abc123')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders commit SHA in monospace font', () => {
    render(<GitHubCommitLink {...defaultProps} />);
    const shaElement = screen.getByText('abc1234');
    expect(shaElement).toHaveClass('font-mono');
  });
});
