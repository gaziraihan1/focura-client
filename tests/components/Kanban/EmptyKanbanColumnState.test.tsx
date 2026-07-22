import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyKanbanColumnState from '@/components/Dashboard/KanbanView/KanbanColumn/EmptyKanbanColumnState'

describe('EmptyKanbanColumnState', () => {
  it('shows healthy message for blocked column with no tasks', () => {
    render(<EmptyKanbanColumnState isBlocked={true} columnId="blocked" />)
    expect(screen.getByText('No blocked tasks')).toBeInTheDocument()
    expect(screen.getByText('Flow is healthy')).toBeInTheDocument()
  })

  it('shows done message for done column', () => {
    render(<EmptyKanbanColumnState isBlocked={false} columnId="done" />)
    expect(screen.getByText('Execution complete')).toBeInTheDocument()
    expect(screen.getByText('Nothing finished yet')).toBeInTheDocument()
  })

  it('shows backlog message for backlog column', () => {
    render(<EmptyKanbanColumnState isBlocked={false} columnId="backlog" />)
    expect(screen.getByText('No tasks here')).toBeInTheDocument()
    expect(screen.getByText('Add tasks to get started')).toBeInTheDocument()
  })

  it('shows generic message for other columns', () => {
    render(<EmptyKanbanColumnState isBlocked={false} columnId="in-progress" />)
    expect(screen.getByText('No tasks here')).toBeInTheDocument()
    expect(screen.getByText('Flow is healthy')).toBeInTheDocument()
  })
})
