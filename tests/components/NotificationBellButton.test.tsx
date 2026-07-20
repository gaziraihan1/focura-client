import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationBellButton } from '@/components/Notifications/NotificationBellButton'

vi.mock('lucide-react', () => ({
  Bell: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="bell-icon" {...props} />,
}))

describe('NotificationBellButton', () => {
  it('renders bell icon', () => {
    render(<NotificationBellButton onClick={vi.fn()} />)
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<NotificationBellButton onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows badge when provided', () => {
    render(<NotificationBellButton badge={5} onClick={vi.fn()} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows badge value directly', () => {
    render(<NotificationBellButton badge={15} onClick={vi.fn()} />)
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('does not show badge when null', () => {
    render(<NotificationBellButton badge={null} onClick={vi.fn()} />)
    expect(screen.queryByText(/\d/)).not.toBeInTheDocument()
  })
})
