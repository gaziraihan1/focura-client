import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanCardFooter } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardFooter'

const defaultProps = {
  assignees: [],
  commentsCount: 0,
  filesCount: 0,
  dueDate: null,
  isOverdue: false,
}

describe('KanbanCardFooter', () => {
  it('shows unassigned when no assignees', () => {
    render(<KanbanCardFooter {...defaultProps} />)
    expect(screen.getByText('Unassigned')).toBeInTheDocument()
  })

  it('shows assignee count when assigned', () => {
    render(
      <KanbanCardFooter
        {...defaultProps}
        assignees={[{ user: { id: '1', name: 'Alice' } }]}
      />
    )
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.queryByText('Unassigned')).not.toBeInTheDocument()
  })

  it('shows comments count when > 0', () => {
    render(<KanbanCardFooter {...defaultProps} commentsCount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does not show comments count when 0', () => {
    render(<KanbanCardFooter {...defaultProps} commentsCount={0} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows files count when > 0', () => {
    render(<KanbanCardFooter {...defaultProps} filesCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not render comments or files section when both are 0', () => {
    const { container } = render(<KanbanCardFooter {...defaultProps} commentsCount={0} filesCount={0} />)
    const iconsContainer = container.querySelector('.flex.items-center.gap-2.sm\\:gap-3.text-muted-foreground')
    expect(iconsContainer).toBeEmptyDOMElement()
  })

  it('shows formatted due date', () => {
    render(
      <KanbanCardFooter
        {...defaultProps}
        dueDate="2026-07-15T00:00:00Z"
      />
    )
    expect(screen.getByText('Jul 15')).toBeInTheDocument()
  })

  it('does not show due date when null', () => {
    render(<KanbanCardFooter {...defaultProps} dueDate={null} />)
    expect(screen.queryByText(/Jul/)).not.toBeInTheDocument()
  })

  it('applies overdue style to due date', () => {
    render(
      <KanbanCardFooter
        {...defaultProps}
        dueDate="2026-07-15T00:00:00Z"
        isOverdue={true}
      />
    )
    const dateElement = screen.getByText('Jul 15')
    expect(dateElement).toHaveClass('text-destructive')
  })
})
