import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Spy on the GoogleAnalytics module so we can assert the `enabled` gating.
const { GaMock } = vi.hoisted(() => ({ GaMock: vi.fn() }));

vi.mock('@/components/Analytics/GoogleAnalytics', () => ({
  GoogleAnalytics: (props: { enabled?: boolean }) => {
    GaMock(props);
    return <div data-testid="mock-ga" />;
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return { Cookie: icon('Cookie') };
});

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

import { ConsentProvider } from '@/components/Consent/ConsentProvider';
import { CONSENT_STORAGE_KEY } from '@/components/Consent/ConsentProvider';

describe('ConsentProvider + ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    GaMock.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('shows the banner on first visit when no choice is stored', () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    expect(screen.getByText('We respect your privacy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy').closest('a')).toHaveAttribute(
      'href',
      '/cookies'
    );
    // No choice = GA stays off.
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: false });
  });

  it('persists acceptance, hides the banner, and enables GA', () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));

    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('accepted');
    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: true });
  });

  it('persists decline, hides the banner, and keeps GA disabled', () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Decline' }));

    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('declined');
    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: false });
  });

  it('does not show the banner when consent was previously accepted', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');

    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: true });
  });

  it('does not show the banner when consent was previously declined', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');

    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: false });
  });

  it('renders children content', () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    expect(screen.getByText('page')).toBeInTheDocument();
  });
});
