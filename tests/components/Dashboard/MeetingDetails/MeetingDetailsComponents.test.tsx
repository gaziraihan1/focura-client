import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StatusBadge } from '@/components/Dashboard/MeetingDetails/StatusBadge'
import { VisibilityBadge } from '@/components/Dashboard/MeetingDetails/VisibilityBadge'
import { HostChip } from '@/components/Dashboard/MeetingDetails/HostChip'
import { InfoRow } from '@/components/Dashboard/MeetingDetails/InfoRow'
import { DetailCard } from '@/components/Dashboard/MeetingDetails/DetailCard'
import { MeetingDetailsSkeleton } from '@/components/Dashboard/MeetingDetails/MeetingDetailsSkeleton'

vi.mock('next/image', () => ({ default: (p: Record<string, unknown>) => <img alt='' {...p} /> }))
vi.mock('@/utils/meetingDetails.utils', () => ({
  getInitials: (name: string) => name?.charAt(0) || 'U',
  avatarColor: () => 'bg-blue-500',
}))

describe('StatusBadge', () => {
  it('renders "Scheduled" for SCHEDULED status', () => {
    render(<StatusBadge status="SCHEDULED" />)
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
  })

  it('renders "Ongoing" for ONGOING status', () => {
    render(<StatusBadge status="ONGOING" />)
    expect(screen.getByText('Ongoing')).toBeInTheDocument()
  })

  it('renders "Completed" for COMPLETED status', () => {
    render(<StatusBadge status="COMPLETED" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders "Cancelled" for CANCELLED status', () => {
    render(<StatusBadge status="CANCELLED" />)
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
  })
})

describe('VisibilityBadge', () => {
  it('renders "Public" for PUBLIC visibility', () => {
    render(<VisibilityBadge visibility="PUBLIC" />)
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('renders "Private" for PRIVATE visibility', () => {
    render(<VisibilityBadge visibility="PRIVATE" />)
    expect(screen.getByText('Private')).toBeInTheDocument()
  })
})

describe('HostChip', () => {
  it('renders user name', () => {
    render(<HostChip user={{ id: 'u-1', name: 'Jane Smith', email: 'jane@test.com', image: null }} />)
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows "Host" label', () => {
    render(<HostChip user={{ id: 'u-1', name: 'Jane', email: 'jane@test.com', image: null }} />)
    expect(screen.getByText('Host')).toBeInTheDocument()
  })

  it('renders initials when no image', () => {
    render(<HostChip user={{ id: 'u-1', name: 'Jane', email: 'jane@test.com', image: null }} />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })
})

describe('InfoRow', () => {
  it('renders label', () => {
    render(
      <InfoRow icon={({ className }: { className?: string }) => <svg className={className} />} label="Date">
        Jan 1, 2025
      </InfoRow>
    )
    expect(screen.getByText('Date')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <InfoRow icon={({ className }: { className?: string }) => <svg className={className} />} label="Date">
        Jan 1, 2025
      </InfoRow>
    )
    expect(screen.getByText('Jan 1, 2025')).toBeInTheDocument()
  })
})

describe('DetailCard', () => {
  it('renders children content', () => {
    render(<DetailCard><span>Card content</span></DetailCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<DetailCard className="custom-class"><span>Content</span></DetailCard>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('MeetingDetailsSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<MeetingDetailsSkeleton />)
    const skeletonElements = container.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})
