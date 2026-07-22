import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanCardMetadata } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardMetadata'

describe('KanbanCardMetadata', () => {
  it('renders days stale when > 0', () => {
    render(
      <KanbanCardMetadata
        daysStale={5}
        agingStatus="normal"
        taskStatus="IN_PROGRESS"
        isBlocked={false}
        subtasksCount={0}
        subtaskProgress={0}
      />
    )
    expect(screen.getByText(/5d in in progress/)).toBeInTheDocument()
  })

  it('does not render days stale when 0', () => {
    render(
      <KanbanCardMetadata
        daysStale={0}
        agingStatus="normal"
        taskStatus="IN_PROGRESS"
        isBlocked={false}
        subtasksCount={0}
        subtaskProgress={0}
      />
    )
    expect(screen.queryByText(/d in/)).not.toBeInTheDocument()
  })

  it('shows critical aging style', () => {
    render(
      <KanbanCardMetadata
        daysStale={10}
        agingStatus="critical"
        taskStatus="TODO"
        isBlocked={false}
        subtasksCount={0}
        subtaskProgress={0}
      />
    )
    const badge = screen.getByText(/10d in/).closest('div')!
    expect(badge).toHaveClass('bg-destructive/20')
  })

  it('shows warning aging style', () => {
    render(
      <KanbanCardMetadata
        daysStale={5}
        agingStatus="warning"
        taskStatus="TODO"
        isBlocked={false}
        subtasksCount={0}
        subtaskProgress={0}
      />
    )
    const badge = screen.getByText(/5d in/).closest('div')!
    expect(badge).toHaveClass('bg-amber-500/20')
  })

  it('shows blocked message when blocked', () => {
    render(
      <KanbanCardMetadata
        daysStale={0}
        agingStatus="normal"
        taskStatus="BLOCKED"
        isBlocked={true}
        subtasksCount={0}
        subtaskProgress={0}
      />
    )
    expect(screen.getByText(/Blocked/)).toBeInTheDocument()
    expect(screen.getByText(/Waiting for review/)).toBeInTheDocument()
  })

  it('does not show blocked message when not blocked', () => {
    render(
      <KanbanCardMetadata
        daysStale={0}
        agingStatus="normal"
        taskStatus="TODO"
        isBlocked={false}
        subtasksCount={0}
        subtaskProgress={0}
      />
    )
    expect(screen.queryByText(/Blocked/)).not.toBeInTheDocument()
  })

  it('shows subtask progress when subtasks exist', () => {
    render(
      <KanbanCardMetadata
        daysStale={0}
        agingStatus="normal"
        taskStatus="TODO"
        isBlocked={false}
        subtasksCount={3}
        subtaskProgress={66}
      />
    )
    expect(screen.getByText('Subtasks')).toBeInTheDocument()
    expect(screen.getByText('66%')).toBeInTheDocument()
  })

  it('does not show subtask progress when no subtasks', () => {
    render(
      <KanbanCardMetadata
        daysStale={0}
        agingStatus="normal"
        taskStatus="TODO"
        isBlocked={false}
        subtasksCount={0}
        subtaskProgress={0}
      />
    )
    expect(screen.queryByText('Subtasks')).not.toBeInTheDocument()
  })
})
