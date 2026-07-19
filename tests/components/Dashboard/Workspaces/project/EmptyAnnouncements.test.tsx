import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard/workspaces/test-ws/projects/test-proj/tasks',
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('lucide-react', () => {
  const React = require('react')
  const mock = (name: string) => {
    const Cmp = (props: any) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    Megaphone: mock('megaphone'),
    Plus: mock('plus'),
  }
})

import { EmptyAnnouncements } from '@/components/Dashboard/Workspaces/project/Announcements/EmptyAnnouncements'

describe('EmptyAnnouncements', () => {
  it('shows "No announcements yet" when not filtered and no announcements', () => {
    render(<EmptyAnnouncements filtered={false} canManage={false} onNew={vi.fn()} />)
    expect(screen.getByText('No announcements yet')).toBeInTheDocument()
  })

  it('shows "No matching announcements" when filtered', () => {
    render(<EmptyAnnouncements filtered={true} canManage={true} onNew={vi.fn()} />)
    expect(screen.getByText('No matching announcements')).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting your search/)).toBeInTheDocument()
  })

  it('shows create button when canManage and not filtered', () => {
    const onNew = vi.fn()
    render(<EmptyAnnouncements filtered={false} canManage={true} onNew={onNew} />)
    expect(screen.getByText('Create Announcement')).toBeInTheDocument()
  })

  it('calls onNew when create button clicked', () => {
    const onNew = vi.fn()
    render(<EmptyAnnouncements filtered={false} canManage={true} onNew={onNew} />)
    fireEvent.click(screen.getByText('Create Announcement'))
    expect(onNew).toHaveBeenCalledTimes(1)
  })

  it('hides create button when cannot manage', () => {
    render(<EmptyAnnouncements filtered={false} canManage={false} onNew={vi.fn()} />)
    expect(screen.queryByText('Create Announcement')).not.toBeInTheDocument()
  })

  it('hides create button when filtered', () => {
    render(<EmptyAnnouncements filtered={true} canManage={true} onNew={vi.fn()} />)
    expect(screen.queryByText('Create Announcement')).not.toBeInTheDocument()
  })

  it('shows correct message for non-managers with no announcements', () => {
    render(<EmptyAnnouncements filtered={false} canManage={false} onNew={vi.fn()} />)
    expect(screen.getByText('There are no announcements in this project yet.')).toBeInTheDocument()
  })

  it('shows correct message for managers with no announcements', () => {
    render(<EmptyAnnouncements filtered={false} canManage={true} onNew={vi.fn()} />)
    expect(screen.getByText('Create the first announcement to keep your team informed.')).toBeInTheDocument()
  })
})
