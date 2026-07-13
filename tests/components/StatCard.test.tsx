import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '@/components/Shared/StatCard'

describe('StatCard', () => {
  it('renders label and value', () => {
    render(
      <StatCard
        icon={<span>icon</span>}
        label="Total Tasks"
        value={42}
        accentBg="bg-blue-100"
        accentText="text-blue-600"
      />
    )

    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(
      <StatCard
        icon={<span data-testid="icon">★</span>}
        label="Rating"
        value={5}
        accentBg="bg-green-100"
        accentText="text-green-600"
      />
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('applies accent text class to value', () => {
    render(
      <StatCard
        icon={<span>icon</span>}
        label="Tasks"
        value={10}
        accentBg="bg-red-100"
        accentText="text-red-600"
      />
    )

    const value = screen.getByText('10')
    expect(value).toHaveClass('text-red-600')
  })

  it('applies accent bg class to icon container', () => {
    const { container } = render(
      <StatCard
        icon={<span>icon</span>}
        label="Tasks"
        value={10}
        accentBg="bg-blue-100"
        accentText="text-blue-600"
      />
    )

    const iconContainer = container.querySelector('.bg-blue-100')
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders zero value', () => {
    render(
      <StatCard
        icon={<span>icon</span>}
        label="Empty"
        value={0}
        accentBg="bg-gray-100"
        accentText="text-gray-600"
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
