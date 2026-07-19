import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FocusSessionCard } from '@/components/Dashboard/TaskDetails/FocusSessionCard';

vi.mock('@/hooks/useFocusSession', () => ({
  useFocusSession: vi.fn(() => ({
    activeSession: null,
    isLoading: false,
    startSession: vi.fn(),
    completeSession: vi.fn(),
    cancelSession: vi.fn(),
  })),
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />;
  return {
    Play: icon('play'),
    Clock: icon('clock'),
    Zap: icon('zap'),
    CheckCircle2: icon('check-circle'),
  };
});

describe('FocusSessionCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the Focus Session heading', () => {
    render(<FocusSessionCard taskId="t-1" />);
    expect(screen.getByText('Focus Session')).toBeInTheDocument();
  });

  it('renders Pomodoro and Deep Work buttons when no active session', () => {
    render(<FocusSessionCard taskId="t-1" />);
    expect(screen.getByText('Pomodoro')).toBeInTheDocument();
    expect(screen.getByText('Deep Work')).toBeInTheDocument();
  });

  it('renders subtitle text', () => {
    render(<FocusSessionCard taskId="t-1" />);
    expect(screen.getByText('Deep work mode for this task')).toBeInTheDocument();
  });
});
