import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/shared/StatCard'

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="mock-icon" {...props} />

describe('ProjectDetails StatCard', () => {
  it('renders label and value', () => {
    render(
      <StatCard
        variant="outline"
        icon={MockIcon}
        label="Total Tasks"
        value={42}
        color="text-blue-500"
      />
    )
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders string value', () => {
    render(
      <StatCard
        variant="outline"
        icon={MockIcon}
        label="Status"
        value="Active"
        color="text-green-500"
      />
    )
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders icon with correct color', () => {
    render(
      <StatCard
        variant="outline"
        icon={MockIcon}
        label="Test"
        value={0}
        color="text-red-500"
      />
    )
    expect(screen.getByTestId('mock-icon')).toHaveClass('text-red-500')
  })
})
