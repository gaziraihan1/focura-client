import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatPill } from '@/components/Dashboard/AllTasks/TaskQouta/StartPill';

describe('StatPill', () => {
  it('renders label and value', () => {
    render(<StatPill label="Tasks" value={5} />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders sub text when provided', () => {
    render(<StatPill label="Hours" value="8.5h" sub="remaining" />);
    expect(screen.getByText('remaining')).toBeInTheDocument();
  });

  it('does not render sub text when omitted', () => {
    const { container } = render(<StatPill label="Score" value={42} />);
    expect(container.textContent).not.toContain('remaining');
  });
});
