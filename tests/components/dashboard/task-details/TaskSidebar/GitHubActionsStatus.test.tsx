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
    Workflow: icon('Workflow'),
    CheckCircle2: icon('CheckCircle2'),
    XCircle: icon('XCircle'),
    Clock: icon('Clock'),
    Ban: icon('Ban'),
  };
});

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubActionsStatus } from '@/components/dashboard/task-details/TaskSidebar/GitHubActionsStatus';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubActionsStatus', () => {
  const defaultProps = {
    workflowStatus: 'success' as const,
    workflowName: 'CI Build',
    workflowUrl: 'https://github.com/owner/repo/actions/runs/123',
    workflowRunId: '123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders workflow name', () => {
    render(<GitHubActionsStatus {...defaultProps} />);
    expect(screen.getByText('CI Build')).toBeInTheDocument();
  });

  it('renders success status badge', () => {
    render(<GitHubActionsStatus {...defaultProps} />);
    expect(screen.getByText('Passed')).toBeInTheDocument();
  });

  it('renders failure status badge', () => {
    render(<GitHubActionsStatus {...defaultProps} workflowStatus="failure" />);
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('renders pending status badge', () => {
    render(<GitHubActionsStatus {...defaultProps} workflowStatus="pending" />);
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('renders cancelled status badge', () => {
    render(<GitHubActionsStatus {...defaultProps} workflowStatus="cancelled" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders workflow link with correct href', () => {
    render(<GitHubActionsStatus {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/actions/runs/123');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub icon', () => {
    render(<GitHubActionsStatus {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders Workflow icon', () => {
    render(<GitHubActionsStatus {...defaultProps} />);
    expect(screen.getByTestId('icon-Workflow')).toBeInTheDocument();
  });

  it('renders CI/CD label', () => {
    render(<GitHubActionsStatus {...defaultProps} />);
    expect(screen.getByText('CI/CD')).toBeInTheDocument();
  });

  it('renders success status with CheckCircle2 icon', () => {
    render(<GitHubActionsStatus {...defaultProps} />);
    expect(screen.getByTestId('icon-CheckCircle2')).toBeInTheDocument();
  });

  it('renders failure status with XCircle icon', () => {
    render(<GitHubActionsStatus {...defaultProps} workflowStatus="failure" />);
    expect(screen.getByTestId('icon-XCircle')).toBeInTheDocument();
  });

  it('renders pending status with Clock icon', () => {
    render(<GitHubActionsStatus {...defaultProps} workflowStatus="pending" />);
    expect(screen.getByTestId('icon-Clock')).toBeInTheDocument();
  });

  it('renders cancelled status with Ban icon', () => {
    render(<GitHubActionsStatus {...defaultProps} workflowStatus="cancelled" />);
    expect(screen.getByTestId('icon-Ban')).toBeInTheDocument();
  });
});
