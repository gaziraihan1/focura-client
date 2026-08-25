import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TemplateTierBadge from '@/components/public/templates/TemplateTierBadge';
import {
  canAccessTemplate,
  tierRequirement,
  TIER_RANK,
} from '@/types/templates.types';

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`${name}-icon`} {...props} />
    Component.displayName = name
    return Component
  }
  return {
    Crown: icon('Crown'),
    Lock: icon('Lock'),
  }
});

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

describe('TemplateTierBadge', () => {
  it('renders the tier label', () => {
    render(<TemplateTierBadge tier="PRO" />);
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('renders a crown icon when unlocked', () => {
    render(<TemplateTierBadge tier="FREE" />);
    expect(screen.getByTestId('Crown-icon')).toBeInTheDocument();
  });

  it('renders a lock icon when locked', () => {
    render(<TemplateTierBadge tier="PRO" locked />);
    expect(screen.getByTestId('Lock-icon')).toBeInTheDocument();
  });
});

describe('canAccessTemplate', () => {
  it('allows FREE templates for every tier', () => {
    expect(canAccessTemplate('FREE', 'FREE')).toBe(true);
    expect(canAccessTemplate('PRO', 'FREE')).toBe(true);
    expect(canAccessTemplate('BUSINESS', 'FREE')).toBe(true);
  });

  it('locks PRO templates for FREE users', () => {
    expect(canAccessTemplate('FREE', 'PRO')).toBe(false);
    expect(canAccessTemplate('PRO', 'PRO')).toBe(true);
    expect(canAccessTemplate('BUSINESS', 'PRO')).toBe(true);
  });

  it('locks BUSINESS templates below the Business tier', () => {
    expect(canAccessTemplate('FREE', 'BUSINESS')).toBe(false);
    expect(canAccessTemplate('PRO', 'BUSINESS')).toBe(false);
    expect(canAccessTemplate('BUSINESS', 'BUSINESS')).toBe(true);
  });
});

describe('tierRequirement', () => {
  it('describes each tier requirement', () => {
    expect(tierRequirement('FREE')).toBe('Included free');
    expect(tierRequirement('PRO')).toBe('Requires Pro');
    expect(tierRequirement('BUSINESS')).toBe('Requires Business');
  });
});

describe('TIER_RANK', () => {
  it('orders FREE < PRO < BUSINESS', () => {
    expect(TIER_RANK.FREE).toBeLessThan(TIER_RANK.PRO);
    expect(TIER_RANK.PRO).toBeLessThan(TIER_RANK.BUSINESS);
  });
});
