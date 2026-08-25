import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionBadge } from '@/components/dashboard/projects/project-details/SectionBadge'

describe('SectionBadge', () => {
  it('renders the section name', () => {
    render(<SectionBadge name="Frontend" color="#667eea" />)
    expect(screen.getByText('Frontend')).toBeDefined()
  })

  it('applies the section color to the dot', () => {
    render(<SectionBadge name="Backend" color="#10b981" />)
    const dot = document.querySelector('span.rounded-full span')
    expect(dot).toBeTruthy()
    expect((dot as HTMLElement).style.backgroundColor).toBe('rgb(16, 185, 129)')
  })

  it('falls back to the default color when none is provided', () => {
    render(<SectionBadge name="Design" />)
    const dot = document.querySelector('span.rounded-full span')
    expect((dot as HTMLElement).style.backgroundColor).toBe('rgb(102, 126, 234)')
  })
})
