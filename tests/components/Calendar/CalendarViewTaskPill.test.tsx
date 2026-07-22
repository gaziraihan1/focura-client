import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskPill from '@/components/Dashboard/CalendarView/TaskPill'

vi.mock('lucide-react', () => ({
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

const mockTask = {
  id: 't1',
  title: 'Test Task',
  priority: 'HIGH',
  status: 'TODO',
  estimatedHours: 4,
  assignees: [],
  project: null,
} as any

describe('TaskPill', () => {
  const onClick = vi.fn()

  beforeEach(() => vi.clearAllMocks())

  it('renders task title', () => {
    render(<TaskPill task={mockTask} isPersonal={true} isOverdue={false} onClick={onClick} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<TaskPill task={mockTask} isPersonal={true} isOverdue={false} onClick={onClick} />)
    fireEvent.click(screen.getByText('Test Task'))
    expect(onClick).toHaveBeenCalled()
  })

  it('renders estimated hours', () => {
    render(<TaskPill task={mockTask} isPersonal={true} isOverdue={false} onClick={onClick} />)
    expect(screen.getByText('4h')).toBeInTheDocument()
  })

  it('renders users icon for team tasks', () => {
    const teamTask = { ...mockTask, assignees: [{ user: { id: '1', name: 'A' } }] }
    render(<TaskPill task={teamTask} isPersonal={false} isOverdue={false} onClick={onClick} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders project color bar when project exists', () => {
    const taskWithProject = { ...mockTask, project: { id: 'p1', name: 'P', color: '#3b82f6' } }
    const { container } = render(
      <TaskPill task={taskWithProject} isPersonal={true} isOverdue={false} onClick={onClick} />
    )
    const bar = container.querySelector('[style*="background-color"]')
    expect(bar).toBeInTheDocument()
  })
})
