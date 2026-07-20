import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => {
  const React = require('react')
  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
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
