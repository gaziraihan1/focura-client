import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutHero } from '@/components/About/AboutHero'
import { AboutCTA } from '@/components/About/AboutCTA'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('AboutHero', () => {
  it('renders version badge', () => {
    render(<AboutHero />)
    expect(screen.getByText(/v1.0.0 Stable/)).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<AboutHero />)
    expect(screen.getByText('Focus Smarter.')).toBeInTheDocument()
    expect(screen.getByText('Ship Together.')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<AboutHero />)
    expect(screen.getByText(/Focura helps teams turn scattered tasks/)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<AboutHero />)
    expect(screen.getByText('Try Focura Live')).toBeInTheDocument()
    expect(screen.getByText('View on GitHub')).toBeInTheDocument()
  })

  it('renders stat pills', () => {
    render(<AboutHero />)
    expect(screen.getByText('Source Available')).toBeInTheDocument()
    expect(screen.getByText('107+')).toBeInTheDocument()
    expect(screen.getByText('Vercel Edge')).toBeInTheDocument()
  })
})

describe('AboutCTA', () => {
  it('renders ready to focus heading', () => {
    render(<AboutCTA />)
    expect(screen.getByText('Ready to focus?')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<AboutCTA />)
    expect(screen.getByText(/Start a free workspace on Focura today/)).toBeInTheDocument()
  })

  it('renders start for free button', () => {
    render(<AboutCTA />)
    expect(screen.getByText('Start for Free')).toBeInTheDocument()
  })

  it('renders secondary links', () => {
    render(<AboutCTA />)
    expect(screen.getByText('View Source')).toBeInTheDocument()
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })
})
