import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatusSelector } from '@/components/Dashboard/TaskDetails/TaskSidebar/StatusSelector'

vi.mock('lucide-react', () => ({
  Lock: (props: any) => <svg data-testid="lock-icon" {...props} />,
}))

vi.mock('@/utils/task.utils', () => ({
  getStatusColor: () => 'border-gray-300',
}))

describe('StatusSelector', () => {
  const defaultProps = {
    status: 'TODO' as const,
    isPersonalTask: false,
    isUpdatingStatus: false,
    canChangeStatus: true,
    onStatusChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders status select with current status', () => {
    render(<StatusSelector {...defaultProps} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('TODO')
  })

  it('renders all status options for non-personal tasks', () => {
    render(<StatusSelector {...defaultProps} />)
    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option'))
    const values = options.map((o) => o.getAttribute('value'))
    expect(values).toContain('TODO')
    expect(values).toContain('IN_PROGRESS')
    expect(values).toContain('IN_REVIEW')
    expect(values).toContain('BLOCKED')
    expect(values).toContain('COMPLETED')
    expect(values).toContain('CANCELLED')
  })

  it('renders only personal task status options', () => {
    render(<StatusSelector {...defaultProps} isPersonalTask={true} />)
    const select = screen.getByRole('combobox')
    const options = Array.from(select.querySelectorAll('option'))
    const values = options.map((o) => o.getAttribute('value'))
    expect(values).toEqual(['TODO', 'IN_PROGRESS', 'COMPLETED'])
  })

  it('calls onStatusChange when status is changed', () => {
    render(<StatusSelector {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'COMPLETED' } })
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith('COMPLETED')
  })

  it('disables select when updating', () => {
    render(<StatusSelector {...defaultProps} isUpdatingStatus={true} />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('shows locked state when canChangeStatus is false', () => {
    render(<StatusSelector {...defaultProps} canChangeStatus={false} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })

  it('shows lock icon when canChangeStatus is false', () => {
    render(<StatusSelector {...defaultProps} canChangeStatus={false} />)
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument()
  })

  it('shows current status label when locked', () => {
    render(<StatusSelector {...defaultProps} canChangeStatus={false} status="IN_PROGRESS" />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('shows personal task hint for personal tasks', () => {
    render(<StatusSelector {...defaultProps} isPersonalTask={true} />)
    expect(screen.getByText(/Personal tasks support/)).toBeInTheDocument()
  })

  it('does not show personal task hint for non-personal tasks', () => {
    render(<StatusSelector {...defaultProps} isPersonalTask={false} />)
    expect(screen.queryByText(/Personal tasks support/)).not.toBeInTheDocument()
  })
})
