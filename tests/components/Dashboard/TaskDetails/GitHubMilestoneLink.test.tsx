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
    Milestone: icon('Milestone'),
    CheckCircle2: icon('CheckCircle2'),
    Circle: icon('Circle'),
  };
});

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubMilestoneLink } from '@/components/Dashboard/TaskDetails/TaskSidebar/GitHubMilestoneLink';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubMilestoneLink', () => {
  const defaultProps = {
    milestoneTitle: 'v1.0 Release',
    milestoneUrl: 'https://github.com/owner/repo/milestone/1',
    milestoneState: 'open' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders milestone title', () => {
    render(<GitHubMilestoneLink {...defaultProps} />);
    expect(screen.getByText('v1.0 Release')).toBeInTheDocument();
  });

  it('renders open state badge', () => {
    render(<GitHubMilestoneLink {...defaultProps} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders closed state badge', () => {
    render(<GitHubMilestoneLink {...defaultProps} milestoneState="closed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders milestone link with correct href', () => {
    render(<GitHubMilestoneLink {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/milestone/1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub icon', () => {
    render(<GitHubMilestoneLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders Milestone icon', () => {
    render(<GitHubMilestoneLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Milestone')).toBeInTheDocument();
  });

  it('renders Milestone label', () => {
    render(<GitHubMilestoneLink {...defaultProps} />);
    expect(screen.getByText('Milestone')).toBeInTheDocument();
  });

  it('renders open state with Circle icon', () => {
    render(<GitHubMilestoneLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Circle')).toBeInTheDocument();
  });

  it('renders closed state with CheckCircle2 icon', () => {
    render(<GitHubMilestoneLink {...defaultProps} milestoneState="closed" />);
    expect(screen.getByTestId('icon-CheckCircle2')).toBeInTheDocument();
  });
});
