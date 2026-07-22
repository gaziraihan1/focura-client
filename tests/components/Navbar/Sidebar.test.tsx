import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '@/components/Dashboard/Sidebar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

vi.mock('lucide-react', () => ({
  LayoutDashboard: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="layout-icon" {...props} />,
  CheckSquare: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-icon" {...props} />,
  FolderOpen: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="folder-icon" {...props} />,
  Users: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="users-icon" {...props} />,
  Calendar: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="calendar-icon" {...props} />,
  Settings: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="settings-icon" {...props} />,
  HelpCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="help-icon" {...props} />,
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="chevron-icon" {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  Box: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="box-icon" {...props} />,
  Activity: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="activity-icon" {...props} />,
}))

describe('Sidebar', () => {
  it('renders when isOpen is true', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Focura')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Sidebar isOpen={true} onClose={onClose} />)

    const closeButton = screen.getByTestId('x-icon').closest('button')
    fireEvent.click(closeButton!)
    expect(onClose).toHaveBeenCalled()
  })

  it('toggles expandable sections', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />)

    // Tasks section should be expandable
    const tasksButton = screen.getByText('Tasks').closest('button')
    fireEvent.click(tasksButton!)

    // Should show child items
    expect(screen.getByText('All Tasks')).toBeInTheDocument()
  })
})
