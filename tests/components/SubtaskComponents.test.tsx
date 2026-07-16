import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SubtaskEmptyState } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskEmptyState'
import { SubtaskProgress } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskProgress'
import { SubtaskForm } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskForm'

vi.mock('lucide-react', () => ({
  ListTodo: (props: any) => <svg data-testid="list-icon" {...props} />,
  Plus: (props: any) => <svg data-testid="plus-icon" {...props} />,
  Check: (props: any) => <svg data-testid="check-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('SubtaskEmptyState', () => {
  it('renders no subtasks message', () => {
    render(<SubtaskEmptyState canAdd={true} onAdd={vi.fn()} />)
    expect(screen.getByText('No subtasks yet')).toBeInTheDocument()
  })

  it('shows add prompt when canAdd is true', () => {
    render(<SubtaskEmptyState canAdd={true} onAdd={vi.fn()} />)
    expect(screen.getByText(/Break this task/)).toBeInTheDocument()
  })

  it('shows read-only message when canAdd is false', () => {
    render(<SubtaskEmptyState canAdd={false} onAdd={vi.fn()} />)
    expect(screen.getByText(/Subtasks will appear here/)).toBeInTheDocument()
  })

  it('shows add button when canAdd is true', () => {
    render(<SubtaskEmptyState canAdd={true} onAdd={vi.fn()} />)
    expect(screen.getByText('Add first subtask')).toBeInTheDocument()
  })

  it('hides add button when canAdd is false', () => {
    render(<SubtaskEmptyState canAdd={false} onAdd={vi.fn()} />)
    expect(screen.queryByText('Add first subtask')).not.toBeInTheDocument()
  })

  it('calls onAdd when add button is clicked', () => {
    const onAdd = vi.fn()
    render(<SubtaskEmptyState canAdd={true} onAdd={onAdd} />)
    fireEvent.click(screen.getByText('Add first subtask'))
    expect(onAdd).toHaveBeenCalledTimes(1)
  })
})

describe('SubtaskProgress', () => {
  it('renders nothing when total is 0', () => {
    const { container } = render(
      <SubtaskProgress stats={{ total: 0, completed: 0, inProgress: 0, completionRate: 0 }} />
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders completion stats', () => {
    render(
      <SubtaskProgress stats={{ total: 5, completed: 3, inProgress: 1, completionRate: 60 }} />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('of 5')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('renders Done, In progress, and To do labels', () => {
    render(
      <SubtaskProgress stats={{ total: 5, completed: 3, inProgress: 1, completionRate: 60 }} />
    )
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('To do')).toBeInTheDocument()
  })

  it('shows 100% in emerald when fully complete', () => {
    render(
      <SubtaskProgress stats={{ total: 4, completed: 4, inProgress: 0, completionRate: 100 }} />
    )
    const pct = screen.getByText('100%')
    expect(pct.className).toContain('text-emerald-500')
  })
})

describe('SubtaskForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isLoading: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title input', () => {
    render(<SubtaskForm {...defaultProps} />)
    expect(screen.getByPlaceholderText('Subtask title…')).toBeInTheDocument()
  })

  it('renders priority options', () => {
    render(<SubtaskForm {...defaultProps} />)
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('defaults to MEDIUM priority', () => {
    render(<SubtaskForm {...defaultProps} />)
    const mediumButton = screen.getByText('Medium')
    expect(mediumButton.className).toContain('ring-1')
  })

  it('renders cancel button', () => {
    render(<SubtaskForm {...defaultProps} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onCancel when cancel is clicked', () => {
    render(<SubtaskForm {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
  })

  it('renders add subtask button', () => {
    render(<SubtaskForm {...defaultProps} />)
    expect(screen.getByText('Add subtask')).toBeInTheDocument()
  })

  it('disables add button when title is empty', () => {
    render(<SubtaskForm {...defaultProps} />)
    const addButton = screen.getByText('Add subtask').closest('button')
    expect(addButton).toBeDisabled()
  })

  it('enables add button when title is entered', () => {
    render(<SubtaskForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('Subtask title…')
    fireEvent.change(input, { target: { value: 'New subtask' } })
    const addButton = screen.getByText('Add subtask').closest('button')
    expect(addButton).not.toBeDisabled()
  })

  it('calls onSubmit with title and priority', async () => {
    defaultProps.onSubmit.mockResolvedValue(undefined)
    render(<SubtaskForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('Subtask title…')
    fireEvent.change(input, { target: { value: 'New subtask' } })
    fireEvent.click(screen.getByText('Add subtask'))
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      title: 'New subtask',
      priority: 'MEDIUM',
    })
  })

  it('changes priority when clicked', () => {
    render(<SubtaskForm {...defaultProps} />)
    fireEvent.click(screen.getByText('High'))
    const highButton = screen.getByText('High')
    expect(highButton.className).toContain('ring-1')
  })

  it('disables form when loading', () => {
    render(<SubtaskForm {...defaultProps} isLoading={true} />)
    const input = screen.getByPlaceholderText('Subtask title…')
    expect(input).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(<SubtaskForm {...defaultProps} isLoading={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('does not submit when title is only spaces', () => {
    render(<SubtaskForm {...defaultProps} />)
    const input = screen.getByPlaceholderText('Subtask title…')
    fireEvent.change(input, { target: { value: '   ' } })
    const addButton = screen.getByText('Add subtask').closest('button')
    expect(addButton).toBeDisabled()
  })
})
