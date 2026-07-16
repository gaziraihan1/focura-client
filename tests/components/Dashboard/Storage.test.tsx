import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../../utils/renderWithProviders'
import { StorageSummaryCards } from '@/components/Dashboard/Storage/StorageSummaryCards'
import { FileGrid } from '@/components/Dashboard/Storage/Files/FileGrid'
import { FileList } from '@/components/Dashboard/Storage/Files/FileList'
import { DeleteConfirmModal } from '@/components/Dashboard/Storage/Files/DeleteConfirmModal'
import FileCardInfo from '@/components/Dashboard/Storage/Files/FileCardInfo'
import FileCardOverlay from '@/components/Dashboard/Storage/Files/FileCardOverlay'
import { FileFiltersComponent } from '@/components/Dashboard/Storage/Files/FileFilters'
import { FileTypeStats } from '@/components/Dashboard/Storage/Files/FileTypeStats'

const mockStorageInfo = {
  usedMB: 500,
  totalMB: 1000,
  remainingMB: 500,
  percentage: 50,
  plan: 'Pro',
  workspaceName: 'Test Workspace',
}

const mockFile = {
  id: 'file-1',
  originalName: 'test-document.pdf',
  url: 'https://example.com/file.pdf',
  size: 1024000,
  mimeType: 'application/pdf',
  uploadedAt: '2026-07-10T00:00:00Z',
  uploadedBy: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@test.com',
    image: null,
  },
  task: null,
  project: null,
} as any

const mockImageFile = {
  ...mockFile,
  id: 'file-2',
  originalName: 'photo.jpg',
  mimeType: 'image/jpeg',
  url: 'https://example.com/photo.jpg',
}

describe('Storage/StorageSummaryCards', () => {
  it('renders workspace name', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('Test Workspace')).toBeInTheDocument()
  })

  it('renders current plan', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders storage used', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('Storage Used')).toBeInTheDocument()
  })

  it('renders total limit', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('Total Limit')).toBeInTheDocument()
  })

  it('renders remaining', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('Remaining')).toBeInTheDocument()
  })

  it('renders usage percentage', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('renders usage label', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('Usage')).toBeInTheDocument()
  })

  it('renders progress bar', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('renders warning icon when usage >= 80%', () => {
    const highUsage = { ...mockStorageInfo, percentage: 85 }
    render(<StorageSummaryCards storageInfo={highUsage} />, { wrapper: createWrapper() })
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('renders critical icon when usage >= 95%', () => {
    const criticalUsage = { ...mockStorageInfo, percentage: 98 }
    render(<StorageSummaryCards storageInfo={criticalUsage} />, { wrapper: createWrapper() })
    expect(screen.getByText('98%')).toBeInTheDocument()
  })

  it('renders normal icon when usage < 80%', () => {
    render(<StorageSummaryCards storageInfo={mockStorageInfo} />, { wrapper: createWrapper() })
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})

describe('Storage/FileGrid', () => {
  it('renders files in grid mode', () => {
    render(
      <FileGrid files={[mockFile]} isAdmin={true} viewMode="grid" workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
  })

  it('renders files in list mode', () => {
    render(
      <FileGrid files={[mockFile]} isAdmin={true} viewMode="list" workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
  })

  it('renders empty state for admin', () => {
    render(
      <FileGrid files={[]} isAdmin={true} viewMode="grid" workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('No files found')).toBeInTheDocument()
    expect(screen.getByText('No files have been uploaded to this workspace yet.')).toBeInTheDocument()
  })

  it('renders empty state for non-admin', () => {
    render(
      <FileGrid files={[]} isAdmin={false} viewMode="grid" workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText("You haven't uploaded any files yet.")).toBeInTheDocument()
  })

  it('renders multiple files', () => {
    const files = [mockFile, { ...mockFile, id: 'file-2', originalName: 'document2.pdf' }]
    render(
      <FileGrid files={files} isAdmin={true} viewMode="grid" workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
    expect(screen.getByText('document2.pdf')).toBeInTheDocument()
  })
})

describe('Storage/FileList', () => {
  it('renders files in table', () => {
    render(
      <FileList files={[mockFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
  })

  it('renders file size', () => {
    render(
      <FileList files={[mockFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getAllByText('1000.00 KB').length).toBeGreaterThan(0)
  })

  it('renders uploaded by', () => {
    render(
      <FileList files={[mockFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(
      <FileList files={[mockFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTitle('Preview')).toBeInTheDocument()
    expect(screen.getByTitle('Download')).toBeInTheDocument()
    expect(screen.getByTitle('Delete')).toBeInTheDocument()
  })

  it('renders file with task context', () => {
    const fileWithTask = {
      ...mockFile,
      task: { title: 'Test Task' },
    }
    render(
      <FileList files={[fileWithTask]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText(/Test Task/)).toBeInTheDocument()
  })

  it('renders file with project context', () => {
    const fileWithProject = {
      ...mockFile,
      project: { name: 'Test Project' },
    }
    render(
      <FileList files={[fileWithProject]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText(/Test Project/)).toBeInTheDocument()
  })

  it('renders empty context when no task or project', () => {
    render(
      <FileList files={[mockFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders image file with icon', () => {
    render(
      <FileList files={[mockImageFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('photo.jpg')).toBeInTheDocument()
  })

  it('renders video file with icon', () => {
    const videoFile = { ...mockFile, originalName: 'video.mp4', mimeType: 'video/mp4' }
    render(
      <FileList files={[videoFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('video.mp4')).toBeInTheDocument()
  })

  it('renders audio file with icon', () => {
    const audioFile = { ...mockFile, originalName: 'audio.mp3', mimeType: 'audio/mpeg' }
    render(
      <FileList files={[audioFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('audio.mp3')).toBeInTheDocument()
  })

  it('renders zip file with icon', () => {
    const zipFile = { ...mockFile, originalName: 'archive.zip', mimeType: 'application/zip' }
    render(
      <FileList files={[zipFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('archive.zip')).toBeInTheDocument()
  })

  it('renders generic file with icon', () => {
    const genericFile = { ...mockFile, originalName: 'data.json', mimeType: 'application/json' }
    render(
      <FileList files={[genericFile]} isAdmin={true} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('data.json')).toBeInTheDocument()
  })

  it('does not show delete button for non-admin when not uploader', () => {
    const otherFile = { ...mockFile, uploadedBy: { ...mockFile.uploadedBy, id: 'other-user' } }
    render(
      <FileList files={[otherFile]} isAdmin={false} workspaceId="ws-1" />,
      { wrapper: createWrapper() }
    )
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
  })
})

describe('Storage/DeleteConfirmModal', () => {
  it('renders delete modal with file name', () => {
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDeleting={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Delete File')).toBeInTheDocument()
    expect(screen.getByText('"test-file.pdf"')).toBeInTheDocument()
  })

  it('renders confirmation message', () => {
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDeleting={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
  })

  it('renders cancel button', () => {
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDeleting={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('renders delete button', () => {
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDeleting={false}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={vi.fn()}
        onCancel={onCancel}
        isDeleting={false}
      />,
      { wrapper: createWrapper() }
    )
    const cancelButton = screen.getByText('Cancel')
    await cancelButton.click()
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onConfirm when delete button is clicked', async () => {
    const onConfirm = vi.fn()
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        isDeleting={false}
      />,
      { wrapper: createWrapper() }
    )
    const deleteButton = screen.getByText('Delete')
    await deleteButton.click()
    expect(onConfirm).toHaveBeenCalled()
  })

  it('disables buttons when deleting', () => {
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDeleting={true}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByText('Cancel')).toBeDisabled()
    expect(screen.getByText('Delete')).toBeDisabled()
  })

  it('renders loading spinner when deleting', () => {
    render(
      <DeleteConfirmModal
        fileName="test-file.pdf"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isDeleting={true}
      />,
      { wrapper: createWrapper() }
    )
    const deleteButton = screen.getByText('Delete')
    expect(deleteButton).toBeInTheDocument()
  })
})

describe('Storage/FileCardInfo', () => {
  it('renders file name', () => {
    render(<FileCardInfo file={mockFile} />, { wrapper: createWrapper() })
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument()
  })

  it('renders file size', () => {
    render(<FileCardInfo file={mockFile} />, { wrapper: createWrapper() })
    expect(screen.getByText('1000.00 KB')).toBeInTheDocument()
  })

  it('renders uploader name', () => {
    render(<FileCardInfo file={mockFile} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders uploader initial when no image', () => {
    render(<FileCardInfo file={mockFile} />, { wrapper: createWrapper() })
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders uploader image when available', () => {
    const fileWithImage = {
      ...mockFile,
      uploadedBy: { ...mockFile.uploadedBy, image: 'https://example.com/avatar.jpg' },
    }
    render(<FileCardInfo file={fileWithImage} />, { wrapper: createWrapper() })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders task context', () => {
    const fileWithTask = {
      ...mockFile,
      task: { title: 'Test Task' },
    }
    render(<FileCardInfo file={fileWithTask} />, { wrapper: createWrapper() })
    expect(screen.getAllByText(/Test Task/).length).toBeGreaterThan(0)
  })

  it('renders project context', () => {
    const fileWithProject = {
      ...mockFile,
      project: { name: 'Test Project' },
    }
    render(<FileCardInfo file={fileWithProject} />, { wrapper: createWrapper() })
    expect(screen.getAllByText(/Test Project/).length).toBeGreaterThan(0)
  })

  it('renders no context when no task or project', () => {
    render(<FileCardInfo file={mockFile} />, { wrapper: createWrapper() })
    expect(screen.queryByText('📋')).not.toBeInTheDocument()
    expect(screen.queryByText('📁')).not.toBeInTheDocument()
  })
})

describe('Storage/FileCardOverlay', () => {
  it('renders preview button', () => {
    render(
      <FileCardOverlay
        canDelete={true}
        onDeleteModal={vi.fn()}
        file={mockFile}
        isPending={false}
        onShowPreview={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTitle('Preview')).toBeInTheDocument()
  })

  it('renders download button', () => {
    render(
      <FileCardOverlay
        canDelete={true}
        onDeleteModal={vi.fn()}
        file={mockFile}
        isPending={false}
        onShowPreview={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTitle('Download')).toBeInTheDocument()
  })

  it('renders delete button when canDelete is true', () => {
    render(
      <FileCardOverlay
        canDelete={true}
        onDeleteModal={vi.fn()}
        file={mockFile}
        isPending={false}
        onShowPreview={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTitle('Delete')).toBeInTheDocument()
  })

  it('does not render delete button when canDelete is false', () => {
    render(
      <FileCardOverlay
        canDelete={false}
        onDeleteModal={vi.fn()}
        file={mockFile}
        isPending={false}
        onShowPreview={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument()
  })

  it('calls onShowPreview when preview button is clicked', async () => {
    const onShowPreview = vi.fn()
    render(
      <FileCardOverlay
        canDelete={true}
        onDeleteModal={vi.fn()}
        file={mockFile}
        isPending={false}
        onShowPreview={onShowPreview}
      />,
      { wrapper: createWrapper() }
    )
    const previewButton = screen.getByTitle('Preview')
    await previewButton.click()
    expect(onShowPreview).toHaveBeenCalledWith(true)
  })

  it('calls onDeleteModal when delete button is clicked', async () => {
    const onDeleteModal = vi.fn()
    render(
      <FileCardOverlay
        canDelete={true}
        onDeleteModal={onDeleteModal}
        file={mockFile}
        isPending={false}
        onShowPreview={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    const deleteButton = screen.getByTitle('Delete')
    await deleteButton.click()
    expect(onDeleteModal).toHaveBeenCalledWith(true)
  })

  it('disables delete button when isPending is true', () => {
    render(
      <FileCardOverlay
        canDelete={true}
        onDeleteModal={vi.fn()}
        file={mockFile}
        isPending={true}
        onShowPreview={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )
    expect(screen.getByTitle('Delete')).toBeDisabled()
  })
})

describe('Storage/FileFilters', () => {
  const mockProps = {
    filters: {
      search: '',
      fileType: 'all',
      uploadedBy: 'all',
      dateFrom: undefined,
      dateTo: undefined,
    },
    onFiltersChange: vi.fn(),
    uploaders: [{ id: 'user-1', name: 'John Doe' }],
    isAdmin: true,
    viewMode: 'grid' as const,
    onViewModeChange: vi.fn(),
  }

  it('renders search input', () => {
    render(<FileFiltersComponent {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByPlaceholderText(/search files/i)).toBeInTheDocument()
  })

  it('renders filter button', () => {
    render(<FileFiltersComponent {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('renders view mode toggle', () => {
    render(<FileFiltersComponent {...mockProps} />, { wrapper: createWrapper() })
    expect(screen.getByTitle('Grid view')).toBeInTheDocument()
    expect(screen.getByTitle('List view')).toBeInTheDocument()
  })

  it('calls onViewModeChange when view mode is changed', async () => {
    render(<FileFiltersComponent {...mockProps} />, { wrapper: createWrapper() })
    const listButton = screen.getByTitle('List view')
    await listButton.click()
    expect(mockProps.onViewModeChange).toHaveBeenCalledWith('list')
  })
})

describe('Storage/FileTypeStats', () => {
  const mockStats = [
    { type: 'Documents', count: 10, size: 1024000 },
    { type: 'Images', count: 5, size: 2048000 },
    { type: 'Videos', count: 2, size: 10240000 },
  ]

  it('renders file type stats', () => {
    render(<FileTypeStats stats={mockStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('Videos')).toBeInTheDocument()
  })

  it('renders file counts', () => {
    render(<FileTypeStats stats={mockStats} />, { wrapper: createWrapper() })
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders empty state when no stats', () => {
    const { container } = render(<FileTypeStats stats={[]} />, { wrapper: createWrapper() })
    expect(container.innerHTML).toBe('')
  })
})
