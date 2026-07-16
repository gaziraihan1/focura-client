import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import KanbanColumnHeader from '@/components/Dashboard/KanbanView/KanbanColumn/KanbanColumnHeader'

vi.mock('lucide-react', () => ({
  AlertTriangle: (props: any) => <svg data-testid="alert-icon" {...props} />,
}))

const defaultColumn = {
  id: 'todo',
  title: 'To Do',
  wipLimit: 5,
  statuses: ['TODO'],
}

const defaultStats = {
  count: 3,
  isBottleneck: false,
  avgDays: 2.5,
}

describe('KanbanColumnHeader', () => {
  it('renders column title', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={defaultStats}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={false}
        isBlocked={false}
        taskLength={3}
      />
    )
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={defaultStats}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={false}
        isBlocked={false}
        taskLength={3}
      />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows WIP limit when enforceWIP is true and limit < 999', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={defaultStats}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={true}
        isBlocked={false}
        taskLength={3}
      />
    )
    expect(screen.getByText('/ 5')).toBeInTheDocument()
  })

  it('does not show WIP limit when enforceWIP is false', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={defaultStats}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={false}
        isBlocked={false}
        taskLength={3}
      />
    )
    expect(screen.queryByText('/ 5')).not.toBeInTheDocument()
  })

  it('shows alert icon when over limit', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={defaultStats}
        isOverLimit={true}
        isNearLimit={false}
        enforceWIP={true}
        isBlocked={false}
        taskLength={6}
      />
    )
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
  })

  it('shows alert icon when bottleneck', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={{ ...defaultStats, isBottleneck: true }}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={false}
        isBlocked={false}
        taskLength={3}
      />
    )
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
  })

  it('shows bottleneck warning', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={{ ...defaultStats, isBottleneck: true }}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={false}
        isBlocked={false}
        taskLength={3}
      />
    )
    expect(screen.getByText(/Bottleneck/)).toBeInTheDocument()
  })

  it('shows "Clear" for empty blocked column', () => {
    render(
      <KanbanColumnHeader
        column={{ ...defaultColumn, id: 'blocked' }}
        stats={defaultStats}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={false}
        isBlocked={true}
        taskLength={0}
      />
    )
    expect(screen.getByText(/Clear/)).toBeInTheDocument()
  })

  it('renders average days', () => {
    render(
      <KanbanColumnHeader
        column={defaultColumn}
        stats={defaultStats}
        isOverLimit={false}
        isNearLimit={false}
        enforceWIP={false}
        isBlocked={false}
        taskLength={3}
      />
    )
    expect(screen.getByText('2.5d')).toBeInTheDocument()
  })
})
