import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectListItem } from '@/components/Dashboard/AllProjects/ProjectListItem'
import type { ProjectData } from '@/types/project.types'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: any) => <svg data-testid={name} {...props} />
  return {
    Calendar: icon('Calendar'),
    CheckCircle2: icon('CheckCircle2'),
    ChevronRight: icon('ChevronRight'),
    Building2: icon('Building2'),
  }
})

vi.mock('@/components/Dashboard/Projects/WorkspaceProjects/AceessDeniedModal', () => ({
  AccessDeniedModal: () => <div data-testid="AccessDeniedModal" />,
}))

vi.mock('@/utils/project.utils', () => ({
  getPriorityColor: () => 'text-yellow-500',
  getStatusColor: () => 'bg-green-500',
}))

const baseProject: ProjectData = {
  id: 'p1',
  name: 'Test Project',
  description: 'A project description',
  status: 'ACTIVE',
  priority: 'HIGH',
  color: '#ff0000',
  icon: null,
  dueDate: null,
  _count: { tasks: 5 },
  workspace: { id: 'w1', name: 'Workspace A' },
} as any

const defaults = {
  project: baseProject,
  index: 0,
  onNavigate: vi.fn(),
  showModal: false,
  onCloseModal: vi.fn(),
}

describe('ProjectListItem', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders project name', () => {
    render(<ProjectListItem {...defaults} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('calls onNavigate when clicked', () => {
    render(<ProjectListItem {...defaults} />)
    fireEvent.click(screen.getByText('Test Project'))
    expect(defaults.onNavigate).toHaveBeenCalled()
  })

  it('renders description', () => {
    render(<ProjectListItem {...defaults} />)
    expect(screen.getByText('A project description')).toBeInTheDocument()
  })

  it('shows AccessDeniedModal when showModal is true', () => {
    render(<ProjectListItem {...defaults} showModal={true} />)
    expect(screen.getByTestId('AccessDeniedModal')).toBeInTheDocument()
  })
})
