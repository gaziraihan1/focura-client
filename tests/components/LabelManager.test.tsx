import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react';
import { LabelManager } from '@/components/Labels/LabelManager'
import { createWrapper } from '../utils/renderWithProviders'

vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: 'user-1' } },
  }),
}))

vi.mock('@/hooks/useLabels', () => ({
  useLabels: vi.fn(() => ({
    data: { data: [] },
    isLoading: false,
  })),
  useCreateLabel: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useUpdateLabel: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useDeleteLabel: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspaceRoleCheck: vi.fn(() => ({
    canManage: true,
  })),
}))

vi.mock('@/lib/error/error', () => ({
  getErrorMessage: vi.fn(() => 'Error occurred'),
}))

vi.mock('lucide-react', () => ({
  Plus: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="plus-icon" {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  Tag: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="tag-icon" {...props} />,
}))

describe('LabelManager', () => {
  it('renders the title', () => {
    render(<LabelManager />, { wrapper: createWrapper() })
    expect(screen.getByText('Manage Labels')).toBeInTheDocument()
  })

  it('shows empty state when no labels', () => {
    render(<LabelManager />, { wrapper: createWrapper() })
    expect(screen.getByText('No labels yet')).toBeInTheDocument()
    expect(screen.getByText('Create your first label to get started')).toBeInTheDocument()
  })

  it('shows create button', () => {
    render(<LabelManager />, { wrapper: createWrapper() })
    expect(screen.getByText('Create New Label')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<LabelManager onClose={onClose} />, { wrapper: createWrapper() })
    fireEvent.click(screen.getByTestId('x-icon').closest('button')!)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not render close button when onClose not provided', () => {
    render(<LabelManager />, { wrapper: createWrapper() })
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
  })
})
