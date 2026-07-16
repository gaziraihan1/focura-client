import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityEmptyState } from '@/components/Dashboard/ActivityLogs/ActivityEmptyState'

describe('ActivityEmptyState', () => {
  it('renders empty state message', () => {
    render(<ActivityEmptyState />)
    expect(screen.getByText('No activities found')).toBeInTheDocument()
  })
})
