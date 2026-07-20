import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'

vi.mock('framer-motion', () => ({
  motion: { div: (p: Record<string, unknown>) => <div {...p} /> },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

import { CreateWorkspacePageHeader } from '@/components/Dashboard/CreateWorkspacePage/CreateWorkspacePageHeader'
import { CreateWorkspaceFormActions } from '@/components/Dashboard/CreateWorkspacePage/CreateWorkspaceFormActions'

describe('CreateWorkspacePageHeader', () => {
  it('renders heading', () => {
    render(<CreateWorkspacePageHeader />)
    expect(screen.getByText(/create workspace/i)).toBeInTheDocument()
  })
})

describe('CreateWorkspaceFormActions', () => {
  it('renders cancel button', () => {
    render(<CreateWorkspaceFormActions isSubmitting={false} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls onCancel when Cancel clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<CreateWorkspaceFormActions isSubmitting={false} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
