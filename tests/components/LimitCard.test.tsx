import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LimitCard } from '@/components/Dashboard/Analytics/WorkspaceUsage/LimitCard'

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="mock-icon" {...props} />

describe('LimitCard', () => {
  it('renders label and current value', () => {
    render(
      <LimitCard
        icon={MockIcon}
        label="Storage"
        current={5}
        max={10}
        unit="GB"
        percentage={50}
      />
    )
    expect(screen.getByText('Storage')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('GB')).toBeInTheDocument()
  })

  it('renders max limit', () => {
    render(
      <LimitCard
        icon={MockIcon}
        label="Storage"
        current={5}
        max={10}
        unit="GB"
        percentage={50}
      />
    )
    expect(screen.getByText('/ 10 GB')).toBeInTheDocument()
  })

  it('renders percentage used', () => {
    render(
      <LimitCard
        icon={MockIcon}
        label="Storage"
        current={5}
        max={10}
        unit="GB"
        percentage={50}
      />
    )
    expect(screen.getByText('50% used')).toBeInTheDocument()
  })

  it('renders unlimited when max is null', () => {
    render(
      <LimitCard
        icon={MockIcon}
        label="Members"
        current={5}
        max={null}
        unit=""
        percentage={0}
      />
    )
    expect(screen.getByText('Unlimited')).toBeInTheDocument()
  })

  it('renders warning style when percentage >= 75', () => {
    render(
      <LimitCard
        icon={MockIcon}
        label="Storage"
        current={8}
        max={10}
        unit="GB"
        percentage={80}
      />
    )
    expect(screen.getByText('80% used')).toHaveClass('text-orange-600')
  })

  it('renders critical style when percentage >= 90', () => {
    render(
      <LimitCard
        icon={MockIcon}
        label="Storage"
        current={9.5}
        max={10}
        unit="GB"
        percentage={95}
      />
    )
    expect(screen.getByText('95% used')).toHaveClass('text-red-600')
  })
})
