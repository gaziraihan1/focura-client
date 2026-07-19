import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UsageSnapshot } from '@/components/Dashboard/Analytics/WorkspaceUsage/UsageSnapshot'

const mockData = {
  snapshot: {
    totalMembers: 24,
    activeMembers: 18,
    totalTasks: 1520,
    totalProjects: 12,
    storageUsedMB: 2048,
    activityEvents: 3400,
    avgDailyUsers: 15,
    engagementScore: 75,
  },
} as any

describe('UsageSnapshot', () => {
  it('renders overview heading', () => {
    render(<UsageSnapshot data={mockData} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders all KPI cards with correct values', () => {
    render(<UsageSnapshot data={mockData} />)
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
  })

  it('formats storage in GB when >= 1024 MB', () => {
    render(<UsageSnapshot data={mockData} />)
    expect(screen.getByText('2.0 GB')).toBeInTheDocument()
  })

  it('renders engagement score as percentage', () => {
    render(<UsageSnapshot data={mockData} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })
})
