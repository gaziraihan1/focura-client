import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GrowthInsightsSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/GrowthInsightsSection'
import type { WorkspaceGrowthMetrics } from '@/types/workspace-usage.types'

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    TrendingUp: icon('TrendingUp'),
    TrendingDown: icon('TrendingDown'),
    ListTodo: icon('ListTodo'),
    Users: icon('Users'),
    Folder: icon('Folder'),
    CheckCircle: icon('CheckCircle'),
    Lightbulb: icon('Lightbulb'),
  }
})

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

const workspaceGrowth: WorkspaceGrowthMetrics = {
  thisMonth: { newUsers: 2, newProjects: 1, newTasks: 30 },
  trend: [
    { month: 'Jan', users: 5, projects: 2, tasks: 20 },
    { month: 'Feb', users: 7, projects: 3, tasks: 30 },
  ],
  projectLifecycle: { created: 5, active: 4, completed: 1, archived: 0 },
  changes: { newTasks: 50, newUsers: 40, newProjects: null },
  insights: [
    { id: 1, text: 'Task creation increased 50% this month — strong team engagement.', type: 'positive' },
    { id: 2, text: 'Storage usage is healthy at 40% of your plan limit.', type: 'positive' },
    { id: 3, text: '4 active projects progressing with 30 new tasks added this month.', type: 'neutral' },
  ],
}

describe('GrowthInsightsSection', () => {
  it('renders heading and growth metrics', () => {
    render(<GrowthInsightsSection workspaceGrowth={workspaceGrowth} />)
    expect(screen.getByText('Growth Insights')).toBeInTheDocument()
    expect(screen.getByText('New Tasks')).toBeInTheDocument()
    expect(screen.getByText('New Members')).toBeInTheDocument()
    expect(screen.getByText('New Projects')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders the 6-month trend chart', () => {
    const { container } = render(<GrowthInsightsSection workspaceGrowth={workspaceGrowth} />)
    expect(container.querySelector('[data-testid="bar-chart"]')).toBeTruthy()
  })

  it('renders insights from real data', () => {
    render(<GrowthInsightsSection workspaceGrowth={workspaceGrowth} />)
    expect(screen.getByText('Key Insights')).toBeInTheDocument()
    expect(screen.getByText(/Task creation increased 50%/)).toBeInTheDocument()
    expect(screen.getByText(/Storage usage is healthy/)).toBeInTheDocument()
    expect(screen.getByText(/4 active projects/)).toBeInTheDocument()
  })

  it('shows real month-over-month change badges', () => {
    render(<GrowthInsightsSection workspaceGrowth={workspaceGrowth} />)
    expect(screen.getByText('+50%')).toBeInTheDocument()
    expect(screen.getByText('+40%')).toBeInTheDocument()
  })

  it('renders project lifecycle values', () => {
    render(<GrowthInsightsSection workspaceGrowth={workspaceGrowth} />)
    expect(screen.getByText('Project Lifecycle')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('Archived')).toBeInTheDocument()
  })

  it('uses chart token colors for lifecycle items', () => {
    render(<GrowthInsightsSection workspaceGrowth={workspaceGrowth} />)
    const created = screen.getByText('Created').previousElementSibling
    expect(created?.className).toContain('text-chart-1')
  })
})
