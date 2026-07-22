import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationsEmptyState } from '@/components/Dashboard/Notifications/NotificationsEmptyState'

vi.mock('lucide-react', () => ({
  Bell: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

describe('NotificationsEmptyState', () => {
  it('renders empty state message', () => {
    render(<NotificationsEmptyState />)
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<NotificationsEmptyState />)
    expect(screen.getByText(/notify you when something important/)).toBeInTheDocument()
  })
})
