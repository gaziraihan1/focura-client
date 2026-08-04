import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/hooks/useProjectFeatures', () => ({
  useProjectSections: vi.fn(),
}))

import { TaskSectionBadge } from '@/components/Dashboard/ProjectDetails/TaskSectionBadge'
import { useProjectSections } from '@/hooks/useProjectFeatures'

const sections = [
  { id: 'sec1', name: 'Frontend', color: '#667eea', status: 'ACTIVE', position: 0, projectId: 'p1' },
]

describe('TaskSectionBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useProjectSections as any).mockReturnValue({ data: sections })
  })

  it('renders the badge when the task belongs to a known section', () => {
    render(<TaskSectionBadge task={{ projectId: 'p1', sectionId: 'sec1' }} />)
    expect(screen.getByText('Frontend')).toBeDefined()
  })

  it('renders nothing when the task has no section', () => {
    render(<TaskSectionBadge task={{ projectId: 'p1', sectionId: null }} />)
    expect(screen.queryByText('Frontend')).toBeNull()
  })

  it('renders nothing when the section no longer exists', () => {
    render(<TaskSectionBadge task={{ projectId: 'p1', sectionId: 'deleted-section' }} />)
    expect(screen.queryByText('Frontend')).toBeNull()
  })
})
