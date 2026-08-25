import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/components/shared/EmptyState'
import { Bell } from 'lucide-react'

vi.mock('lucide-react', () => ({
  Bell: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="bell-icon" {...props} />,
}))

describe('NotificationsEmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState icon={Bell} title="No notifications yet" description="We'll notify you when something important happens" />)
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<EmptyState icon={Bell} title="No notifications yet" description="We'll notify you when something important happens" />)
    expect(screen.getByText(/notify you when something important/)).toBeInTheDocument()
  })
})
