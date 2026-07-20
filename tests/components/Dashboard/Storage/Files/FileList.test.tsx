import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileList } from '@/components/Dashboard/Storage/Files/FileList';

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    Download: icon('download'),
    Trash2: icon('trash2'),
    Eye: icon('eye'),
    FileText: icon('file-text'),
    Image: icon('image-icon'),
    Film: icon('film'),
    Music: icon('music'),
    Archive: icon('archive'),
    File: icon('file'),
  };
});

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock('@/hooks/useFileManagement', () => ({
  useDeleteFile: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  FileWithDetails: {},
}));

vi.mock('@/utils/file.utils', () => ({
  formatFileSize: (size: number) => `${size} B`,
  formatRelativeTime: () => '2 hours ago',
}));

vi.mock('@/components/Dashboard/Storage/Files/DeleteConfirmModal', () => ({
  DeleteConfirmModal: () => <div data-testid="delete-modal" />,
}));

vi.mock('@/components/Dashboard/Storage/Files/FilePreviewModal', () => ({
  FilePreviewModal: () => <div data-testid="preview-modal" />,
}));

function makeFile(overrides: Record<string, unknown> = {}) {
  return {
    id: 'f-1',
    originalName: 'report.pdf',
    size: 1024,
    mimeType: 'application/pdf',
    url: 'https://example.com/report.pdf',
    uploadedAt: '2025-01-15T10:00:00Z',
    uploadedBy: { id: 'user-1', name: 'Alice', email: 'alice@test.com', image: null },
    task: null,
    project: null,
    ...overrides,
  };
}

describe('FileList', () => {
  const defaultProps = {
    isAdmin: true,
    workspaceId: 'ws-1',
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders file name in the table', () => {
    render(<FileList files={[makeFile()]} {...defaultProps} />);
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<FileList files={[makeFile()]} {...defaultProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders uploaded by name', () => {
    render(<FileList files={[makeFile()]} {...defaultProps} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
