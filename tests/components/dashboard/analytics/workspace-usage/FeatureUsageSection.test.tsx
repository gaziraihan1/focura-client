import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureUsageSection } from '@/components/dashboard/analytics/WorkspaceUsage/FeatureUsageSection'
import type { FeatureUsageMetrics } from '@/types/workspace-usage.types'

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    C.displayName = name
    return C
  }
  return {
    ListTodo: icon('ListTodo'),
    MessageCircle: icon('MessageCircle'),
    Clock: icon('Clock'),
    FileUp: icon('FileUp'),
    AtSign: icon('AtSign'),
    Bell: icon('Bell'),
  }
})

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

const featureUsage: FeatureUsageMetrics = {
  tasksCreated: 150,
  commentsAdded: 300,
  timeEntriesLogged: 50,
  filesUploaded: 25,
  mentionsUsed: 10,
  notificationsTriggered: 400,
}

describe('FeatureUsageSection', () => {
  it('renders heading and period label', () => {
    render(<FeatureUsageSection featureUsage={featureUsage} />)
    expect(screen.getByText('Feature Usage')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('renders all feature cards with counts', () => {
    render(<FeatureUsageSection featureUsage={featureUsage} />)
    expect(screen.getByText('Tasks Created')).toBeInTheDocument()
    expect(screen.getByText('Comments Added')).toBeInTheDocument()
    expect(screen.getByText('Time Entries')).toBeInTheDocument()
    expect(screen.getByText('Files Uploaded')).toBeInTheDocument()
    expect(screen.getByText('Mentions Used')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()

    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
    expect(screen.getByText('400')).toBeInTheDocument()
  })

  it('renders the distribution chart', () => {
    const { container } = render(<FeatureUsageSection featureUsage={featureUsage} />)
    expect(container.querySelector('[data-testid="bar-chart"]')).toBeTruthy()
  })

  it('uses chart token classes on feature icons', () => {
    render(<FeatureUsageSection featureUsage={featureUsage} />)
    expect(screen.getByTestId('icon-ListTodo').getAttribute('class')).toContain('text-chart-1')
    expect(screen.getByTestId('icon-MessageCircle').getAttribute('class')).toContain('text-chart-2')
  })
})
