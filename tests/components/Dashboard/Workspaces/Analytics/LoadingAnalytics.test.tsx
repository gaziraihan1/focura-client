import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('lucide-react', () => {
  const React = require('react')
  const mock = (name: string) => {
    const Cmp = (props: any) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Loader2: mock('loader2'),
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
})
