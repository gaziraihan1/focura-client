import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '@/components/Dashboard/CalendarView/StatCard'

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="mock-icon" {...props} />

describe('CalendarView StatCard', () => {
  it('renders label and value', () => {
    render(
      <StatCard icon={<MockIcon />} label="Total Tasks" value={10} color="text-blue-500" />
    )
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders zero value', () => {
    render(
      <StatCard icon={<MockIcon />} label="Empty" value={0} color="text-gray-500" />
    )
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
