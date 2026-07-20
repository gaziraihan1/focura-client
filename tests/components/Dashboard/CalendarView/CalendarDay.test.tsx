import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalendarDay } from '@/components/Dashboard/CalendarView/CalendarDay';

vi.mock('@/components/Dashboard/CalendarView/TaskPill', () => ({
  default: ({ task, onClick }: Record<string, unknown>) => (
    <div data-testid="task-pill" onClick={() => onClick(task)}>
      {task.title}
    </div>
  ),
}));

const mockTasks = [
  {
    id: '1',
    title: 'Task One',
    status: 'TODO',
    priority: 'MEDIUM',
    assignees: [],
    dueDate: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Task Two',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignees: [{ id: 'u1' }],
    dueDate: null,
  },
] as any;

describe('CalendarDay', () => {
  it('renders the day number', () => {
    render(
      <CalendarDay
        date={new Date(2026, 6, 15)}
        tasks={[]}
        density={0}
        isCurrentMonth={true}
        isToday={false}
        isPast={false}
        onTaskClick={vi.fn()}
      />,
    );
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders task pills when tasks are provided', () => {
    render(
      <CalendarDay
        date={new Date(2026, 6, 15)}
        tasks={mockTasks}
        density={2}
        isCurrentMonth={true}
        isToday={false}
        isPast={false}
        onTaskClick={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId('task-pill')).toHaveLength(2);
  });

  it('shows task count when density > 0', () => {
    render(
      <CalendarDay
        date={new Date(2026, 6, 15)}
        tasks={mockTasks}
        density={2}
        isCurrentMonth={true}
        isToday={false}
        isPast={false}
        onTaskClick={vi.fn()}
      />,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows Free time when no tasks in current month', () => {
    render(
      <CalendarDay
        date={new Date(2026, 6, 15)}
        tasks={[]}
        density={0}
        isCurrentMonth={true}
        isToday={false}
        isPast={false}
        onTaskClick={vi.fn()}
      />,
    );
    expect(screen.getByText('Free time')).toBeInTheDocument();
  });
});
