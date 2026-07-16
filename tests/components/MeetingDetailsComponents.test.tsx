import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/Dashboard/MeetingDetails/StatusBadge'
import { VisibilityBadge } from '@/components/Dashboard/MeetingDetails/VisibilityBadge'
import { InfoRow } from '@/components/Dashboard/MeetingDetails/InfoRow'
import { DetailCard } from '@/components/Dashboard/MeetingDetails/DetailCard'
import { MeetingDetailsSkeleton } from '@/components/Dashboard/MeetingDetails/MeetingDetailsSkeleton'
import { HostChip } from '@/components/Dashboard/MeetingDetails/HostChip'
import { AttendeeAvatar } from '@/components/Dashboard/MeetingDetails/AttendeeAvatar'

vi.mock('lucide-react', () => ({
  CalendarClock: (props: any) => <svg data-testid="calendar-clock-icon" {...props} />,
  CheckCircle2: (props: any) => <svg data-testid="check-circle-icon" {...props} />,
  Radio: (props: any) => <svg data-testid="radio-icon" {...props} />,
  XCircle: (props: any) => <svg data-testid="x-circle-icon" {...props} />,
  Globe: (props: any) => <svg data-testid="globe-icon" {...props} />,
  Lock: (props: any) => <svg data-testid="lock-icon" {...props} />,
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img data-testid="next-image" {...props} />,
}))

vi.mock('@/utils/meetingDetails.utils', () => ({
  getInitials: (name: string) => (name ? name.charAt(0).toUpperCase() : '?'),
  avatarColor: () => 'bg-blue-500 text-white',
  formatTime: (date: string) => '2:30 PM',
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

describe('StatusBadge', () => {
  it('renders Scheduled badge', () => {
    render(<StatusBadge status="SCHEDULED" />)
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
  })

  it('renders Ongoing badge', () => {
    render(<StatusBadge status="ONGOING" />)
    expect(screen.getByText('Ongoing')).toBeInTheDocument()
  })

  it('renders Completed badge', () => {
    render(<StatusBadge status="COMPLETED" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders Cancelled badge', () => {
    render(<StatusBadge status="CANCELLED" />)
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
  })
})

describe('VisibilityBadge', () => {
  it('renders Public badge', () => {
    render(<VisibilityBadge visibility="PUBLIC" />)
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('renders Private badge', () => {
    render(<VisibilityBadge visibility="PRIVATE" />)
    expect(screen.getByText('Private')).toBeInTheDocument()
  })
})

describe('InfoRow', () => {
  it('renders label and children', () => {
    render(
      <InfoRow icon={(props: any) => <svg data-testid="test-icon" {...props} />} label="Date">
        January 15, 2026
      </InfoRow>
    )
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('January 15, 2026')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(
      <InfoRow icon={(props: any) => <svg data-testid="test-icon" {...props} />} label="Time">
        2:00 PM
      </InfoRow>
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })
})

describe('DetailCard', () => {
  it('renders children', () => {
    render(<DetailCard><p>Card content</p></DetailCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<DetailCard className="custom-class"><p>Content</p></DetailCard>)
    expect(container.firstChild).toHaveAttribute('class')
  })
})

describe('MeetingDetailsSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<MeetingDetailsSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('HostChip', () => {
  it('renders user name', () => {
    render(<HostChip user={{ id: 'u1', name: 'Alice', email: 'alice@test.com', image: null }} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders Host label', () => {
    render(<HostChip user={{ id: 'u1', name: 'Alice', email: 'alice@test.com', image: null }} />)
    expect(screen.getByText('Host')).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(<HostChip user={{ id: 'u1', name: 'Alice', email: 'alice@test.com', image: '/avatar.png' }} />)
    expect(screen.getByTestId('next-image')).toBeInTheDocument()
  })

  it('renders initials when no image', () => {
    render(<HostChip user={{ id: 'u1', name: 'Alice', email: 'alice@test.com', image: null }} />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('falls back to email when name is null', () => {
    render(<HostChip user={{ id: 'u1', name: null, email: 'alice@test.com', image: null }} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
  })
})

describe('AttendeeAvatar', () => {
  it('renders user name', () => {
    render(<AttendeeAvatar user={{ id: 'u1', name: 'Bob', email: 'bob@test.com', image: null }} joinedAt="2026-01-15T14:30:00Z" />)
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders user email', () => {
    render(<AttendeeAvatar user={{ id: 'u1', name: 'Bob', email: 'bob@test.com', image: null }} joinedAt="2026-01-15T14:30:00Z" />)
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
  })

  it('renders joined time', () => {
    render(<AttendeeAvatar user={{ id: 'u1', name: 'Bob', email: 'bob@test.com', image: null }} joinedAt="2026-01-15T14:30:00Z" />)
    expect(screen.getByText(/Joined/)).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(<AttendeeAvatar user={{ id: 'u1', name: 'Bob', email: 'bob@test.com', image: '/avatar.png' }} joinedAt="2026-01-15T14:30:00Z" />)
    expect(screen.getByTestId('next-image')).toBeInTheDocument()
  })

  it('renders initials when no image', () => {
    render(<AttendeeAvatar user={{ id: 'u1', name: 'Bob', email: 'bob@test.com', image: null }} joinedAt="2026-01-15T14:30:00Z" />)
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})
