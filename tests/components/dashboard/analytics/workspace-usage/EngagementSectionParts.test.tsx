import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react';
import {
  ActiveUserCards,
  DailyActiveUsersChart,
  PeakHoursHeatmap,
  InactiveMembers,
} from '@/components/dashboard/analytics/WorkspaceUsage/EngagementSectionParts'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

const mockStats = [
  { label: 'Online Now', value: 3, color: 'text-green-500' },
  { label: 'This Week', value: 12, color: 'text-blue-500' },
]

describe('EngagementSectionParts', () => {
  it('ActiveUserCards renders stat values', () => {
    render(<ActiveUserCards stats={mockStats} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('DailyActiveUsersChart renders heading', () => {
    render(<DailyActiveUsersChart chartData={[{ date: 'Jul 13', users: 8 }]} />)
    expect(screen.getByText('Daily Active Users')).toBeInTheDocument()
  })

  it('PeakHoursHeatmap renders day labels', () => {
    render(<PeakHoursHeatmap data={[]} />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('PeakHoursHeatmap renders real activity values in cell titles', () => {
    const { container } = render(
      <PeakHoursHeatmap
        data={[
          { day: 'Mon', hour: 9, activity: 100 },
          { day: 'Fri', hour: 15, activity: 40 },
        ]}
      />
    )
    expect(container.querySelector('[title="Mon 9:00 — 100% activity"]')).toBeTruthy()
    expect(container.querySelector('[title="Fri 15:00 — 40% activity"]')).toBeTruthy()
  })

  it('InactiveMembers returns null for empty users', () => {
    const { container } = render(<InactiveMembers users={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
