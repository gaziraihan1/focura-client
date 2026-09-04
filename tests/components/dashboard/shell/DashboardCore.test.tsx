import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest';
import { DashboardGreeting } from '@/components/dashboard/home/DashboardGreeting'
import { DashboardHeader } from '@/components/dashboard/shell/DashboardHeader'
import { FocuraTips } from '@/components/dashboard/wellness/FocuraTips'

describe('DashboardGreeting', () => {
  it('renders greeting text', () => {
    render(<DashboardGreeting />)
    const h = new Date().getHours()
    const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
    expect(screen.getByText(new RegExp(greeting))).toBeInTheDocument()
  })

  it('shows user first name when provided', () => {
    render(<DashboardGreeting userName="John Doe" />)
    expect(screen.getByText(/John/)).toBeInTheDocument()
  })

  it('shows date', () => {
    render(<DashboardGreeting />)
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    expect(screen.getByText(dateStr)).toBeInTheDocument()
  })

  it('works without userName', () => {
    render(<DashboardGreeting userName={null} />)
    expect(screen.getByText(/Here's your Gablura hub/)).toBeInTheDocument()
  })
})

describe('DashboardHeader', () => {
  it('renders welcome heading with user first name', () => {
    render(<DashboardHeader userName="John Doe" />)
    expect(screen.getByText(/Welcome back, John/)).toBeInTheDocument()
  })

  it('shows default "User" when no userName', () => {
    render(<DashboardHeader />)
    expect(screen.getByText(/Welcome back, User/)).toBeInTheDocument()
  })

  it('shows subtitle text', () => {
    render(<DashboardHeader />)
    expect(screen.getByText(/happening with your projects today/)).toBeInTheDocument()
  })
})

describe('FocuraTips', () => {
  it('renders heading', () => {
    render(<FocuraTips />)
    expect(screen.getByText('Tips to get more done')).toBeInTheDocument()
  })

  it('shows 4 tips', () => {
    render(<FocuraTips />)
    expect(screen.getByText(/Workspaces = Teams/)).toBeInTheDocument()
    expect(screen.getByText(/Label everything/)).toBeInTheDocument()
    expect(screen.getByText(/Daily tasks reset/)).toBeInTheDocument()
    expect(screen.getByText(/⌘K power move/)).toBeInTheDocument()
  })
})
