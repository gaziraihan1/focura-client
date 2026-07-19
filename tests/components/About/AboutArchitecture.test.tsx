import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutArchitecture } from '@/components/About/AboutArchitecture';

describe('AboutArchitecture', () => {
  it('renders the heading', () => {
    render(<AboutArchitecture />);
    expect(screen.getByText('Architecture built to scale.')).toBeInTheDocument();
  });

  it('renders the three architecture layers', () => {
    render(<AboutArchitecture />);
    expect(screen.getByText('Frontend Layer')).toBeInTheDocument();
    expect(screen.getByText('Backend API Layer')).toBeInTheDocument();
    expect(screen.getByText('Data Layer')).toBeInTheDocument();
  });

  it('renders the data flow steps', () => {
    render(<AboutArchitecture />);
    expect(screen.getByText(/User triggers action/)).toBeInTheDocument();
    expect(screen.getByText(/TanStack Query cache updated/)).toBeInTheDocument();
  });

  it('renders the SSE callout', () => {
    render(<AboutArchitecture />);
    expect(screen.getByText('Real-Time via SSE')).toBeInTheDocument();
  });
});
