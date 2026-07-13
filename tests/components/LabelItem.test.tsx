import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LabelItem from '@/components/Labels/LabelItem'

vi.mock('lucide-react', () => ({
  Edit2: (props: any) => <svg data-testid="edit-icon" {...props} />,
  Trash2: (props: any) => <svg data-testid="trash-icon" {...props} />,
}))

const mockLabel = {
  id: 'label-1',
  name: 'Bug',
  color: '#EF4444',
  description: 'A bug label',
  workspaceId: 'ws-1',
  createdById: 'user-1',
  createdAt: new Date(),
  _count: { tasks: 5 },
}

describe('LabelItem', () => {
  it('renders label name', () => {
    render(<LabelItem label={mockLabel} />)
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<LabelItem label={mockLabel} />)
    expect(screen.getByText('(5 tasks)')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<LabelItem label={mockLabel} />)
    expect(screen.getByText('A bug label')).toBeInTheDocument()
  })

  it('renders color indicator', () => {
    const { container } = render(<LabelItem label={mockLabel} />)
    const colorIndicator = container.querySelector('.rounded-full')
    expect(colorIndicator).toBeInTheDocument()
  })

  it('shows edit button when onEdit is provided', () => {
    const onEdit = vi.fn()
    render(<LabelItem label={mockLabel} onEdit={onEdit} />)
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument()
  })

  it('shows delete button when onDelete is provided', () => {
    const onDelete = vi.fn()
    render(<LabelItem label={mockLabel} onDelete={onDelete} />)
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
  })

  it('does not show action buttons when no callbacks provided', () => {
    render(<LabelItem label={mockLabel} />)
    expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<LabelItem label={mockLabel} onEdit={onEdit} />)
    fireEvent.click(screen.getByTitle('Edit label'))
    expect(onEdit).toHaveBeenCalled()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<LabelItem label={mockLabel} onDelete={onDelete} />)
    fireEvent.click(screen.getByTitle('Delete label'))
    expect(onDelete).toHaveBeenCalled()
  })

  it('shows 1 task (singular) when count is 1', () => {
    const label = { ...mockLabel, _count: { tasks: 1 } }
    render(<LabelItem label={label} />)
    expect(screen.getByText('(1 task)')).toBeInTheDocument()
  })
})
