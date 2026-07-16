import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingState } from '@/components/Dashboard/Calendar/LoadingStateCalendar'

describe('LoadingStateCalendar', () => {
  it('renders loading spinner', () => {
    render(<LoadingState />)
    const spinner = screen.getByText('Loading calendar...').previousElementSibling
    expect(spinner).toHaveClass('animate-spin')
  })

  it('renders loading text', () => {
    render(<LoadingState />)
    expect(screen.getByText('Loading calendar...')).toBeInTheDocument()
  })
})
