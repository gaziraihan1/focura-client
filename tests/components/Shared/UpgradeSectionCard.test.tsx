import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceSlug: 'my-workspace' }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    Lock: icon('Lock'),
    Sparkles: icon('Sparkles'),
  };
});

import { UpgradeSectionCard } from '@/components/Shared/UpgradeSectionCard';

describe('UpgradeSectionCard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the title', () => {
    render(
      <UpgradeSectionCard
        title="Member Leaderboard"
        description="See how your team ranks."
      />
    );
    expect(screen.getByText('Member Leaderboard')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <UpgradeSectionCard
        title="Member Leaderboard"
        description="See how your team ranks."
      />
    );
    expect(screen.getByText('See how your team ranks.')).toBeInTheDocument();
  });

  it('renders the default CTA label', () => {
    render(
      <UpgradeSectionCard
        title="Member Leaderboard"
        description="See how your team ranks."
      />
    );
    expect(screen.getByText('Upgrade to Business')).toBeInTheDocument();
  });

  it('renders a custom CTA label', () => {
    render(
      <UpgradeSectionCard
        title="Storage & Resources"
        description="Detailed storage insights."
        ctaLabel="Upgrade to Business"
      />
    );
    expect(screen.getByText('Upgrade to Business')).toBeInTheDocument();
  });

  it('navigates to billing upgrade page on click', () => {
    render(
      <UpgradeSectionCard
        title="Member Leaderboard"
        description="See how your team ranks."
      />
    );
    fireEvent.click(screen.getByText('Upgrade to Business'));
    expect(mockPush).toHaveBeenCalledWith(
      '/dashboard/workspaces/my-workspace/billing/upgrade'
    );
  });

  it('renders the Lock icon by default', () => {
    render(
      <UpgradeSectionCard
        title="Member Leaderboard"
        description="See how your team ranks."
      />
    );
    expect(screen.getByTestId('Lock-icon')).toBeInTheDocument();
  });

  it('renders a custom icon when provided', () => {
    render(
      <UpgradeSectionCard
        title="Member Leaderboard"
        description="See how your team ranks."
        icon={<span data-testid="custom-icon">🔒</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('has the correct aria-label on the section', () => {
    render(
      <UpgradeSectionCard
        title="Member Leaderboard"
        description="See how your team ranks."
      />
    );
    expect(
      screen.getByLabelText('Member Leaderboard — upgrade to Business')
    ).toBeInTheDocument();
  });
});