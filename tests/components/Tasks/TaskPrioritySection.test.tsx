import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskPrioritySection } from '@/components/Dashboard/CalendarView/CalendarDayView/TaskPrioritySection'

vi.mock('lucide-react', () => ({
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Flag: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

vi.mock('@/components/Dashboard/CalendarView/DetailedTaskCard', () => ({
  default: ({ task, onClick }: Record<string, unknown>) => (
    <button onClick={onClick} data-testid="detailed-card">{task.title}</button>
  ),
}))

const mockTasks = [
  { id: '1', title: 'Overdue Task' },
  { id: '2', title: 'Another Overdue' },
] as any[]

describe('TaskPrioritySection', () => {
  const onTaskClick = vi.fn()

  it('returns null when no tasks', () => {
    const { container } = render(
      <TaskPrioritySection priority="overdue" tasks={[]} onTaskClick={onTaskClick} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders priority title and count', () => {
    render(
      <TaskPrioritySection priority="overdue" tasks={mockTasks} onTaskClick={onTaskClick} />
    )
    expect(screen.getByText('Overdue (2)')).toBeInTheDocument()
  })

  it('renders task cards', () => {
    render(
      <TaskPrioritySection priority="overdue" tasks={mockTasks} onTaskClick={onTaskClick} />
    )
    const cards = screen.getAllByTestId('detailed-card')
    expect(cards).toHaveLength(2)
  })

  it('renders different priority titles', () => {
    render(
      <TaskPrioritySection priority="urgent" tasks={mockTasks} onTaskClick={onTaskClick} />
    )
    expect(screen.getByText(/Urgent/)).toBeInTheDocument()
  })
})
