import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TaskStatsCards } from '@/components/Dashboard/AllTasks/TaskStatsCards'

vi.mock('@/components/Shared/StatCard', () => ({
  default: (p: Record<string, unknown>) => <div data-testid="stat-card" data-label={p.label}>{p.label}: {p.value}</div>,
}))

describe('TaskStatsCards', () => {
  const defaultStats = {
    personal: 5,
    assigned: 3,
    created: 2,
    dueToday: 1,
    overdue: 1,
    totalTasks: 10,
    inProgress: 4,
    completed: 2,
  }

  it('renders 7 stat cards for "all" tab', () => {
    render(<TaskStatsCards stats={defaultStats} activeTab="all" />)
    const cards = screen.getAllByTestId('stat-card')
    expect(cards).toHaveLength(7)
  })

  it('renders 4 stat cards for "personal" tab', () => {
    render(<TaskStatsCards stats={defaultStats} activeTab="personal" />)
    const cards = screen.getAllByTestId('stat-card')
    expect(cards).toHaveLength(4)
  })

  it('renders 4 stat cards for "assigned" tab', () => {
    render(<TaskStatsCards stats={defaultStats} activeTab="assigned" />)
    const cards = screen.getAllByTestId('stat-card')
    expect(cards).toHaveLength(4)
  })

  it('displays correct stat values for "all" tab', () => {
    render(<TaskStatsCards stats={defaultStats} activeTab="all" />)
    expect(screen.getByText('Total Tasks: 10')).toBeInTheDocument()
    expect(screen.getByText('Personal: 5')).toBeInTheDocument()
    expect(screen.getByText('Assigned: 3')).toBeInTheDocument()
    expect(screen.getByText('Due Today: 1')).toBeInTheDocument()
    expect(screen.getByText('Overdue: 1')).toBeInTheDocument()
  })

  it('defaults to "all" tab when activeTab not specified', () => {
    render(<TaskStatsCards stats={defaultStats} />)
    const cards = screen.getAllByTestId('stat-card')
    expect(cards).toHaveLength(7)
  })
})
