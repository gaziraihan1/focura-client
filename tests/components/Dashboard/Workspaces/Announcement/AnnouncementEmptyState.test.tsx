import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
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
  }
})

import { AnnouncementEmptyState } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementEmptyState'

describe('AnnouncementEmptyState', () => {
  it('renders empty state message', () => {
    render(<AnnouncementEmptyState />)
    expect(screen.getByText('No announcements yet')).toBeInTheDocument()
    expect(screen.getByText('Workspace announcements will appear here.')).toBeInTheDocument()
  })

  it('renders megaphone icon', () => {
    render(<AnnouncementEmptyState />)
    expect(screen.getByTestId('megaphone-icon')).toBeInTheDocument()
  })
})
