import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('date-fns', () => ({
  format: (date: any, fmt: string) => `2024-01-15`,
}))

import WorkspaceInformation from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceInformation'

describe('WorkspaceInformation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Information heading', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('Information')).toBeInTheDocument()
  })

  it('renders owner name when provided', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders email when name is null', () => {
    render(<WorkspaceInformation name={null} email="john@test.com" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
  })

  it('renders name over email when both provided', () => {
    render(<WorkspaceInformation name="John Doe" email="john@test.com" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders created date', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('shows Public visibility when isPublic is true', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('Public')).toBeInTheDocument()
  })

  it('shows Private visibility when isPublic is false', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={false} />)
    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  it('renders label texts', () => {
    render(<WorkspaceInformation name="John Doe" createdAt="2024-01-15T00:00:00Z" isPublic={true} />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Visibility')).toBeInTheDocument()
  })

  it('renders Owner label with label key elements', () => {
    const { container } = render(<WorkspaceInformation name="Jane" createdAt="2024-01-15T00:00:00Z" isPublic={false} />)
    const spans = container.querySelectorAll('span')
    const labelTexts = Array.from(spans).map(s => s.textContent)
    expect(labelTexts).toContain('Owner')
    expect(labelTexts).toContain('Created')
    expect(labelTexts).toContain('Visibility')
  })
})
