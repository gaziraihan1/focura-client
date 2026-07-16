import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskFormHeader } from '@/components/Tasks/form/TaskFormHeader'
import { FormActions } from '@/components/Tasks/form/FormActions'
import { TaskStatusPrioritySection } from '@/components/Tasks/form/TaskStatusPrioritySection'
import { TaskDetailsSection } from '@/components/Tasks/form/TaskDetailsSection'

vi.mock('lucide-react', () => ({
  ArrowLeft: (props: any) => <svg data-testid="arrow-left-icon" {...props} />,
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
  Save: (props: any) => <svg data-testid="save-icon" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
  CheckCircle2: (props: any) => <svg data-testid="check-icon" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('TaskFormHeader', () => {
  const defaultProps = { onCancel: vi.fn() }

  beforeEach(() => vi.clearAllMocks())

  it('renders heading', () => {
    render(<TaskFormHeader {...defaultProps} />)
    expect(screen.getByText('Create Personal Task')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<TaskFormHeader {...defaultProps} />)
    expect(screen.getByText(/Capture tasks with focus/)).toBeInTheDocument()
  })

  it('calls onCancel when back button is clicked', () => {
    render(<TaskFormHeader {...defaultProps} />)
    fireEvent.click(screen.getByTestId('arrow-left-icon').closest('button')!)
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when close button is clicked', () => {
    render(<TaskFormHeader {...defaultProps} />)
    fireEvent.click(screen.getByTestId('x-icon').closest('button')!)
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })
})

describe('FormActions', () => {
  const defaultProps = {
    isLoading: false,
    onCancel: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders Create Task button', () => {
    render(<FormActions {...defaultProps} />)
    expect(screen.getByText('Create Task')).toBeInTheDocument()
  })

  it('renders Cancel button', () => {
    render(<FormActions {...defaultProps} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onCancel when Cancel is clicked', () => {
    render(<FormActions {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('shows Creating text when loading', () => {
    render(<FormActions {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Creating')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(<FormActions {...defaultProps} isLoading={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('disables button when loading', () => {
    render(<FormActions {...defaultProps} isLoading={true} />)
    const createBtn = screen.getByText('Creating').closest('button')
    expect(createBtn).toBeDisabled()
  })
})

describe('TaskStatusPrioritySection', () => {
  const defaultProps = {
    status: 'TODO' as const,
    priority: 'MEDIUM' as const,
    onStatusChange: vi.fn(),
    onPriorityChange: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders Status label', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders Priority label', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('renders status select with current value', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('TODO')
  })

  it('renders all status options', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option'))
    const values = options.map((o) => o.getAttribute('value'))
    expect(values).toContain('TODO')
    expect(values).toContain('IN_PROGRESS')
    expect(values).toContain('COMPLETED')
  })

  it('calls onStatusChange when status is changed', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'IN_PROGRESS' } })
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('IN_PROGRESS')
  })

  it('renders all priority buttons', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    expect(screen.getByText('URGENT')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    expect(screen.getByText('LOW')).toBeInTheDocument()
  })

  it('calls onPriorityChange when priority button is clicked', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    fireEvent.click(screen.getByText('HIGH'))
    expect(defaultProps.onPriorityChange).toHaveBeenCalledWith('HIGH')
  })

  it('highlights selected priority', () => {
    render(<TaskStatusPrioritySection {...defaultProps} />)
    const mediumBtn = screen.getByText('MEDIUM')
    expect(mediumBtn.className).toContain('bg-primary/10')
  })
})

describe('TaskDetailsSection', () => {
  const defaultProps = {
    title: 'Test Task',
    description: 'Test description',
    errors: {},
    onTitleChange: vi.fn(),
    onDescriptionChange: vi.fn(),
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders Task Details heading', () => {
    render(<TaskDetailsSection {...defaultProps} />)
    expect(screen.getByText('Task Details')).toBeInTheDocument()
  })

  it('renders title input with value', () => {
    render(<TaskDetailsSection {...defaultProps} />)
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
  })

  it('renders description textarea with value', () => {
    render(<TaskDetailsSection {...defaultProps} />)
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
  })

  it('calls onTitleChange when title is changed', () => {
    render(<TaskDetailsSection {...defaultProps} />)
    fireEvent.change(screen.getByDisplayValue('Test Task'), { target: { value: 'New Title' } })
    expect(defaultProps.onTitleChange).toHaveBeenCalledWith('New Title')
  })

  it('calls onDescriptionChange when description is changed', () => {
    render(<TaskDetailsSection {...defaultProps} />)
    fireEvent.change(screen.getByDisplayValue('Test description'), { target: { value: 'New desc' } })
    expect(defaultProps.onDescriptionChange).toHaveBeenCalledWith('New desc')
  })

  it('renders title error when present', () => {
    render(<TaskDetailsSection {...defaultProps} errors={{ title: 'Title is required' }} />)
    expect(screen.getByText('Title is required')).toBeInTheDocument()
  })

  it('does not render error when no errors', () => {
    render(<TaskDetailsSection {...defaultProps} />)
    expect(screen.queryByText(/required/)).not.toBeInTheDocument()
  })

  it('renders required asterisk for title', () => {
    render(<TaskDetailsSection {...defaultProps} />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })
})
