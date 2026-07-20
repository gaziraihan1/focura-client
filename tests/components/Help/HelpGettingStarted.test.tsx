import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelpGettingStarted } from '@/components/Help/HelpGettingStarted';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('HelpGettingStarted', () => {
  it('renders the heading', () => {
    render(<HelpGettingStarted />);
    expect(screen.getByText('Set up Focura in 6 steps')).toBeInTheDocument();
  });

  it('renders all 6 steps', () => {
    render(<HelpGettingStarted />);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Start your first focus session')).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<HelpGettingStarted />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('06')).toBeInTheDocument();
  });
});
