import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutStack } from '@/components/About/AboutStack';

describe('AboutStack', () => {
  it('renders the heading', () => {
    render(<AboutStack />);
    expect(screen.getByText('A stack built for')).toBeInTheDocument();
  });

  it('renders stack category groups', () => {
    render(<AboutStack />);
    expect(screen.getByText('Core Framework')).toBeInTheDocument();
    expect(screen.getByText('Styling & Motion')).toBeInTheDocument();
    expect(screen.getByText('Auth & Security')).toBeInTheDocument();
  });

  it('renders individual technology items', () => {
    render(<AboutStack />);
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
  });
});
