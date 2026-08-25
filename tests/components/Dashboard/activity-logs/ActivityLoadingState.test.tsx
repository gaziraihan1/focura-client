import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ActivityLoadingState } from '@/components/dashboard/activity-logs/ActivityLoadingState'

describe('ActivityLoadingState', () => {
  it('renders loading spinner', () => {
    const { container } = render(<ActivityLoadingState />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
