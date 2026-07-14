import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FooterMain from '@/components/Footer/FooterMain'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('FooterMain', () => {
  it('renders Focura brand name', () => {
    render(<FooterMain />)
    expect(screen.getByText('Focura')).toBeInTheDocument()
  })

  it('renders brand description', () => {
    render(<FooterMain />)
    expect(screen.getByText(/The simplest way to manage workflows/)).toBeInTheDocument()
  })

  it('renders Company section', () => {
    render(<FooterMain />)
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Careers')).toBeInTheDocument()
    expect(screen.getByText('Roadmap')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders Resources section', () => {
    render(<FooterMain />)
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Help Center')).toBeInTheDocument()
    expect(screen.getByText('Guides')).toBeInTheDocument()
    expect(screen.getByText('Developer Guides')).toBeInTheDocument()
    expect(screen.getByText('API Docs')).toBeInTheDocument()
    expect(screen.getByText('Templates')).toBeInTheDocument()
  })

  it('renders Legal section', () => {
    render(<FooterMain />)
    expect(screen.getByText('Legal')).toBeInTheDocument()
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Refund Policy')).toBeInTheDocument()
    expect(screen.getByText('Cookies')).toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    render(<FooterMain />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(`© ${year} Focura`))).toBeInTheDocument()
  })

  it('renders footer links with correct hrefs', () => {
    render(<FooterMain />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink).toHaveAttribute('href', '/about')
  })
})
