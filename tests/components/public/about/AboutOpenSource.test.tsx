import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutOpenSource } from '@/components/public/about/AboutOpenSource';

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
    expect(screen.getByText('Branch from dev')).toBeInTheDocument();
    expect(screen.getByText('Set up locally')).toBeInTheDocument();
    expect(screen.getByText('Test & lint')).toBeInTheDocument();
    expect(screen.getByText('Open a Pull Request')).toBeInTheDocument();
  });

  it('renders resource links', () => {
    render(<AboutOpenSource />);
    expect(screen.getByText('ARCHITECTURE.md')).toBeInTheDocument();
    expect(screen.getByText('CONTRIBUTING.md')).toBeInTheDocument();
    expect(screen.getByText('Backend Repository')).toBeInTheDocument();
    expect(screen.getByText('Backend CONTRIBUTING.md')).toBeInTheDocument();
    expect(screen.getByText('CODE_OF_CONDUCT.md')).toBeInTheDocument();
  });

  it('links the backend contribution guide', () => {
    render(<AboutOpenSource />);
    const link = screen.getByText('Backend CONTRIBUTING.md').closest('a');
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/gaziraihan1/gablura-backend/blob/main/CONTRIBUTING.md'
    );
  });
});
