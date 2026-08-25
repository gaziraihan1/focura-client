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
    CircleDot: icon('CircleDot'),
    CheckCircle2: icon('CheckCircle2'),
    XCircle: icon('XCircle'),
  };
});

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubIssueLink } from '@/components/dashboard/task-details/TaskSidebar/GitHubIssueLink';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubIssueLink', () => {
  const defaultProps = {
    issueUrl: 'https://github.com/owner/repo/issues/456',
    issueNumber: 456,
    issueState: 'open' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders issue number', () => {
    render(<GitHubIssueLink {...defaultProps} />);
    expect(screen.getByText('#456')).toBeInTheDocument();
  });

  it('renders open state badge', () => {
    render(<GitHubIssueLink {...defaultProps} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders closed state badge', () => {
    render(<GitHubIssueLink {...defaultProps} issueState="closed" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders issue link with correct href', () => {
    render(<GitHubIssueLink {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/issues/456');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub icon', () => {
    render(<GitHubIssueLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders CircleDot icon for issue', () => {
    render(<GitHubIssueLink {...defaultProps} />);
    const circleDotIcons = screen.getAllByTestId('icon-CircleDot');
    expect(circleDotIcons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Issue label', () => {
    render(<GitHubIssueLink {...defaultProps} />);
    expect(screen.getByText('Issue')).toBeInTheDocument();
  });

  it('renders closed state with CheckCircle2 icon', () => {
    render(<GitHubIssueLink {...defaultProps} issueState="closed" />);
    expect(screen.getByTestId('icon-CheckCircle2')).toBeInTheDocument();
  });

  it('renders open state with CircleDot icon', () => {
    render(<GitHubIssueLink {...defaultProps} issueState="open" />);
    const circleDotIcons = screen.getAllByTestId('icon-CircleDot');
    expect(circleDotIcons.length).toBeGreaterThanOrEqual(1);
  });
});
