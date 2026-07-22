import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutFounder } from '@/components/About/AboutFounder';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}));

describe('AboutFounder', () => {
  it('renders the founder name', () => {
    render(<AboutFounder />);
    expect(screen.getAllByText('Mohammad Raihan Gazi').length).toBeGreaterThan(0);
  });

  it('renders the heading', () => {
    render(<AboutFounder />);
    expect(screen.getByText('Built by one developer,')).toBeInTheDocument();
  });

  it('renders the stats', () => {
    render(<AboutFounder />);
    expect(screen.getByText('130+')).toBeInTheDocument();
    expect(screen.getByText('80+')).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    render(<AboutFounder />);
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
  });
});
