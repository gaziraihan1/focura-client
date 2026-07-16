import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskDetailsForm } from '@/components/Dashboard/TaskDetails/TaskDetailsForm'

vi.mock('lucide-react', () => ({
  Loader2: (props: any) => <svg data-testid="loader-icon" {...props} />,
}))

describe('TaskDetailsForm', () => {
  const defaultProps = {
    editData: {
      title: 'Test Task',
      description: 'Test description',
      priority: 'HIGH',
      status: 'TODO',
      estimatedHours: '8',
    },
    isUpdating: false,
    onEditDataChange: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title input with current value', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    const input = screen.getByDisplayValue('Test Task')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders description textarea with current value', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    const textarea = screen.getByDisplayValue('Test description')
    expect(textarea).toBeInTheDocument()
  })

  it('renders estimated hours input', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    const input = screen.getByDisplayValue('8')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
  })

  it('calls onEditDataChange when title is changed', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    const input = screen.getByDisplayValue('Test Task')
    fireEvent.change(input, { target: { value: 'New Title' } })
    expect(defaultProps.onEditDataChange).toHaveBeenCalledWith({
      ...defaultProps.editData,
      title: 'New Title',
    })
  })

  it('calls onEditDataChange when description is changed', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    const textarea = screen.getByDisplayValue('Test description')
    fireEvent.change(textarea, { target: { value: 'New description' } })
    expect(defaultProps.onEditDataChange).toHaveBeenCalledWith({
      ...defaultProps.editData,
      description: 'New description',
    })
  })

  it('calls onEditDataChange when estimated hours is changed', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    const input = screen.getByDisplayValue('8')
    fireEvent.change(input, { target: { value: '12' } })
    expect(defaultProps.onEditDataChange).toHaveBeenCalledWith({
      ...defaultProps.editData,
      estimatedHours: '12',
    })
  })

  it('renders save button', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('calls onSave when save button is clicked', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    fireEvent.click(screen.getByText('Save Changes'))
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1)
  })

  it('renders cancel button', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<TaskDetailsForm {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
  })

  it('disables save button when updating', () => {
    render(<TaskDetailsForm {...defaultProps} isUpdating={true} />)
    const saveButton = screen.getByText('Save Changes').closest('button')
    expect(saveButton).toBeDisabled()
  })

  it('shows loading spinner when updating', () => {
    render(<TaskDetailsForm {...defaultProps} isUpdating={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })
})
