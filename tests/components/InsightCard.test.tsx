import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InsightCard } from '@/components/Dashboard/Calendar/InsightCard'

const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />

describe('InsightCard', () => {
  it('renders label and value', () => {
    render(
      <InsightCard
        icon={MockIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        label="Tasks"
        value={42}
      />
    )
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders string value', () => {
    render(
      <InsightCard
        icon={MockIcon}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
        label="Status"
        value="Active"
      />
    )
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(
      <InsightCard
        icon={MockIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        label="Tasks"
        value={10}
        subtitle="5 completed"
      />
    )
    expect(screen.getByText('5 completed')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(
      <InsightCard
        icon={MockIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        label="Tasks"
        value={10}
      />
    )
    expect(screen.queryByText(/completed/)).not.toBeInTheDocument()
  })

  it('renders progress bar when provided', () => {
    const { container } = render(
      <InsightCard
        icon={MockIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        label="Progress"
        value="50%"
        progressBar={{ percentage: 50, color: 'bg-blue-500' }}
      />
    )
    const progressBar = container.querySelector('[style*="width: 50%"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('does not render progress bar when not provided', () => {
    const { container } = render(
      <InsightCard
        icon={MockIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        label="Tasks"
        value={10}
      />
    )
    const progressBars = container.querySelectorAll('[style*="width"]')
    expect(progressBars.length).toBe(0)
  })

  it('renders icon with correct color', () => {
    render(
      <InsightCard
        icon={MockIcon}
        iconColor="text-red-500"
        iconBgColor="bg-red-500/10"
        label="Alert"
        value={0}
      />
    )
    expect(screen.getByTestId('mock-icon')).toHaveClass('text-red-500')
  })
})
