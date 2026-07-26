import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`icon-${name}`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return { Github: icon('Github'), MessageCircle: icon('MessageCircle') };
});

import { GitHubDiscussionLink } from '@/components/Dashboard/TaskDetails/TaskSidebar/GitHubDiscussionLink';

describe('GitHubDiscussionLink', () => {
  const defaultProps = {
    discussionNumber: 42,
    discussionUrl: 'https://github.com/owner/repo/discussions/42',
    discussionCategory: 'General',
  };

  beforeEach(() => { vi.clearAllMocks(); });

  it('renders discussion number', () => {
    render(<GitHubDiscussionLink {...defaultProps} />);
    expect(screen.getByText('#42')).toBeInTheDocument();
  });

  it('renders discussion category', () => {
    render(<GitHubDiscussionLink {...defaultProps} />);
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    render(<GitHubDiscussionLink {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/discussions/42');
  });

  it('renders without category', () => {
    render(<GitHubDiscussionLink discussionNumber={42} discussionUrl="https://example.com" />);
    expect(screen.getByText('#42')).toBeInTheDocument();
  });

  it('renders GitHub icon', () => {
    render(<GitHubDiscussionLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders MessageCircle icon', () => {
    render(<GitHubDiscussionLink {...defaultProps} />);
    expect(screen.getByTestId('icon-MessageCircle')).toBeInTheDocument();
  });
});
