import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskSection from '@/components/Dashboard/CalendarView/TaskSection'

vi.mock('lucide-react', () => ({
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

const mockTasks = [
  { id: '1', title: 'Task 1', priority: 'HIGH', assignees: [], project: null },
  { id: '2', title: 'Task 2', priority: 'LOW', assignees: [{ user: { id: 'u1' } }], project: { color: '#3b82f6' } },
] as any[]

describe('TaskSection', () => {
  const onTaskClick = vi.fn()

  beforeEach(() => vi.clearAllMocks())

  it('renders title and count', () => {
    render(
      <TaskSection
        title="Overdue"
        icon={<span>!</span>}
        count={2}
        tasks={mockTasks}
        onTaskClick={onTaskClick}
        variant="destructive"
      />
    )
    expect(screen.getByText(/Overdue/)).toBeInTheDocument()
    expect(screen.getByText('(2)')).toBeInTheDocument()
  })

  it('renders task items', () => {
    render(
      <TaskSection
        title="Tasks"
        icon={<span>T</span>}
        count={2}
        tasks={mockTasks}
        onTaskClick={onTaskClick}
        variant="default"
      />
    )
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('calls onTaskClick when task is clicked', () => {
    render(
      <TaskSection
        title="Tasks"
        icon={<span>T</span>}
        count={1}
        tasks={mockTasks}
        onTaskClick={onTaskClick}
        variant="default"
      />
    )
    fireEvent.click(screen.getByText('Task 1'))
    expect(onTaskClick).toHaveBeenCalledWith(mockTasks[0])
  })

  it('shows "+N more" when more than 5 tasks', () => {
    const manyTasks = Array.from({ length: 8 }, (_, i) => ({
      id: String(i),
      title: `Task ${i}`,
      priority: 'MEDIUM',
      assignees: [],
      project: null,
    })) as any[]
    render(
      <TaskSection
        title="Tasks"
        icon={<span>T</span>}
        count={8}
        tasks={manyTasks}
        onTaskClick={onTaskClick}
        variant="default"
      />
    )
    expect(screen.getByText('+3 more')).toBeInTheDocument()
  })
})
