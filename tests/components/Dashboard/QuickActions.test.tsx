import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

import { QuickActions } from '@/components/Dashboard/QuickActions'

describe('QuickActions', () => {
  it('renders all 4 quick actions', () => {
    render(<QuickActions />, { wrapper: createWrapper() })
    expect(screen.getByText('New workspace')).toBeInTheDocument()
    expect(screen.getByText('Invite member')).toBeInTheDocument()
    expect(screen.getByText('New project')).toBeInTheDocument()
    expect(screen.getByText('Shortcuts')).toBeInTheDocument()
  })

  it('renders correct hints', () => {
    render(<QuickActions />, { wrapper: createWrapper() })
    expect(screen.getByText('Start fresh')).toBeInTheDocument()
    expect(screen.getByText('Grow your team')).toBeInTheDocument()
    expect(screen.getByText('Inside a workspace')).toBeInTheDocument()
    expect(screen.getByText('⌘K to switch')).toBeInTheDocument()
  })

  it('renders Quick actions heading', () => {
    render(<QuickActions />, { wrapper: createWrapper() })
    expect(screen.getByText('Quick actions')).toBeInTheDocument()
  })
})
