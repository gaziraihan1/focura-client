import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AccessDeniedProject } from '@/components/Dashboard/ProjectDetails/AccessDeniedProject'

vi.mock('lucide-react', () => ({
  ShieldX: (props: any) => <svg data-testid="shield-icon" {...props} />,
  ArrowLeft: (props: any) => <svg {...props} />,
  Home: (props: any) => <svg {...props} />,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
}))

describe('AccessDeniedProject', () => {
  it('renders access denied message', () => {
    render(<AccessDeniedProject />)
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('renders permission message', () => {
    render(<AccessDeniedProject />)
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })

  it('renders project name when provided', () => {
    render(<AccessDeniedProject projectName="My Project" />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })

  it('renders workspace name when provided', () => {
    render(<AccessDeniedProject workspaceName="My Workspace" />)
    expect(screen.getByText('My Workspace')).toBeInTheDocument()
  })

  it('renders go back button', () => {
    render(<AccessDeniedProject />)
    expect(screen.getByText('Go Back')).toBeInTheDocument()
  })

  it('renders go to dashboard button', () => {
    render(<AccessDeniedProject />)
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument()
  })

  it('renders contact support link', () => {
    render(<AccessDeniedProject />)
    expect(screen.getByText('Contact Support')).toBeInTheDocument()
  })

  it('renders shield icon', () => {
    render(<AccessDeniedProject />)
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
  })

  it('does not render project/workspace section when neither provided', () => {
    render(<AccessDeniedProject />)
    expect(screen.queryByText(/Project:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Workspace:/)).not.toBeInTheDocument()
  })
})
