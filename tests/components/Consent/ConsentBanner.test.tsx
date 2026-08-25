import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Spy on the GoogleAnalytics module so we can assert the `enabled` gating.
const { GaMock } = vi.hoisted(() => ({ GaMock: vi.fn() }));

vi.mock('@/components/analytics/GoogleAnalytics', () => ({
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

import { ConsentProvider } from '@/components/consent/ConsentProvider';
import { CONSENT_STORAGE_KEY } from '@/components/consent/ConsentProvider';

describe('ConsentProvider + ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    GaMock.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('shows the banner on first visit when no choice is stored', async () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    // Wait for component to mount before checking for banner
    await new Promise(resolve => setTimeout(resolve, 0));

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

  it('persists acceptance, hides the banner, and enables GA', async () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 0));

    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));

    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('accepted');
    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: true });
  });

  it('persists decline, hides the banner, and keeps GA disabled', async () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 0));

    fireEvent.click(screen.getByRole('button', { name: 'Decline' }));

    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('declined');
    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: false });
  });

  it('does not show the banner when consent was previously accepted', async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');

    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: true });
  });

  it('does not show the banner when consent was previously declined', async () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');

    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(screen.queryByText('We respect your privacy')).not.toBeInTheDocument();
    expect(GaMock).toHaveBeenLastCalledWith({ enabled: false });
  });

  it('renders children content', async () => {
    render(
      <ConsentProvider>
        <div>page</div>
      </ConsentProvider>
    );

    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(screen.getByText('page')).toBeInTheDocument();
  });
});
