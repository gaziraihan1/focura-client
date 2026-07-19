import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureUsageSection } from '@/components/Dashboard/Analytics/WorkspaceUsage/FeatureUsageSection'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

const mockFeatureUsage = {
  tasksCreated: 150,
  commentsAdded: 320,
  timeEntriesLogged: 89,
  filesUploaded: 45,
  mentionsUsed: 67,
  notificationsTriggered: 210,
}

describe('FeatureUsageSection', () => {
  it('renders section heading', () => {
    render(<FeatureUsageSection featureUsage={mockFeatureUsage as any} />)
    expect(screen.getByText('Feature Usage')).toBeInTheDocument()
  })

  it('renders all six feature cards', () => {
    render(<FeatureUsageSection featureUsage={mockFeatureUsage as any} />)
    expect(screen.getByText('Tasks Created')).toBeInTheDocument()
    expect(screen.getByText('Comments Added')).toBeInTheDocument()
    expect(screen.getByText('Time Entries')).toBeInTheDocument()
    expect(screen.getByText('Files Uploaded')).toBeInTheDocument()
    expect(screen.getByText('Mentions Used')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('displays formatted feature counts', () => {
    render(<FeatureUsageSection featureUsage={mockFeatureUsage as any} />)
    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('320')).toBeInTheDocument()
  })

  it('renders distribution chart', () => {
    render(<FeatureUsageSection featureUsage={mockFeatureUsage as any} />)
    expect(screen.getByText('Feature Usage Distribution')).toBeInTheDocument()
  })
})
