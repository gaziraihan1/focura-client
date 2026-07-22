import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardGreeting } from '@/components/Dashboard/DashboardGreeting'

describe('DashboardGreeting', () => {
  it('renders greeting with user name', () => {
    render(<DashboardGreeting userName="Alice" />)
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
  })

  it('renders greeting message', () => {
    render(<DashboardGreeting userName="Alice" />)
    expect(screen.getByText(/Good/)).toBeInTheDocument()
  })
})
