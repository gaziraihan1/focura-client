import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityErrorState } from '@/components/Dashboard/ActivityLogs/ActivityErrorState'

describe('ActivityErrorState', () => {
  it('renders error message', () => {
    render(<ActivityErrorState />)
    expect(screen.getByText('Failed to load activities. Please try again.')).toBeInTheDocument()
  })
})
