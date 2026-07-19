import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PopularResourceForm } from '@/components/AdminDashboard/Resource/PopularResourceForm'

vi.mock('@/hooks/useResource', () => ({
  useCreatePopularResource: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
  }),
  useUpdatePopularResource: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
  }),
}))

vi.mock('@/components/AdminDashboard/Resource/StatusSelect', () => ({
  StatusSelect: (props: any) => <select data-testid="status-select" {...props} />,
}))

describe('PopularResourceForm', () => {
  it('renders the Title label', () => {
    render(<PopularResourceForm />)
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
  })

  it('renders the Description label', () => {
    render(<PopularResourceForm />)
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('renders the Image URL label', () => {
    render(<PopularResourceForm />)
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument()
  })

  it('renders the Save popular resource button', () => {
    render(<PopularResourceForm />)
    expect(screen.getByText('Save popular resource')).toBeInTheDocument()
  })
})
