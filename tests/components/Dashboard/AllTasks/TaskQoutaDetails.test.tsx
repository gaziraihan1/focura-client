import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskQuotaDetails, {
  formatResetTime,
  getPlanBadgeBg,
} from '@/components/Dashboard/AllTasks/TaskQoutaDetails'

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/QoutaSkeleton', () => ({
  QuotaSkeleton: () => <div data-testid="QuotaSkeleton">Loading quota</div>,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/WorkspaceCard', () => ({
  WorkspaceCard: (props: any) => <div data-testid="WorkspaceCard">Workspace</div>,
}))

vi.mock('@/components/Dashboard/AllTasks/TaskQouta/PersonalCard', () => ({
  PersonalCard: (props: any) => <div data-testid="PersonalCard">Personal</div>,
}))

describe('formatResetTime', () => {
  it('returns "resetting…" when reset time is in the past', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(formatResetTime(past)).toBe('resetting…')
  })

  it('returns hours and minutes format for future time', () => {
    const future = new Date(Date.now() + 3_600_000 + 30 * 60_000).toISOString()
    const result = formatResetTime(future)
    expect(result).toMatch(/1h \d+m/)
  })
})

describe('getPlanBadgeBg', () => {
  it('returns correct class for ENTERPRISE', () => {
    expect(getPlanBadgeBg('ENTERPRISE')).toContain('chart-1')
  })

  it('returns default class for FREE', () => {
    expect(getPlanBadgeBg('FREE')).toContain('muted')
  })
})

describe('TaskQuotaDetails', () => {
  it('renders skeleton when qouta is undefined', () => {
    render(<TaskQuotaDetails qouta={undefined} />)
    expect(screen.getByTestId('QuotaSkeleton')).toBeInTheDocument()
  })

  it('returns null when qouta is null', () => {
    const { container } = render(<TaskQuotaDetails qouta={null} />)
    expect(container.innerHTML).toBe('')
  })
})
