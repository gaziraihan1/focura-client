import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Home/Hero'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Hero', () => {
  it('renders badge', () => {
    render(<Hero />)
    expect(screen.getByText(/Built for fast-moving teams/)).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<Hero />)
    expect(screen.getByText('One tool to manage')).toBeInTheDocument()
    expect(screen.getByText('workflows and your team')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Hero />)
    expect(screen.getByText(/Focura helps teams plan, collaborate/)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Hero />)
    expect(screen.getByText('Start for Free')).toBeInTheDocument()
    expect(screen.getByText('Get a Demo')).toBeInTheDocument()
  })

  it('renders trust badge', () => {
    render(<Hero />)
    expect(screen.getByText(/More than.*people Trust us/)).toBeInTheDocument()
  })
})
