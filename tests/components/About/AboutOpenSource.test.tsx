import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutOpenSource } from '@/components/About/AboutOpenSource';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('AboutOpenSource', () => {
  it('renders the heading', () => {
    render(<AboutOpenSource />);
    expect(screen.getByText('Source-available.')).toBeInTheDocument();
  });

  it('renders contribution steps', () => {
    render(<AboutOpenSource />);
    expect(screen.getByText('Fork the repo')).toBeInTheDocument();
    expect(screen.getByText('Open a Pull Request')).toBeInTheDocument();
  });

  it('renders resource links', () => {
    render(<AboutOpenSource />);
    expect(screen.getByText('ARCHITECTURE.md')).toBeInTheDocument();
    expect(screen.getByText('CONTRIBUTING.md')).toBeInTheDocument();
  });
});
