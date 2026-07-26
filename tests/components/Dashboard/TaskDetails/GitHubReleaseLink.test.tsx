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
    Tag: icon('Tag'),
    Package: icon('Package'),
  };
});

// ─── Import component after mocks ────────────────────────────────────────────

import { GitHubReleaseLink } from '@/components/Dashboard/TaskDetails/TaskSidebar/GitHubReleaseLink';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('GitHubReleaseLink', () => {
  const defaultProps = {
    releaseName: 'v1.0.0',
    releaseUrl: 'https://github.com/owner/repo/releases/tag/v1.0.0',
    releaseTagName: 'v1.0.0',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders release name', () => {
    render(<GitHubReleaseLink {...defaultProps} />);
    const elements = screen.getAllByText('v1.0.0');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders release link with correct href', () => {
    render(<GitHubReleaseLink {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo/releases/tag/v1.0.0');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders release tag name', () => {
    render(<GitHubReleaseLink {...defaultProps} />);
    const tagElements = screen.getAllByText('v1.0.0');
    expect(tagElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders GitHub icon', () => {
    render(<GitHubReleaseLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Github')).toBeInTheDocument();
  });

  it('renders Package icon', () => {
    render(<GitHubReleaseLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Package')).toBeInTheDocument();
  });

  it('renders Release label', () => {
    render(<GitHubReleaseLink {...defaultProps} />);
    expect(screen.getByText('Release')).toBeInTheDocument();
  });

  it('renders Tag icon when tag name is provided', () => {
    render(<GitHubReleaseLink {...defaultProps} />);
    expect(screen.getByTestId('icon-Tag')).toBeInTheDocument();
  });

  it('renders without tag name', () => {
    render(<GitHubReleaseLink releaseName="v1.0.0" releaseUrl="https://example.com" />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-Tag')).not.toBeInTheDocument();
  });

  it('renders different release names', () => {
    render(<GitHubReleaseLink {...defaultProps} releaseName="Production Release" />);
    expect(screen.getByText('Production Release')).toBeInTheDocument();
  });
});
