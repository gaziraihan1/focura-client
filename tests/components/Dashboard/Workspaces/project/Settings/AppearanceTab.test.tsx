import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppearanceTab } from '@/components/Dashboard/Workspaces/project/Settings/AppearanceTab'

vi.mock('lucide-react', () => ({
  Check: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader" {...props} />,
  Palette: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="palette" {...props} />,
}))

vi.mock('@/hooks/useProjects', () => ({
  useUpdateProject: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
  }),
}))

const mockProject = {
  id: 'proj-1',
  slug: 'test-proj',
  name: 'Test Project',
  color: '#667eea',
  status: 'ACTIVE',
  priority: 'MEDIUM',
  createdAt: '2025-01-01',
  members: [],
  _count: { tasks: 0 },
  isAdmin: true,
}

describe('AppearanceTab', () => {
  it('renders the Project Color heading', () => {
    render(<AppearanceTab project={mockProject as any as Record<string, unknown>} canManage={true} />)
    expect(screen.getByText('Project Color')).toBeInTheDocument()
  })

  it('shows the project preview name', () => {
    render(<AppearanceTab project={mockProject as any as Record<string, unknown>} canManage={true} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('shows the default hex color', () => {
    render(<AppearanceTab project={mockProject as any as Record<string, unknown>} canManage={true} />)
    expect(screen.getByText('#667eea')).toBeInTheDocument()
  })

  it('shows the Apply Color button when canManage is true', () => {
    render(<AppearanceTab project={mockProject as any as Record<string, unknown>} canManage={true} />)
    expect(screen.getByText('Apply Color')).toBeInTheDocument()
  })
})
