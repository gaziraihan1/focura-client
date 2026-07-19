import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileTableRow } from '@/components/Dashboard/Storage/LargestFilesTable/FileTableRow'

vi.mock('framer-motion', () => ({
  motion: {
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
}))

vi.mock('lucide-react', () => ({
  File: (props: any) => <svg data-testid="file-icon" {...props} />,
  CheckSquare: (props: any) => <svg data-testid="check-square" {...props} />,
  Square: (props: any) => <svg data-testid="square" {...props} />,
  ExternalLink: (props: any) => <svg data-testid="external-link" {...props} />,
  Trash2: (props: any) => <svg data-testid="trash" {...props} />,
  Loader2: (props: any) => <svg data-testid="loader" {...props} />,
}))

vi.mock('@/hooks/useStoragePage', () => ({
  formatStorageSize: (mb: number) => `${mb} MB`,
  getCategoryColor: () => 'text-primary',
}))

const mockFile = {
  id: 'file-1',
  name: 'report.pdf',
  originalName: 'report.pdf',
  size: 5000000,
  sizeMB: 5,
  mimeType: 'application/pdf',
  url: 'https://example.com/report.pdf',
  uploadedAt: new Date('2025-01-15'),
  uploadedBy: { id: 'u1', name: 'John Doe', email: 'john@test.com' },
  task: { id: 't1', title: 'Review report' },
  project: { id: 'p1', name: 'Q1 Report' },
}

const defaultProps = {
  file: mockFile,
  index: 0,
  isSelected: false,
  isOwner: true,
  canDelete: true,
  isDeleting: false,
  onToggleSelect: vi.fn(),
  onDelete: vi.fn(),
}

describe('FileTableRow', () => {
  it('renders the file name', () => {
    render(
      <table><tbody><FileTableRow {...defaultProps} /></tbody></table>
    )
    expect(screen.getByText('report.pdf')).toBeInTheDocument()
  })

  it('renders the file size', () => {
    render(
      <table><tbody><FileTableRow {...defaultProps} /></tbody></table>
    )
    expect(screen.getByText('5 MB')).toBeInTheDocument()
  })

  it('renders the uploader name', () => {
    render(
      <table><tbody><FileTableRow {...defaultProps} /></tbody></table>
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('shows (You) for owner', () => {
    render(
      <table><tbody><FileTableRow {...defaultProps} isOwner={true} /></tbody></table>
    )
    expect(screen.getByText('(You)')).toBeInTheDocument()
  })
})
