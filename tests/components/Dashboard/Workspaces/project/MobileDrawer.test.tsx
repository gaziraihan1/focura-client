import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard/workspaces/test-ws/projects/test-proj/tasks',
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('lucide-react', () => {

  const mock = (name: string) => {
    const Cmp = (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': `${name}-icon`, ...props })
    Cmp.displayName = name
    return Cmp
  }
  return {
    X: mock('x'),
    ChevronLeft: mock('chevron-left'),
  }
})

import { MobileDrawer } from '@/components/Dashboard/Workspaces/project/Layout/MobileDrawer'

describe('MobileDrawer', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    nav: [
      {
        label: 'Tasks',
        href: '/tasks',
        icon: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="tasks-icon" {...props} />,
        match: (p: string) => p.includes('/tasks'),
      },
    ],
    pathname: '/dashboard/workspaces/ws/projects/proj/tasks',
    projectName: 'Test Project',
    projectColor: '#3b82f6',
    workspaceSlug: 'ws',
  }

  it('renders when open', () => {
    render(<MobileDrawer {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    render(<MobileDrawer {...defaultProps} />)
    const closeBtn = screen.getByTestId('x-icon').closest('button')!
    fireEvent.click(closeBtn)
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop clicked', () => {
    const { container } = render(<MobileDrawer {...defaultProps} />)
    const backdrop = container.querySelector('.fixed.inset-0')
    fireEvent.click(backdrop!)
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('renders navigation items', () => {
    render(<MobileDrawer {...defaultProps} />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('shows "All Projects" back link', () => {
    render(<MobileDrawer {...defaultProps} />)
    expect(screen.getByText('All Projects')).toBeInTheDocument()
  })
})
