import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GrowthMetric } from '@/components/Dashboard/Analytics/WorkspaceUsage/GrowthMetric'

const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />

describe('GrowthMetric', () => {
  it('renders label and value', () => {
    render(
      <GrowthMetric label="Tasks Completed" value={42} change={15} icon={MockIcon} />
    )
    expect(screen.getByText('Tasks Completed')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders positive change with + prefix', () => {
    render(
      <GrowthMetric label="Test" value={10} change={12} icon={MockIcon} />
    )
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  it('renders negative change', () => {
    render(
      <GrowthMetric label="Test" value={10} change={-8} icon={MockIcon} />
    )
    expect(screen.getByText('-8%')).toBeInTheDocument()
  })

  it('renders zero change as neutral', () => {
    render(
      <GrowthMetric label="Test" value={10} change={0} icon={MockIcon} />
    )
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
