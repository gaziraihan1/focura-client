import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    AlertTriangle: icon('alert-triangle'),
  };
});

import { StorageWarningBanner } from '@/components/Dashboard/Storage/StorageOverviewPage/StorageWarningBanner';
import { StorageWarning } from '@/types/storage-overview.types';

describe('StorageWarningBanner', () => {
  it('renders nothing when level is normal', () => {
    const warning: StorageWarning = { level: 'normal', message: 'All good' };
    const { container } = render(<StorageWarningBanner warning={warning} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when message is null', () => {
    const warning: StorageWarning = { level: 'warning', message: null };
    const { container } = render(<StorageWarningBanner warning={warning} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when level is normal even with a message', () => {
    const warning: StorageWarning = { level: 'normal', message: 'Something' };
    const { container } = render(<StorageWarningBanner warning={warning} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders warning banner for warning level', () => {
    const warning: StorageWarning = { level: 'warning', message: 'Storage getting full' };
    render(<StorageWarningBanner warning={warning} />);
    expect(screen.getByText('Storage getting full')).toBeInTheDocument();
  });

  it('renders warning banner for critical level', () => {
    const warning: StorageWarning = { level: 'critical', message: 'Storage almost full' };
    render(<StorageWarningBanner warning={warning} />);
    expect(screen.getByText('Storage almost full')).toBeInTheDocument();
  });

  it('renders the alert triangle icon', () => {
    const warning: StorageWarning = { level: 'warning', message: 'Warning' };
    render(<StorageWarningBanner warning={warning} />);
    expect(screen.getByTestId('alert-triangle')).toBeInTheDocument();
  });

  it('applies destructive classes for critical level', () => {
    const warning: StorageWarning = { level: 'critical', message: 'Critical' };
    render(<StorageWarningBanner warning={warning} />);
    const banner = screen.getByText('Critical').closest('div')!;
    expect(banner.className).toContain('bg-destructive/10');
    expect(banner.className).toContain('border-destructive/30');
    expect(banner.className).toContain('text-destructive');
  });

  it('applies amber classes for warning level', () => {
    const warning: StorageWarning = { level: 'warning', message: 'Warning' };
    render(<StorageWarningBanner warning={warning} />);
    const banner = screen.getByText('Warning').closest('div')!;
    expect(banner.className).toContain('bg-amber-500/10');
    expect(banner.className).toContain('border-amber-500/30');
  });

  it('renders for custom string levels that are not normal', () => {
    const warning: StorageWarning = { level: 'info', message: 'Info message' };
    render(<StorageWarningBanner warning={warning} />);
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });
});
