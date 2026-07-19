import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

import WorkspaceStorageInfo from '@/components/Dashboard/Workspaces/WorkspacePage/WorkspaceStorageInfo'

describe('WorkspaceStorageInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Storage heading', () => {
    render(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText('Storage')).toBeInTheDocument()
  })

  it('displays used storage text', () => {
    render(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText('Used Storage')).toBeInTheDocument()
  })

  it('displays storage values', () => {
    render(<WorkspaceStorageInfo maxStorage={1024} />)
    expect(screen.getByText('0 MB / 1024 MB')).toBeInTheDocument()
  })

  it('renders a progress bar', () => {
    const { container } = render(<WorkspaceStorageInfo maxStorage={1024} />)
    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar!.getAttribute('style')).toContain('0%')
  })

  it('displays different maxStorage values', () => {
    render(<WorkspaceStorageInfo maxStorage={5000} />)
    expect(screen.getByText('0 MB / 5000 MB')).toBeInTheDocument()
  })

  it('renders the progress bar container', () => {
    const { container } = render(<WorkspaceStorageInfo maxStorage={100} />)
    // The outer track bar
    const track = container.querySelector('.bg-muted')
    expect(track).toBeInTheDocument()
  })

  it('renders the filled bar with bg-primary', () => {
    const { container } = render(<WorkspaceStorageInfo maxStorage={100} />)
    const filled = container.querySelector('.bg-primary')
    expect(filled).toBeInTheDocument()
  })
})
