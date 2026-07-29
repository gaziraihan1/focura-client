import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FocuraTips } from '@/components/Dashboard/FocuraTips'

describe('FocuraTips', () => {
  it('renders the heading', () => {
    render(<FocuraTips />)
    expect(screen.getByText('Tips to get more done')).toBeInTheDocument()
  })

  it('renders all four tips', () => {
    render(<FocuraTips />)
    expect(screen.getByText(/Workspaces = Teams/)).toBeInTheDocument()
    expect(screen.getByText(/Label everything/)).toBeInTheDocument()
    expect(screen.getByText(/Daily tasks reset/)).toBeInTheDocument()
    expect(screen.getByText(/⌘K power move/)).toBeInTheDocument()
  })

  it('renders tip cards with content', () => {
    const { container } = render(<FocuraTips />)
    const cards = container.querySelectorAll('[class*="rounded-lg"]')
    expect(cards.length).toBeGreaterThanOrEqual(4)
  })

  it('renders tip descriptions', () => {
    render(<FocuraTips />)
    expect(screen.getByText(/Keep teams or clients separate/)).toBeInTheDocument()
    expect(screen.getByText(/Labels and priorities make filtering/)).toBeInTheDocument()
    expect(screen.getByText(/Primary tasks carry over/)).toBeInTheDocument()
    expect(screen.getByText(/Press ⌘K anywhere/)).toBeInTheDocument()
  })
})
