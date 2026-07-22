import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { NotificationsLoadingState } from '@/components/Dashboard/Notifications/NotificationsLoadingState'

describe('NotificationsLoadingState', () => {
  it('renders loading skeleton', () => {
    const { container } = render(<NotificationsLoadingState />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
