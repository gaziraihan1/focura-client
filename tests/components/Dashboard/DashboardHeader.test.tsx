import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader'

describe('DashboardHeader', () => {
  it('renders greeting with user first name', () => {
    render(<DashboardHeader userName="John Doe" />)

    expect(screen.getByText(/Welcome back, John!/)).toBeInTheDocument()
  })

  it('uses full name as first name when no space', () => {
    render(<DashboardHeader userName="Alice" />)

    expect(screen.getByText(/Welcome back, Alice!/)).toBeInTheDocument()
  })

  it('defaults to "User" when name is null', () => {
    render(<DashboardHeader userName={null} />)

    expect(screen.getByText(/Welcome back, User!/)).toBeInTheDocument()
  })

  it('defaults to "User" when name is undefined', () => {
    render(<DashboardHeader />)

    expect(screen.getByText(/Welcome back, User!/)).toBeInTheDocument()
  })

  it('renders subtitle text', () => {
    render(<DashboardHeader userName="Test" />)

    expect(screen.getByText(/Here's what's happening with your projects today/)).toBeInTheDocument()
  })

  it('extracts first name correctly with multiple spaces', () => {
    render(<DashboardHeader userName="Mary Jane Watson" />)

    expect(screen.getByText(/Welcome back, Mary!/)).toBeInTheDocument()
  })
})
