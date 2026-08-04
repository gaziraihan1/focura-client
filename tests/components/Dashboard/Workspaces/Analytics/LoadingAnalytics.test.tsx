import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('lucide-react', () => {

  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Loader2: mock('loader2'),
    BarChart3: mock('bar-chart3'),
  }
})

import LoadingAnalytics from '@/components/Dashboard/Workspaces/Analytics/LoadingAnalytics'

describe('LoadingAnalytics', () => {
  it('renders loading message', () => {
    render(<LoadingAnalytics />)
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument()
  })

  it('renders loader icon', () => {
    render(<LoadingAnalytics />)
    expect(screen.getByTestId('loader2-icon')).toBeInTheDocument()
  })

  it('renders analytics icon', () => {
    render(<LoadingAnalytics />)
    expect(screen.getByTestId('bar-chart3-icon')).toBeInTheDocument()
  })

  it('is labelled for screen readers', () => {
    render(<LoadingAnalytics />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
