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
    Menu: mock('menu'),
    ChevronLeft: mock('chevron-left'),
  }
})

import { MobileTopBar } from '@/components/Dashboard/Workspaces/project/Layout/MobileTopBar'

describe('MobileTopBar', () => {
  const defaultProps = {
    projectName: 'Test Project',
    currentLabel: 'Tasks',
    projectColor: '#3b82f6',
    onOpen: vi.fn(),
  }

  it('renders project name', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders current label with separator', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('renders menu button', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument()
  })

  it('calls onOpen when menu button clicked', () => {
    render(<MobileTopBar {...defaultProps} />)
    fireEvent.click(screen.getByTestId('menu-icon').closest('button')!)
    expect(defaultProps.onOpen).toHaveBeenCalledTimes(1)
  })

  it('shows first letter of project name in color swatch', () => {
    render(<MobileTopBar {...defaultProps} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders fallback when projectName is undefined', () => {
    render(<MobileTopBar {...defaultProps} projectName={undefined} />)
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('hides currentLabel when undefined', () => {
    render(<MobileTopBar {...defaultProps} currentLabel={undefined} />)
    expect(screen.queryByText('/')).not.toBeInTheDocument()
  })
})
