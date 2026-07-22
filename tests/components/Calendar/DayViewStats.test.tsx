import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DayViewStats } from '@/components/Dashboard/CalendarView/CalendarDayView/DayViewStats'

const mockTasks = [
  { id: '1', assignees: [] },
  { id: '2', assignees: [{ user: { id: 'u1' } }] },
  { id: '3', assignees: [] },
] as any[]

describe('DayViewStats', () => {
  it('renders total tasks count', () => {
    render(<DayViewStats tasks={mockTasks} totalEstimatedHours={12} />)
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders estimated hours', () => {
    render(<DayViewStats tasks={mockTasks} totalEstimatedHours={12} />)
    expect(screen.getByText('Estimated Hours')).toBeInTheDocument()
    expect(screen.getByText('12h')).toBeInTheDocument()
  })

  it('renders personal tasks count', () => {
    render(<DayViewStats tasks={mockTasks} totalEstimatedHours={12} />)
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders team tasks count', () => {
    render(<DayViewStats tasks={mockTasks} totalEstimatedHours={12} />)
    expect(screen.getByText('Team')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
