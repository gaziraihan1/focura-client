import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/script', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, id, children, strategy, ...rest } = props;
    return (
      <script
        defer
        data-testid={src ? 'gtag-loader' : 'gtag-inline'}
        data-strategy={String(strategy)}
        src={src as string | undefined}
        id={id as string | undefined}
        {...rest}
        dangerouslySetInnerHTML={
          typeof children === 'string' ? { __html: children } : undefined
        }
      />
    );
  },
}));

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

describe('GoogleAnalytics', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  });

  it('renders nothing by default (no consent)', () => {
    const { container } = render(<GoogleAnalytics />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when explicitly disabled', () => {
    const { container } = render(<GoogleAnalytics enabled={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders gtag loader and config scripts when enabled', () => {
    render(<GoogleAnalytics enabled={true} />);

    const loader = screen.getByTestId('gtag-loader');
    expect(loader).toHaveAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123'
    );
    expect(loader).toHaveAttribute('data-strategy', 'afterInteractive');

    const inline = screen.getByTestId('gtag-inline');
    expect(inline).toHaveAttribute('id', 'google-analytics');
    expect(inline).toHaveAttribute('data-strategy', 'afterInteractive');
    expect(inline.textContent).toContain("gtag('config', 'G-TEST123'");
  });

  it('renders nothing when no measurement ID is configured', () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    const { container } = render(<GoogleAnalytics enabled={true} />);
    expect(container).toBeEmptyDOMElement();
  });
});
