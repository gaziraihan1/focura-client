import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelpContactCard } from '@/components/Help/HelpContactCard';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('HelpContactCard', () => {
  it('renders the contact heading', () => {
    render(<HelpContactCard />);
    expect(screen.getByText('Get in touch with us.')).toBeInTheDocument();
  });

  it('renders contact channel cards', () => {
    render(<HelpContactCard />);
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByText('Email Us Directly')).toBeInTheDocument();
    expect(screen.getByText('GitHub Issues')).toBeInTheDocument();
  });

  it('renders documentation links', () => {
    render(<HelpContactCard />);
    expect(screen.getByText('Architecture Documentation')).toBeInTheDocument();
    expect(screen.getByText('Contributing Guidelines')).toBeInTheDocument();
  });

  it('renders policy links', () => {
    render(<HelpContactCard />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
  });
});
