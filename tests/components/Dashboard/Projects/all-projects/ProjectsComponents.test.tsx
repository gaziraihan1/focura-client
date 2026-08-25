import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectsErrorState } from '@/components/dashboard/projects/all-projects/ProjectsErrorState'

vi.mock('framer-motion', () => ({
  m: { div: (p: Record<string, unknown>) => <div {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

describe('ProjectsErrorState', () => {
  it('renders error message', () => {
    render(<ProjectsErrorState />)
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
