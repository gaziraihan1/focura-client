import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalendarSkeleton } from '@/components/Dashboard/Calendar/CalendarSkeleton'

describe('CalendarSkeleton', () => {
  it('renders with loading status role', () => {
    render(<CalendarSkeleton />)
    const statusElement = screen.getByRole('status')
    expect(statusElement).toBeInTheDocument()
  })

  it('has correct aria-label for loading state', () => {
    render(<CalendarSkeleton />)
    const statusElement = screen.getByRole('status')
    expect(statusElement).toHaveAttribute('aria-label', 'Loading calendar')
  })

  it('renders screen reader text for loading', () => {
    render(<CalendarSkeleton />)
    expect(screen.getByText('Loading calendar data...')).toBeInTheDocument()
  })

  it('renders 7 day header placeholders', () => {
    render(<CalendarSkeleton />)
    // The day headers are in the first grid
    const headerGrid = screen.getByRole('status').querySelector('.grid.grid-cols-7')
    expect(headerGrid).toBeInTheDocument()
    // Should have 7 placeholder divs in the header row
    const headerCells = headerGrid?.querySelectorAll('.p-4.text-center')
    expect(headerCells).toHaveLength(7)
  })

  it('renders 35 calendar cell placeholders', () => {
    render(<CalendarSkeleton />)
    // 35 cells = 5 weeks x 7 days
    const cells = screen.getByRole('status').querySelectorAll('.min-h-30')
    expect(cells).toHaveLength(35)
  })

  it('has animate-pulse class for loading animation', () => {
    render(<CalendarSkeleton />)
    const container = screen.getByRole('status')
    expect(container).toHaveClass('animate-pulse')
  })

  it('renders header skeleton with title and controls placeholders', () => {
    render(<CalendarSkeleton />)
    const container = screen.getByRole('status')

    // Title placeholder (h-8 w-48)
    const titlePlaceholder = container.querySelector('.h-8.w-48')
    expect(titlePlaceholder).toBeInTheDocument()

    // Subtitle placeholder (h-4 w-64)
    const subtitlePlaceholder = container.querySelector('.h-4.w-64')
    expect(subtitlePlaceholder).toBeInTheDocument()

    // Control buttons placeholders
    const controlPlaceholders = container.querySelectorAll('.h-9.w-24, .h-9.w-32')
    expect(controlPlaceholders.length).toBe(2)
  })

  it('renders grid structure with proper styling', () => {
    render(<CalendarSkeleton />)
    const container = screen.getByRole('status')

    // Main grid container
    const gridContainer = container.querySelector('.bg-card.border.border-border.rounded-2xl')
    expect(gridContainer).toBeInTheDocument()

    // Day headers grid
    const headerGrid = container.querySelector('.grid.grid-cols-7.border-b')
    expect(headerGrid).toBeInTheDocument()

    // Calendar cells grid
    const cellsGrid = container.querySelector('.grid.grid-cols-7:not(.border-b)')
    expect(cellsGrid).toBeInTheDocument()
  })
})
