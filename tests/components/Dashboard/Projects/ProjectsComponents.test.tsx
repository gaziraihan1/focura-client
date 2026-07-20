import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectsErrorState } from '@/components/Dashboard/Projects/ProjectsErrorState'

vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

describe('ProjectsErrorState', () => {
  it('renders error message', () => {
    render(<ProjectsErrorState />)
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
