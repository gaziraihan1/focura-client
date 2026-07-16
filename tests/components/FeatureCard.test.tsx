import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureCard } from '@/components/Dashboard/Analytics/WorkspaceUsage/FeatureCard'

const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />

describe('FeatureCard', () => {
  it('renders label and count', () => {
    render(
      <FeatureCard
        icon={MockIcon}
        label="Tasks Created"
        count={150}
        change={12}
        accentColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
    )
    expect(screen.getByText('Tasks Created')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('renders positive change with + prefix', () => {
    render(
      <FeatureCard
        icon={MockIcon}
        label="Test"
        count={10}
        change={15}
        accentColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
    )
    expect(screen.getByText('+15%')).toBeInTheDocument()
  })

  it('renders negative change', () => {
    render(
      <FeatureCard
        icon={MockIcon}
        label="Test"
        count={10}
        change={-5}
        accentColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
    )
    expect(screen.getByText('-5%')).toBeInTheDocument()
  })

  it('renders zero change', () => {
    render(
      <FeatureCard
        icon={MockIcon}
        label="Test"
        count={10}
        change={0}
        accentColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
    )
    expect(screen.getByText('+0%')).toBeInTheDocument()
  })

  it('formats large numbers with locale', () => {
    render(
      <FeatureCard
        icon={MockIcon}
        label="Test"
        count={1234567}
        change={0}
        accentColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
    )
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })
})
