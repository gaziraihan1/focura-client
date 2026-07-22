import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TasksPageHeader } from '@/components/Dashboard/AllTasks/TasksPageHeader'

describe('TasksPageHeader', () => {
  const onCreateTask = vi.fn()

  beforeEach(() => vi.clearAllMocks())

  it('renders the title', () => {
    render(<TasksPageHeader onCreateTask={onCreateTask} />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<TasksPageHeader onCreateTask={onCreateTask} />)
    expect(screen.getByText(/Manage your tasks/)).toBeInTheDocument()
  })

  it('renders add task button', () => {
    render(<TasksPageHeader onCreateTask={onCreateTask} />)
    expect(screen.getByText('Add Task')).toBeInTheDocument()
  })

  it('calls onCreateTask when add task is clicked', () => {
    render(<TasksPageHeader onCreateTask={onCreateTask} />)
    fireEvent.click(screen.getByText('Add Task'))
    expect(onCreateTask).toHaveBeenCalled()
  })
})
