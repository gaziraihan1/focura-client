import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeleteConfirmModal } from '@/components/Dashboard/Storage/Files/DeleteConfirmModal'
import { FileTypeStats } from '@/components/Dashboard/Storage/Files/FileTypeStats'

vi.mock('lucide-react', () => ({
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-icon" {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader-icon" {...props} />,
  FileText: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="file-text-icon" {...props} />,
  Image: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="image-icon" {...props} />,
  Film: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="film-icon" {...props} />,
  Music: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="music-icon" {...props} />,
  Archive: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="archive-icon" {...props} />,
  HardDrive: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="harddrive-icon" {...props} />,
}))

vi.mock('@/utils/file.utils', () => ({
  formatFileSize: (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`,
}))

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    fileName: 'photo.png',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    isDeleting: false,
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders heading', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    expect(screen.getByText('Delete File')).toBeInTheDocument()
  })

  it('renders file name in warning', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    expect(screen.getByText('"photo.png"')).toBeInTheDocument()
  })

  it('renders confirmation message', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders undo warning', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    expect(screen.getByText(/cannot be undone/)).toBeInTheDocument()
  })

  it('calls onConfirm when Delete is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(defaultProps.onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when Cancel is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when X is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    fireEvent.click(screen.getByTestId('x-icon').closest('button')!)
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('shows loading spinner when deleting', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('disables buttons when deleting', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />)
    const deleteBtn = screen.getByText('Delete').closest('button')
    const cancelBtn = screen.getByText('Cancel').closest('button')
    expect(deleteBtn).toBeDisabled()
    expect(cancelBtn).toBeDisabled()
  })
})

describe('FileTypeStats', () => {
  const stats = [
    { type: 'Images', count: 10, sizeMB: 50 },
    { type: 'Videos', count: 3, sizeMB: 200 },
    { type: 'Documents', count: 15, sizeMB: 10 },
  ]

  it('renders nothing when stats is empty', () => {
    const { container } = render(<FileTypeStats stats={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders Storage Breakdown heading', () => {
    render(<FileTypeStats stats={stats} />)
    expect(screen.getByText('Storage Breakdown')).toBeInTheDocument()
  })

  it('renders Total Files count', () => {
    render(<FileTypeStats stats={stats} />)
    expect(screen.getByText('28')).toBeInTheDocument()
  })

  it('renders Total Files label', () => {
    render(<FileTypeStats stats={stats} />)
    expect(screen.getByText('Total Files')).toBeInTheDocument()
  })

  it('renders type labels', () => {
    render(<FileTypeStats stats={stats} />)
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('Videos')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
  })

  it('renders type counts', () => {
    render(<FileTypeStats stats={stats} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })
})
