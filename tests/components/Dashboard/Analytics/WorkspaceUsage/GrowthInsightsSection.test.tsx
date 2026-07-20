import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GrowthInsightsSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/GrowthInsightsSection'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

const mockWorkspaceGrowth = {
  thisMonth: { newUsers: 5, newProjects: 3, newTasks: 28 },
  trend: [
    { month: 'Jan', users: 10, projects: 4, tasks: 50 },
    { month: 'Feb', users: 12, projects: 5, tasks: 65 },
  ],
  projectLifecycle: { created: 12, active: 8, completed: 15, archived: 3 },
}

describe('GrowthInsightsSection', () => {
  it('renders section heading', () => {
    render(<GrowthInsightsSection workspaceGrowth={mockWorkspaceGrowth as any as Record<string, unknown>} />)
    expect(screen.getByText('Growth Insights')).toBeInTheDocument()
  })

  it('renders growth metric cards', () => {
    render(<GrowthInsightsSection workspaceGrowth={mockWorkspaceGrowth as any as Record<string, unknown>} />)
    expect(screen.getByText('New Tasks')).toBeInTheDocument()
    expect(screen.getByText('New Members')).toBeInTheDocument()
    expect(screen.getByText('New Projects')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders key insights panel', () => {
    render(<GrowthInsightsSection workspaceGrowth={mockWorkspaceGrowth as any as Record<string, unknown>} />)
    expect(screen.getByText('Key Insights')).toBeInTheDocument()
    expect(screen.getByText(/Task creation increased significantly/)).toBeInTheDocument()
  })

  it('renders project lifecycle stats', () => {
    render(<GrowthInsightsSection workspaceGrowth={mockWorkspaceGrowth as any as Record<string, unknown>} />)
    expect(screen.getByText('Project Lifecycle')).toBeInTheDocument()
  })
})
