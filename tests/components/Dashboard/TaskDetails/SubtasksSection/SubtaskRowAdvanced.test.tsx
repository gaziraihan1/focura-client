import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { SubtaskRow } from '@/components/Dashboard/TaskDetails/SubtasksSection/SubtaskRow'

vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} />, button: (p: Record<string, unknown>) => <button {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@/components/Shared/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}))
vi.mock('@/components/Dashboard/TaskDetails/SubtasksSection/InlineEditor', () => ({
  InlineEditor: ({ value, onSave, onCancel }: Record<string, unknown>) => (
    <div>
      <input data-testid="editor" defaultValue={value} />
      <button onClick={() => onSave()}>Save</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  ),
}))

const mockSubtask = {
  id: 'st-1', title: 'Test Subtask', status: 'TODO', priority: 'HIGH',
  createdById: 'u-1', createdAt: '2024-06-15T10:00:00Z', dueDate: null,
  createdBy: { id: 'u-1', name: 'Alice', image: null },
  assignees: [],
}

describe('SubtaskRow', () => {
  const defaultProps = {
    subtask: mockSubtask as any,
    currentUserId: 'u-1',
    isAssignee: false,
    onStatusChange: vi.fn(),
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
  }

  it('renders subtask title', () => {
    render(<SubtaskRow {...defaultProps} />)
    expect(screen.getByText('Test Subtask')).toBeInTheDocument()
  })

  it('renders creator name', () => {
    render(<SubtaskRow {...defaultProps} />)
    expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1)
  })

  it('shows edit button for creator', () => {
    render(<SubtaskRow {...defaultProps} />)
    expect(screen.getByTitle('Edit subtask')).toBeInTheDocument()
  })

  it('shows delete button for creator', () => {
    render(<SubtaskRow {...defaultProps} />)
    expect(screen.getByTitle('Delete subtask')).toBeInTheDocument()
  })

  it('hides edit button for non-creator', () => {
    render(<SubtaskRow {...defaultProps} currentUserId="u-other" />)
    expect(screen.queryByTitle('Edit subtask')).not.toBeInTheDocument()
  })

  it('enters edit mode when edit button clicked', async () => {
    const user = userEvent.setup()
    render(<SubtaskRow {...defaultProps} />)
    await user.click(screen.getByTitle('Edit subtask'))
    expect(screen.getByTestId('editor')).toBeInTheDocument()
  })

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<SubtaskRow {...defaultProps} onDelete={onDelete} />)
    await user.click(screen.getByTitle('Delete subtask'))
    expect(onDelete).toHaveBeenCalledWith('st-1')
  })

  it('shows due date when provided', () => {
    const subtask = { ...mockSubtask, dueDate: '2024-12-31T00:00:00Z' }
    render(<SubtaskRow {...defaultProps} subtask={subtask as any as Record<string, unknown>} />)
    expect(screen.getByText(/Due/)).toBeInTheDocument()
  })

  it('shows assignee avatars when present', () => {
    const subtask = { ...mockSubtask, assignees: [{ user: { id: 'u-2', name: 'Bob', image: null } }] }
    render(<SubtaskRow {...defaultProps} subtask={subtask as any as Record<string, unknown>} />)
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('applies opacity for completed subtask', () => {
    const subtask = { ...mockSubtask, status: 'COMPLETED' }
    const { container } = render(<SubtaskRow {...defaultProps} subtask={subtask as any as Record<string, unknown>} />)
    expect(container.firstChild).toHaveClass('opacity-60')
  })
})
