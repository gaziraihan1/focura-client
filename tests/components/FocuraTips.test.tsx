import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FocuraTips } from '@/components/Dashboard/FocuraTips'

describe('FocuraTips', () => {
  it('renders the heading', () => {
    render(<FocuraTips />)

    expect(screen.getByText('Getting the most out of Focura')).toBeInTheDocument()
  })

  it('renders all four tips', () => {
    render(<FocuraTips />)

    expect(screen.getByText(/Use workspaces to separate teams/)).toBeInTheDocument()
    expect(screen.getByText(/Labels and priorities make filtering fast/)).toBeInTheDocument()
    expect(screen.getByText(/Daily tasks auto-refresh each morning/)).toBeInTheDocument()
    expect(screen.getByText(/Press ⌘K anywhere to switch/)).toBeInTheDocument()
  })

  it('renders colored dots for each tip', () => {
    const { container } = render(<FocuraTips />)

    const dots = container.querySelectorAll('.rounded-full')
    expect(dots.length).toBeGreaterThanOrEqual(4)
  })

  it('renders tip text in muted color', () => {
    render(<FocuraTips />)

    const tips = screen.getAllByText(/./)
    const tipTexts = tips.filter(el => el.className.includes('text-muted-foreground'))
    expect(tipTexts.length).toBeGreaterThanOrEqual(4)
  })
})
