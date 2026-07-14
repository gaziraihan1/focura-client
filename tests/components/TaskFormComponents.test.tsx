import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskFormHeader } from '@/components/Tasks/form/TaskFormHeader'
import { FormActions } from '@/components/Tasks/form/FormActions'

describe('TaskFormHeader', () => {
  it('renders create task heading', () => {
    render(<TaskFormHeader onCancel={vi.fn()} />)
    expect(screen.getByText('Create Personal Task')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<TaskFormHeader onCancel={vi.fn()} />)
    expect(screen.getByText('Capture tasks with focus and energy awareness')).toBeInTheDocument()
  })

  it('calls onCancel when back button is clicked', () => {
    const onCancel = vi.fn()
    render(<TaskFormHeader onCancel={onCancel} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when close button is clicked', () => {
    const onCancel = vi.fn()
    render(<TaskFormHeader onCancel={onCancel} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('FormActions', () => {
  it('renders create task button', () => {
    render(<FormActions isLoading={false} onCancel={vi.fn()} />)
    expect(screen.getByText('Create Task')).toBeInTheDocument()
  })

  it('renders cancel button', () => {
    render(<FormActions isLoading={false} onCancel={vi.fn()} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<FormActions isLoading={false} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('shows loading state when isLoading is true', () => {
    render(<FormActions isLoading={true} onCancel={vi.fn()} />)
    expect(screen.getByText('Creating')).toBeInTheDocument()
    expect(screen.queryByText('Create Task')).not.toBeInTheDocument()
  })

  it('disables button when loading', () => {
    render(<FormActions isLoading={true} onCancel={vi.fn()} />)
    const createButton = screen.getByText('Creating').closest('button')
    expect(createButton).toBeDisabled()
  })
})
