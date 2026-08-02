import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FocusSessionCard } from '@/components/Dashboard/TaskDetails/FocusSessionCard';

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockUseFocusSession = vi.fn(() => ({
  activeSession: null,
  isLoading: false,
  startSession: vi.fn(),
  completeSession: vi.fn(),
  cancelSession: vi.fn(),
}));

vi.mock('@/hooks/useFocusSession', () => ({
  useFocusSession: (...args: any[]) => mockUseFocusSession(...args),
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid={`${name}-icon`} {...props} />
  );
  return {
    Play: icon('play'),
    Clock: icon('clock'),
    Zap: icon('zap'),
    CheckCircle2: icon('check-circle'),
  };
});

// Started exactly 5 minutes before the fixed "now" (12:00 → 11:55)
const activeSessionForTask = {
  id: 's-1',
  userId: 'user-1',
  taskId: 't-1',
  type: 'POMODORO',
  duration: 25,
  startedAt: new Date('2024-06-15T11:55:00Z'),
  endedAt: null,
  completed: false,
};

describe('FocusSessionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
    mockUseFocusSession.mockReturnValue({
      activeSession: null,
      isLoading: false,
      startSession: vi.fn(),
      completeSession: vi.fn(),
      cancelSession: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the Focus Session heading', () => {
    render(<FocusSessionCard taskId="t-1" />);
    expect(screen.getByText('Focus Session')).toBeInTheDocument();
  });

  it('renders subtitle text', () => {
    render(<FocusSessionCard taskId="t-1" />);
    expect(screen.getByText('Deep work mode for this task')).toBeInTheDocument();
  });

  it('renders Pomodoro and Deep Work buttons when no active session', () => {
    render(<FocusSessionCard taskId="t-1" />);
    expect(screen.getByText('Pomodoro')).toBeInTheDocument();
    expect(screen.getByText('Deep Work')).toBeInTheDocument();
  });

  describe('starting a session', () => {
    it('starts a Pomodoro session with the task id', () => {
      const startSession = vi.fn();
      mockUseFocusSession.mockReturnValue({
        activeSession: null,
        isLoading: false,
        startSession,
        completeSession: vi.fn(),
        cancelSession: vi.fn(),
      });

      render(<FocusSessionCard taskId="t-1" />);
      fireEvent.click(screen.getByText('Pomodoro'));
      expect(startSession).toHaveBeenCalledWith({
        taskId: 't-1',
        duration: 25,
        type: 'POMODORO',
      });
    });

    it('starts a Deep Work session with the task id', () => {
      const startSession = vi.fn();
      mockUseFocusSession.mockReturnValue({
        activeSession: null,
        isLoading: false,
        startSession,
        completeSession: vi.fn(),
        cancelSession: vi.fn(),
      });

      render(<FocusSessionCard taskId="t-1" />);
      fireEvent.click(screen.getByText('Deep Work'));
      expect(startSession).toHaveBeenCalledWith({
        taskId: 't-1',
        duration: 60,
        type: 'DEEP_WORK',
      });
    });

    it('disables start buttons while a session is loading', () => {
      mockUseFocusSession.mockReturnValue({
        activeSession: null,
        isLoading: true,
        startSession: vi.fn(),
        completeSession: vi.fn(),
        cancelSession: vi.fn(),
      });

      render(<FocusSessionCard taskId="t-1" />);
      expect(screen.getByText('Pomodoro').closest('button')).toBeDisabled();
      expect(screen.getByText('Deep Work').closest('button')).toBeDisabled();
    });

    it('warns and disables start when a session is active on another task', () => {
      mockUseFocusSession.mockReturnValue({
        activeSession: { ...activeSessionForTask, taskId: 't-2' },
        isLoading: false,
        startSession: vi.fn(),
        completeSession: vi.fn(),
        cancelSession: vi.fn(),
      });

      render(<FocusSessionCard taskId="t-1" />);
      expect(screen.getByText(/active session on another task/i)).toBeInTheDocument();
      expect(screen.getByText('Pomodoro').closest('button')).toBeDisabled();
    });
  });

  describe('active session', () => {
    beforeEach(() => {
      mockUseFocusSession.mockReturnValue({
        activeSession: activeSessionForTask,
        isLoading: false,
        startSession: vi.fn(),
        completeSession: vi.fn(),
        cancelSession: vi.fn(),
      });
    });

    it('shows the countdown timer (25 min session, 5 min elapsed → 20:00)', () => {
      render(<FocusSessionCard taskId="t-1" />);
      expect(screen.getByText('20:00')).toBeInTheDocument();
      expect(screen.getByText('Pomodoro in progress')).toBeInTheDocument();
    });

    it('renders the progress bar at the correct width', () => {
      render(<FocusSessionCard taskId="t-1" />);
      const bar = screen.getByTestId('focus-progress-bar');
      expect(bar.getAttribute('style')).toContain('width: 20%');
    });

    it('shows the tip with the session duration', () => {
      render(<FocusSessionCard taskId="t-1" />);
      expect(screen.getByText(/add 25 minutes to your calendar/)).toBeInTheDocument();
    });

    it('calls completeSession when Complete Session is clicked', () => {
      const completeSession = vi.fn();
      mockUseFocusSession.mockReturnValue({
        activeSession: activeSessionForTask,
        isLoading: false,
        startSession: vi.fn(),
        completeSession,
        cancelSession: vi.fn(),
      });

      render(<FocusSessionCard taskId="t-1" />);
      fireEvent.click(screen.getByText('Complete Session'));
      expect(completeSession).toHaveBeenCalled();
    });

    it('calls cancelSession when Cancel is clicked', () => {
      const cancelSession = vi.fn();
      mockUseFocusSession.mockReturnValue({
        activeSession: activeSessionForTask,
        isLoading: false,
        startSession: vi.fn(),
        completeSession: vi.fn(),
        cancelSession,
      });

      render(<FocusSessionCard taskId="t-1" />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(cancelSession).toHaveBeenCalled();
    });

    it('auto-completes the session when the timer reaches zero', () => {
      const completeSession = vi.fn();
      mockUseFocusSession.mockReturnValue({
        activeSession: {
          ...activeSessionForTask,
          // Started 25 minutes ago → remaining is exactly 0 on mount
          startedAt: new Date('2024-06-15T11:35:00Z'),
        },
        isLoading: false,
        startSession: vi.fn(),
        completeSession,
        cancelSession: vi.fn(),
      });

      render(<FocusSessionCard taskId="t-1" />);
      expect(completeSession).toHaveBeenCalled();
    });

    it('shows 0:00 when the session has fully elapsed', () => {
      mockUseFocusSession.mockReturnValue({
        activeSession: {
          ...activeSessionForTask,
          startedAt: new Date('2024-06-15T11:35:00Z'),
        },
        isLoading: false,
        startSession: vi.fn(),
        completeSession: vi.fn(),
        cancelSession: vi.fn(),
      });

      render(<FocusSessionCard taskId="t-1" />);
      expect(screen.getByText('0:00')).toBeInTheDocument();
    });
  });
});
