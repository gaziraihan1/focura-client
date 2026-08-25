import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/public/home/Hero'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Hero', () => {
  it('renders badge', () => {
    render(<Hero />)
    expect(screen.getByText(/Built for focused teams/)).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<Hero />)
    expect(screen.getByText('One calm workspace')).toBeInTheDocument()
    expect(screen.getByText('for all your work.')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Hero />)
    expect(screen.getByText(/Focura brings your tasks, projects/)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Hero />)
    expect(screen.getByText('Start for Free')).toBeInTheDocument()
    expect(screen.getByText('Get a Demo')).toBeInTheDocument()
  })

  it('renders stat strip', () => {
    render(<Hero />)
    expect(screen.getByText(/8,000\+/, { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByText(/99.9%/, { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByText(/4.9\/5/, { selector: 'strong' })).toBeInTheDocument()
  })
})
