import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutFeatures } from '@/components/About/AboutFeatures';

describe('AboutFeatures', () => {
  it('renders the heading', () => {
    render(<AboutFeatures />);
    expect(screen.getByText('Everything a team needs.')).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<AboutFeatures />);
    expect(screen.getByText('Task & Project Management')).toBeInTheDocument();
    expect(screen.getByText('Focus Sessions')).toBeInTheDocument();
    expect(screen.getByText('Role-Based Access Control')).toBeInTheDocument();
  });

  it('renders feature highlight tags', () => {
    render(<AboutFeatures />);
    expect(screen.getByText('Subtask hierarchy')).toBeInTheDocument();
    expect(screen.getByText('Pomodoro mode')).toBeInTheDocument();
  });
});
