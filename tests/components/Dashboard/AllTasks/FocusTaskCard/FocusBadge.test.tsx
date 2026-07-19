import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('lucide-react', () => ({
  Zap: (props: any) => <svg data-testid="zap-icon" {...props} />,
}));

vi.mock('@/utils/taskcard.utils', () => ({
  formatTime: (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`,
}));

import { FocusBadge } from '@/components/Dashboard/AllTasks/FocusTaskCard/FocusBadge';

describe('FocusBadge', () => {
  it('renders FOCUS text', () => {
    render(<FocusBadge timeRemaining={300} />);
    expect(screen.getByText('FOCUS')).toBeInTheDocument();
  });

  it('formats and displays time remaining', () => {
    render(<FocusBadge timeRemaining={125} />);
    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('renders the Zap icon', () => {
    render(<FocusBadge timeRemaining={60} />);
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
  });
});
