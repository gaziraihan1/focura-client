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
  return { Github: icon('Github'), Tag: icon('Tag') };
});

import { GitHubLabels } from '@/components/dashboard/task-details/TaskSidebar/GitHubLabels';

describe('GitHubLabels', () => {
  it('renders labels', () => {
    render(<GitHubLabels labels={['bug', 'enhancement']} />);
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('enhancement')).toBeInTheDocument();
  });

  it('renders Labels label', () => {
    render(<GitHubLabels labels={['bug']} />);
    expect(screen.getByText('Labels')).toBeInTheDocument();
  });

  it('renders GitHub icon', () => {
    render(<GitHubLabels labels={['bug']} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders Tag icons for each label', () => {
    render(<GitHubLabels labels={['bug', 'feature']} />);
    const tagIcons = screen.getAllByTestId('icon-Tag');
    expect(tagIcons.length).toBe(2);
  });

  it('renders nothing when labels array is empty', () => {
    const { container } = render(<GitHubLabels labels={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when labels is null', () => {
    const { container } = render(<GitHubLabels labels={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies correct color class for bug label', () => {
    render(<GitHubLabels labels={['bug']} />);
    const badge = screen.getByText('bug').closest('span');
    expect(badge).toHaveClass('text-red-500');
  });

  it('applies correct color class for enhancement label', () => {
    render(<GitHubLabels labels={['enhancement']} />);
    const badge = screen.getByText('enhancement').closest('span');
    expect(badge).toHaveClass('text-purple-500');
  });
});
