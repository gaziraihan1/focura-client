import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskHeader } from '@/components/dashboard/task-details/TaskHeader'

vi.mock('lucide-react', () => ({
  ArrowLeft: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="arrow-left" {...props} />,
  Edit: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="edit-icon" {...props} />,
  Trash: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="trash-icon" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader-icon" {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-circle" {...props} />,
}))

describe('TaskHeader', () => {
  const defaultProps = {
    isEditing: false,
    onBack: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isDeleting: false,
    canEdit: true,
    canDelete: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders back button', () => {
    render(<TaskHeader {...defaultProps} />)
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(<TaskHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('Back'))
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1)
  })

  it('shows edit button when not editing and canEdit is true', () => {
    render(<TaskHeader {...defaultProps} />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('hides edit button when editing', () => {
    render(<TaskHeader {...defaultProps} isEditing={true} />)
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('hides edit button when canEdit is false', () => {
    render(<TaskHeader {...defaultProps} canEdit={false} />)
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskHeader {...defaultProps} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1)
  })

  it('shows delete button when canDelete is true', () => {
    render(<TaskHeader {...defaultProps} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('hides delete button when canDelete is false', () => {
    render(<TaskHeader {...defaultProps} canDelete={false} />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskHeader {...defaultProps} />)

    // Click the delete button to show the confirmation modal
    fireEvent.click(screen.getByText('Delete'))

    // Click the confirm button in the modal
    const confirmButtons = screen.getAllByText('Delete')
    expect(confirmButtons).toHaveLength(2) // One in header, one in modal
    fireEvent.click(confirmButtons[1]) // Click the modal's delete button

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
  })

  it('shows loading spinner when deleting', () => {
    render(<TaskHeader {...defaultProps} isDeleting={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('disables delete button when deleting', () => {
    render(<TaskHeader {...defaultProps} isDeleting={true} />)

    // Get the header delete button (the first one in the document)
    const deleteButtons = screen.getAllByText('Delete')
    const headerDeleteButton = deleteButtons[0].closest('button')
    expect(headerDeleteButton).toBeDisabled()
  })

  it('renders both edit and delete buttons by default', () => {
    render(<TaskHeader {...defaultProps} />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })
})
