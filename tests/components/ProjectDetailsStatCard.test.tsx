import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '@/components/Dashboard/ProjectDetails/StatCard'

const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />

describe('ProjectDetails StatCard', () => {
  it('renders label and value', () => {
    render(
      <StatCard
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
        icon={MockIcon}
        label="Test"
        value={0}
        color="text-red-500"
      />
    )
    expect(screen.getByTestId('mock-icon')).toHaveClass('text-red-500')
  })
})
