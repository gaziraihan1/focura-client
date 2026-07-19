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
    ChevronLeft: mock('chevron-left'),
  }
})

import { SidebarContent } from '@/components/Dashboard/Workspaces/project/Layout/SidebarContent'

describe('SidebarContent', () => {
  const defaultProps = {
    nav: [
      {
        label: 'Overview',
        href: '/overview',
        icon: (props: any) => <svg data-testid="overview-icon" {...props} />,
        match: (p: string) => p === '/overview',
      },
      {
        label: 'Tasks',
        href: '/tasks',
        icon: (props: any) => <svg data-testid="tasks-icon" {...props} />,
        match: (p: string) => p.includes('/tasks'),
        badge: '5',
      },
    ],
    pathname: '/dashboard/workspaces/ws/projects/proj/tasks',
    projectName: 'Test Project',
    projectColor: '#3b82f6',
    workspaceSlug: 'ws',
  }

  it('renders project name', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders project initial in color swatch', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders "All Projects" back link', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('All Projects')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
  })

  it('shows badge when present', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders "Project Workspace" footer', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Project Workspace')).toBeInTheDocument()
  })

  it('shows loading skeleton when projectName is undefined', () => {
    render(<SidebarContent {...defaultProps} projectName={undefined} />)
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('calls onNavClick when nav item clicked', () => {
    const onNavClick = vi.fn()
    render(<SidebarContent {...defaultProps} onNavClick={onNavClick} />)
    fireEvent.click(screen.getByText('Tasks'))
    expect(onNavClick).toHaveBeenCalledTimes(1)
  })

  it('renders menu label', () => {
    render(<SidebarContent {...defaultProps} />)
    expect(screen.getByText('Menu')).toBeInTheDocument()
  })
})
