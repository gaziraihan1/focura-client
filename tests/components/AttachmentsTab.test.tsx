import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttachmentsTab } from '@/components/Dashboard/TaskDetails/TaskTab/AttachmentsTab'

vi.mock('lucide-react', () => ({
  Paperclip: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="paperclip-icon" {...props} />,
  Download: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="download-icon" {...props} />,
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader-icon" {...props} />,
  Lock: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="lock-icon" {...props} />,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('@/utils/task.utils', () => ({
  formatFileSize: (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`,
}))

const mockUploadAttachment = {
  mutateAsync: vi.fn(),
  isPending: false,
  mutate: vi.fn(),
} as any

const mockDeleteAttachment = {
  mutateAsync: vi.fn(),
  isPending: false,
  mutate: vi.fn(),
} as any

describe('AttachmentsTab', () => {
  const defaultProps = {
    taskId: 'task-1',
    attachments: [],
    currentUserId: 'user-1',
    canComment: true,
    uploadAttachment: mockUploadAttachment,
    deleteAttachment: mockDeleteAttachment,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area when canComment is true', () => {
    render(<AttachmentsTab {...defaultProps} />)
    expect(screen.getByText('Click to upload a file')).toBeInTheDocument()
  })

  it('renders no attachments message when list is empty', () => {
    render(<AttachmentsTab {...defaultProps} />)
    expect(screen.getByText('No attachments yet')).toBeInTheDocument()
  })

  it('renders lock message when canComment is false', () => {
    render(<AttachmentsTab {...defaultProps} canComment={false} />)
    expect(screen.getByText(/don't have permission/)).toBeInTheDocument()
  })

  it('hides upload area when canComment is false', () => {
    render(<AttachmentsTab {...defaultProps} canComment={false} />)
    expect(screen.queryByText('Click to upload a file')).not.toBeInTheDocument()
  })

  it('renders attachments list when attachments exist', () => {
    const attachments = [
      {
        id: 'att-1',
        name: 'file1.png',
        originalName: 'file1.png',
        size: 1024,
        mimeType: 'image/png',
        url: 'https://example.com/file1.png',
        uploadedAt: '2026-07-10T00:00:00Z',
        uploadedBy: { id: 'user-1', name: 'Alice' },
      },
    ]
    render(<AttachmentsTab {...defaultProps} attachments={attachments} />)
    expect(screen.getByText('file1.png')).toBeInTheDocument()
  })

  it('renders file size', () => {
    const attachments = [
      {
        id: 'att-1',
        name: 'file1.png',
        originalName: 'file1.png',
        size: 2048,
        mimeType: 'image/png',
        url: 'https://example.com/file1.png',
        uploadedAt: '2026-07-10T00:00:00Z',
        uploadedBy: { id: 'user-1', name: 'Alice' },
      },
    ]
    render(<AttachmentsTab {...defaultProps} attachments={attachments} />)
    expect(screen.getByText(/2.0 KB/)).toBeInTheDocument()
  })

  it('renders uploader name', () => {
    const attachments = [
      {
        id: 'att-1',
        name: 'file1.png',
        originalName: 'file1.png',
        size: 1024,
        mimeType: 'image/png',
        url: 'https://example.com/file1.png',
        uploadedAt: '2026-07-10T00:00:00Z',
        uploadedBy: { id: 'user-1', name: 'Alice' },
      },
    ]
    render(<AttachmentsTab {...defaultProps} attachments={attachments} />)
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
  })

  it('renders download link', () => {
    const attachments = [
      {
        id: 'att-1',
        name: 'file1.png',
        originalName: 'file1.png',
        size: 1024,
        mimeType: 'image/png',
        url: 'https://example.com/file1.png',
        uploadedAt: '2026-07-10T00:00:00Z',
        uploadedBy: { id: 'user-1', name: 'Alice' },
      },
    ]
    const { container } = render(<AttachmentsTab {...defaultProps} attachments={attachments} />)
    const downloadLink = container.querySelector('a[href="https://example.com/file1.png"]')
    expect(downloadLink).toBeInTheDocument()
    expect(downloadLink).toHaveAttribute('download', 'file1.png')
  })

  it('shows delete button for own attachments', () => {
    const attachments = [
      {
        id: 'att-1',
        name: 'file1.png',
        originalName: 'file1.png',
        size: 1024,
        mimeType: 'image/png',
        url: 'https://example.com/file1.png',
        uploadedAt: '2026-07-10T00:00:00Z',
        uploadedBy: { id: 'user-1', name: 'Alice' },
      },
    ]
    render(<AttachmentsTab {...defaultProps} attachments={attachments} />)
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
  })

  it('hides delete button for other users attachments', () => {
    const attachments = [
      {
        id: 'att-1',
        name: 'file1.png',
        originalName: 'file1.png',
        size: 1024,
        mimeType: 'image/png',
        url: 'https://example.com/file1.png',
        uploadedAt: '2026-07-10T00:00:00Z',
        uploadedBy: { id: 'user-2', name: 'Bob' },
      },
    ]
    render(<AttachmentsTab {...defaultProps} attachments={attachments} />)
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument()
  })

  it('shows loading state when uploading', () => {
    const uploadingProps = {
      ...defaultProps,
      uploadAttachment: { ...mockUploadAttachment, isPending: true },
    }
    render(<AttachmentsTab {...uploadingProps} />)
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })
})
