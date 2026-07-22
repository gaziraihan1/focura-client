import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanCardTitle } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardTitle'

describe('KanbanCardTitle', () => {
  it('renders title', () => {
    render(<KanbanCardTitle title="Fix login bug" />)
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <KanbanCardTitle title="Fix login bug" description="Users cannot log in with SSO" />
    )
    expect(screen.getByText('Users cannot log in with SSO')).toBeInTheDocument()
  })

  it('does not render description when null', () => {
    render(<KanbanCardTitle title="Fix login bug" description={null} />)
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.queryByText(/users cannot/i)).not.toBeInTheDocument()
  })

  it('does not render description when undefined', () => {
    render(<KanbanCardTitle title="Fix login bug" />)
    const descriptions = screen.queryAllByText(/./)
    expect(descriptions).toHaveLength(1)
  })
})
