import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// ─── KanbanCardTitle ─────────────────────────────────────────────────────────
import { KanbanCardTitle } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardTitle'

describe('KanbanCardTitle', () => {
  it('renders the title', () => {
    render(<KanbanCardTitle title="Test Task" />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<KanbanCardTitle title="Test Task" description="A description" />)
    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('hides description when not provided', () => {
    render(<KanbanCardTitle title="Test Task" />)
    expect(screen.queryByText('A description')).not.toBeInTheDocument()
  })

  it('hides description when null', () => {
    render(<KanbanCardTitle title="Test Task" description={null} />)
    expect(screen.queryByText('A description')).not.toBeInTheDocument()
  })
})

// ─── KanbanCardHeader ────────────────────────────────────────────────────────
import { KanbanCardHeader } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardHeader'

describe('KanbanCardHeader', () => {
  it('renders URGENT priority', () => {
    render(<KanbanCardHeader priority="URGENT" isCompleted={false} isBlocked={false} />)
    expect(screen.getByText('URGENT')).toBeInTheDocument()
  })

  it('renders HIGH priority', () => {
    render(<KanbanCardHeader priority="HIGH" isCompleted={false} isBlocked={false} />)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('renders MEDIUM priority', () => {
    render(<KanbanCardHeader priority="MEDIUM" isCompleted={false} isBlocked={false} />)
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  it('renders LOW priority', () => {
    render(<KanbanCardHeader priority="LOW" isCompleted={false} isBlocked={false} />)
    expect(screen.getByText('LOW')).toBeInTheDocument()
  })

  it('shows completed icon when isCompleted is true', () => {
    const { container } = render(<KanbanCardHeader priority="MEDIUM" isCompleted={true} isBlocked={false} />)
    expect(container.querySelector('.text-green-500')).toBeInTheDocument()
  })

  it('shows blocked icon when isBlocked is true', () => {
    const { container } = render(<KanbanCardHeader priority="MEDIUM" isCompleted={false} isBlocked={true} />)
    expect(container.querySelector('.text-destructive')).toBeInTheDocument()
  })

  it('hides completed icon when isCompleted is false', () => {
    const { container } = render(<KanbanCardHeader priority="MEDIUM" isCompleted={false} isBlocked={false} />)
    expect(container.querySelector('.text-green-500')).not.toBeInTheDocument()
  })
})

// ─── KanbanCardFooter ────────────────────────────────────────────────────────
import { KanbanCardFooter } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardFooter'

describe('KanbanCardFooter', () => {
  const assignees = [
    { user: { id: '1', name: 'Alice' } },
    { user: { id: '2', name: 'Bob' } },
  ]

  it('shows unassigned when no assignees', () => {
    render(<KanbanCardFooter assignees={[]} commentsCount={0} filesCount={0} isOverdue={false} />)
    expect(screen.getByText('Unassigned')).toBeInTheDocument()
  })

  it('shows assignee count when assignees exist', () => {
    render(<KanbanCardFooter assignees={assignees} commentsCount={0} filesCount={0} isOverdue={false} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows comments count when > 0', () => {
    render(<KanbanCardFooter assignees={[]} commentsCount={5} filesCount={0} isOverdue={false} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('hides comments count when 0', () => {
    const { container } = render(<KanbanCardFooter assignees={[]} commentsCount={0} filesCount={0} isOverdue={false} />)
    expect(container.querySelectorAll('.text-muted-foreground').length).toBeGreaterThan(0)
  })

  it('shows files count when > 0', () => {
    render(<KanbanCardFooter assignees={[]} commentsCount={0} filesCount={3} isOverdue={false} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows due date when provided', () => {
    render(<KanbanCardFooter assignees={[]} commentsCount={0} filesCount={0} dueDate="2026-12-25" isOverdue={false} />)
    expect(screen.getByText(/Dec 25/)).toBeInTheDocument()
  })

  it('applies overdue styling when isOverdue is true', () => {
    render(<KanbanCardFooter assignees={[]} commentsCount={0} filesCount={0} dueDate="2026-12-25" isOverdue={true} />)
    const dateEl = screen.getByText(/Dec 25/)
    expect(dateEl.className).toContain('text-destructive')
  })

  it('hides due date when not provided', () => {
    render(<KanbanCardFooter assignees={[]} commentsCount={0} filesCount={0} isOverdue={false} />)
    expect(screen.queryByText(/Dec/)).not.toBeInTheDocument()
  })
})

// ─── KanbanCardMetadata ──────────────────────────────────────────────────────
import { KanbanCardMetadata } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardMetadata'

describe('KanbanCardMetadata', () => {
  it('shows days stale when > 0', () => {
    render(<KanbanCardMetadata daysStale={5} agingStatus="normal" taskStatus="IN_PROGRESS" isBlocked={false} subtasksCount={0} subtaskProgress={0} />)
    expect(screen.getByText(/5d in in progress/)).toBeInTheDocument()
  })

  it('hides days stale when 0', () => {
    render(<KanbanCardMetadata daysStale={0} agingStatus="normal" taskStatus="IN_PROGRESS" isBlocked={false} subtasksCount={0} subtaskProgress={0} />)
    expect(screen.queryByText(/d in/)).not.toBeInTheDocument()
  })

  it('shows critical aging styling', () => {
    render(<KanbanCardMetadata daysStale={10} agingStatus="critical" taskStatus="IN_PROGRESS" isBlocked={false} subtasksCount={0} subtaskProgress={0} />)
    expect(screen.getByText(/10d in in progress/)).toBeInTheDocument()
  })

  it('shows warning aging styling', () => {
    render(<KanbanCardMetadata daysStale={3} agingStatus="warning" taskStatus="IN_PROGRESS" isBlocked={false} subtasksCount={0} subtaskProgress={0} />)
    expect(screen.getByText(/3d in in progress/)).toBeInTheDocument()
  })

  it('shows blocked message when isBlocked is true', () => {
    render(<KanbanCardMetadata daysStale={0} agingStatus="normal" taskStatus="IN_PROGRESS" isBlocked={true} subtasksCount={0} subtaskProgress={0} />)
    expect(screen.getByText(/Blocked/)).toBeInTheDocument()
  })

  it('hides blocked message when isBlocked is false', () => {
    render(<KanbanCardMetadata daysStale={0} agingStatus="normal" taskStatus="IN_PROGRESS" isBlocked={false} subtasksCount={0} subtaskProgress={0} />)
    expect(screen.queryByText(/Blocked/)).not.toBeInTheDocument()
  })

  it('shows subtask progress when subtasksCount > 0', () => {
    render(<KanbanCardMetadata daysStale={0} agingStatus="normal" taskStatus="IN_PROGRESS" isBlocked={false} subtasksCount={3} subtaskProgress={66} />)
    expect(screen.getByText('Subtasks')).toBeInTheDocument()
    expect(screen.getByText('66%')).toBeInTheDocument()
  })

  it('hides subtask progress when subtasksCount is 0', () => {
    render(<KanbanCardMetadata daysStale={0} agingStatus="normal" taskStatus="IN_PROGRESS" isBlocked={false} subtasksCount={0} subtaskProgress={0} />)
    expect(screen.queryByText('Subtasks')).not.toBeInTheDocument()
  })
})

// ─── KanbanCardProjectIndicator ──────────────────────────────────────────────
import { KanbanCardProjectIndicator } from '@/components/Dashboard/KanbanView/KanbanCard/KanbanCardProjectIndicator'

describe('KanbanCardProjectIndicator', () => {
  it('renders nothing when project is null', () => {
    const { container } = render(<KanbanCardProjectIndicator project={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing when project is undefined', () => {
    const { container } = render(<KanbanCardProjectIndicator />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the color bar when project is provided', () => {
    const { container } = render(<KanbanCardProjectIndicator project={{ id: '1', name: 'Project A', color: '#ff0000' }} />)
    const bar = container.querySelector('[style*="background-color"]')
    expect(bar).toBeInTheDocument()
  })
})

// ─── EmptyKanbanColumnState ──────────────────────────────────────────────────
import EmptyKanbanColumnState from '@/components/Dashboard/KanbanView/KanbanColumn/EmptyKanbanColumnState'

describe('EmptyKanbanColumnState', () => {
  it('shows no blocked tasks when isBlocked is true', () => {
    render(<EmptyKanbanColumnState isBlocked={true} columnId="blocked" />)
    expect(screen.getByText('No blocked tasks')).toBeInTheDocument()
    expect(screen.getByText('Flow is healthy')).toBeInTheDocument()
  })

  it('shows execution complete for done column', () => {
    render(<EmptyKanbanColumnState isBlocked={false} columnId="done" />)
    expect(screen.getByText('Execution complete')).toBeInTheDocument()
    expect(screen.getByText('Nothing finished yet')).toBeInTheDocument()
  })

  it('shows add tasks for backlog column', () => {
    render(<EmptyKanbanColumnState isBlocked={false} columnId="backlog" />)
    expect(screen.getByText('No tasks here')).toBeInTheDocument()
    expect(screen.getByText('Add tasks to get started')).toBeInTheDocument()
  })

  it('shows flow is healthy for other columns', () => {
    render(<EmptyKanbanColumnState isBlocked={false} columnId="in-progress" />)
    expect(screen.getByText('No tasks here')).toBeInTheDocument()
    expect(screen.getByText('Flow is healthy')).toBeInTheDocument()
  })
})

// ─── KanbanColumnHeader ──────────────────────────────────────────────────────
import KanbanColumnHeader from '@/components/Dashboard/KanbanView/KanbanColumn/KanbanColumnHeader'

const mockColumn = { id: 'todo', title: 'To Do', wipLimit: 5 }

describe('KanbanColumnHeader', () => {
  it('renders the column title', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 3, isBottleneck: false, avgDays: 2.5 }} isOverLimit={false} isNearLimit={false} enforceWIP={true} isBlocked={false} taskLength={3} />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 3, isBottleneck: false, avgDays: 2.5 }} isOverLimit={false} isNearLimit={false} enforceWIP={true} isBlocked={false} taskLength={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders WIP limit when enforceWIP is true', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 3, isBottleneck: false, avgDays: 2.5 }} isOverLimit={false} isNearLimit={false} enforceWIP={true} isBlocked={false} taskLength={3} />)
    expect(screen.getByText(/\/ 5/)).toBeInTheDocument()
  })

  it('hides WIP limit when enforceWIP is false', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 3, isBottleneck: false, avgDays: 2.5 }} isOverLimit={false} isNearLimit={false} enforceWIP={false} isBlocked={false} taskLength={3} />)
    expect(screen.queryByText(/\/ 5/)).not.toBeInTheDocument()
  })

  it('shows warning when near limit', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 4, isBottleneck: false, avgDays: 2.5 }} isOverLimit={false} isNearLimit={true} enforceWIP={true} isBlocked={false} taskLength={4} />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('shows bottleneck warning', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 10, isBottleneck: true, avgDays: 5.0 }} isOverLimit={false} isNearLimit={false} enforceWIP={true} isBlocked={false} taskLength={10} />)
    expect(screen.getByText(/Bottleneck/)).toBeInTheDocument()
  })

  it('shows avg days', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 3, isBottleneck: false, avgDays: 2.5 }} isOverLimit={false} isNearLimit={false} enforceWIP={true} isBlocked={false} taskLength={3} />)
    expect(screen.getByText(/2\.5d/)).toBeInTheDocument()
  })

  it('shows clear when blocked and no tasks', () => {
    render(<KanbanColumnHeader column={mockColumn} stats={{ count: 0, isBottleneck: false, avgDays: 0 }} isOverLimit={false} isNearLimit={false} enforceWIP={true} isBlocked={true} taskLength={0} />)
    expect(screen.getByText(/Clear/)).toBeInTheDocument()
  })
})
