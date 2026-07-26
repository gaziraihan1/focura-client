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
  return { Github: icon('Github'), Kanban: icon('Kanban') };
});

import { GitHubProjectLink } from '@/components/Dashboard/TaskDetails/TaskSidebar/GitHubProjectLink';

describe('GitHubProjectLink', () => {
  const defaultProps = {
    projectNumber: 1,
    projectUrl: 'https://github.com/owner/repo/projects/1',
    projectTitle: 'My Project',
  };

  beforeEach(() => { vi.clearAllMocks(); });

  it('renders project title', () => {
    render(<GitHubProjectLink {...defaultProps} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('renders project number', () => {
    render(<GitHubProjectLink {...defaultProps} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    render(<GitHubProjectLink {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/projects/1');
  });

  it('renders GitHub icon', () => {
    render(<GitHubProjectLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders Kanban icon', () => {
    render(<GitHubProjectLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Kanban')).toBeInTheDocument();
  });
});
