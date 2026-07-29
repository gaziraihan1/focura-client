import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockUseWorkspaceStorageInfo = vi.fn(() => ({
  data: { usedMB: 0, totalMB: 1024, percentage: 0 },
  isLoading: false,
}))

vi.mock('@/hooks/useStorage', () => ({
  useWorkspaceStorageInfo: (...args: any[]) => mockUseWorkspaceStorageInfo(...args),
}))

import WorkspaceStorageInfo from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStorageInfo'
import { renderWithProviders } from '../../../../utils/renderWithProviders'

describe('WorkspaceStorageInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseWorkspaceStorageInfo.mockReturnValue({
      data: { usedMB: 0, totalMB: 1024, percentage: 0 },
      isLoading: false,
    })
  })

  it('renders the Storage heading', () => {
    renderWithProviders(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText('Storage')).toBeInTheDocument()
  })

  it('displays storage values', () => {
    renderWithProviders(<WorkspaceStorageInfo maxStorage={1024} />)
    // Component shows used ("0 MB") and total ("of 1.0 GB") in separate spans
    expect(screen.getByText('0 MB')).toBeInTheDocument()
    expect(screen.getByText(/of 1\.0 GB/)).toBeInTheDocument()
  })

  it('renders a progress bar', () => {
    const { container } = renderWithProviders(<WorkspaceStorageInfo maxStorage={1024} />)
    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('displays percentage text', () => {
    renderWithProviders(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText(/0.0% used/)).toBeInTheDocument()
  })

  it('renders the progress bar container', () => {
    const { container } = renderWithProviders(<WorkspaceStorageInfo maxStorage={100} />)
    const track = container.querySelector('.bg-muted')
    expect(track).toBeInTheDocument()
  })

  it('shows warning when storage is high', () => {
    mockUseWorkspaceStorageInfo.mockReturnValue({
      data: { usedMB: 900, totalMB: 1000, percentage: 90 },
      isLoading: false,
    })
    renderWithProviders(<WorkspaceStorageInfo maxStorage={1000} />)
    expect(screen.getByText('Running low on storage')).toBeInTheDocument()
  })
})
