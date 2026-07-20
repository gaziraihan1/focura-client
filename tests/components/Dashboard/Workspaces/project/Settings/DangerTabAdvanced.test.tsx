import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DangerTab } from '@/components/Dashboard/Workspaces/project/Settings/DangerTab'
import { createWrapper } from '@/tests/utils/renderWithProviders'

vi.mock('framer-motion', () => ({
  motion: { div: (p: any) => <div {...p} /> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('DangerTab', () => {
  it('renders danger zone heading', () => {
    render(<DangerTab project={{}} canDelete={true} onDeleteProject={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText(/danger zone/i)).toBeInTheDocument()
  })

  it('shows no permission message when cannot delete', () => {
    render(<DangerTab project={{}} canDelete={false} onDeleteProject={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.getByText(/don't have permission/i)).toBeInTheDocument()
  })
})
