import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('framer-motion', () => ({
  motion: {
    tr: ({ children, ...props }: React.PropsWithChildren<React.TdHTMLAttributes<HTMLTableRowElement>>) => (
      <tr {...props}>{children}</tr>
    ),
  },
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={name} {...props} />;
  return {
    File: icon('file-icon'),
    CheckSquare: icon('check-square-icon'),
    Square: icon('square-icon'),
    ExternalLink: icon('external-link-icon'),
    Trash2: icon('trash-icon'),
    Loader2: icon('loader-icon'),
  };
});

vi.mock('@/hooks/useStoragePage', () => ({
  getCategoryColor: (category: string) => {
    const colors: Record<string, string> = {
      'application/pdf': 'text-red-600',
      'image/png': 'text-blue-600',
    };
    return colors[category] || 'text-gray-600';
  },
  formatStorageSize: (mb: number) => `${mb.toFixed(2)} MB`,
}));

import { FileTableRow } from '@/components/Dashboard/Storage/LargestFilesTable/FileTableRow';
import { LargestFile } from '@/hooks/useStorage';

function makeFile(overrides: Partial<LargestFile> = {}): LargestFile {
  return {
    id: 'f-1',
    name: 'report.pdf',
    originalName: 'report.pdf',
    size: 1048576,
    sizeMB: 1,
    mimeType: 'application/pdf',
    url: 'https://example.com/report.pdf',
    uploadedAt: new Date('2025-01-15T10:00:00Z'),
    uploadedBy: { id: 'user-1', name: 'Alice', email: 'alice@test.com' },
    task: null,
    project: null,
    ...overrides,
  };
}

describe('FileTableRow', () => {
  const defaultProps = {
    file: makeFile(),
    index: 0,
    isSelected: false,
    isOwner: false,
    canDelete: true,
    isDeleting: false,
    onToggleSelect: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders the file name', () => {
    render(<table><tbody><FileTableRow {...defaultProps} /></tbody></table>);
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });

  it('renders the mime type', () => {
    render(<table><tbody><FileTableRow {...defaultProps} /></tbody></table>);
    expect(screen.getByText('application/pdf')).toBeInTheDocument();
  });

  it('renders the formatted file size', () => {
    render(<table><tbody><FileTableRow {...defaultProps} /></tbody></table>);
    expect(screen.getByText('1.00 MB')).toBeInTheDocument();
  });

  it('renders the uploader name', () => {
    render(<table><tbody><FileTableRow {...defaultProps} /></tbody></table>);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows (You) when isOwner is true', () => {
    render(<table><tbody><FileTableRow {...defaultProps} isOwner={true} /></tbody></table>);
    expect(screen.getByText('(You)')).toBeInTheDocument();
  });

  it('does not show (You) when isOwner is false', () => {
    render(<table><tbody><FileTableRow {...defaultProps} isOwner={false} /></tbody></table>);
    expect(screen.queryByText('(You)')).not.toBeInTheDocument();
  });

  it('shows "Unknown" when uploader name is null', () => {
    const file = makeFile({ uploadedBy: { id: 'user-1', name: null, email: 'a@test.com' } });
    render(<table><tbody><FileTableRow {...defaultProps} file={file} /></tbody></table>);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('shows task info when file has a task', () => {
    const file = makeFile({ task: { id: 't-1', title: 'Fix bug' } });
    render(<table><tbody><FileTableRow {...defaultProps} file={file} /></tbody></table>);
    expect(screen.getByText('Task: Fix bug')).toBeInTheDocument();
  });

  it('shows project info when file has a project', () => {
    const file = makeFile({ project: { id: 'p-1', name: 'My Project' } });
    render(<table><tbody><FileTableRow {...defaultProps} file={file} /></tbody></table>);
    expect(screen.getByText('Project: My Project')).toBeInTheDocument();
  });

  it('shows "Workspace" when file has no task and no project', () => {
    render(<table><tbody><FileTableRow {...defaultProps} /></tbody></table>);
    expect(screen.getByText('Workspace')).toBeInTheDocument();
  });

  it('shows both task and project when both exist', () => {
    const file = makeFile({
      task: { id: 't-1', title: 'Fix bug' },
      project: { id: 'p-1', name: 'My Project' },
    });
    render(<table><tbody><FileTableRow {...defaultProps} file={file} /></tbody></table>);
    expect(screen.getByText('Task: Fix bug')).toBeInTheDocument();
    expect(screen.getByText('Project: My Project')).toBeInTheDocument();
  });

  it('renders the formatted upload date', () => {
    render(<table><tbody><FileTableRow {...defaultProps} /></tbody></table>);
    expect(screen.getByText(/Jan 15, 2025/)).toBeInTheDocument();
  });

  it('shows checked icon when isSelected is true', () => {
    render(<table><tbody><FileTableRow {...defaultProps} isSelected={true} /></tbody></table>);
    expect(screen.getByTestId('check-square-icon')).toBeInTheDocument();
  });

  it('shows unchecked icon when isSelected is false', () => {
    render(<table><tbody><FileTableRow {...defaultProps} isSelected={false} /></tbody></table>);
    expect(screen.getByTestId('square-icon')).toBeInTheDocument();
  });

  it('calls onToggleSelect when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSelect = vi.fn();
    render(<table><tbody><FileTableRow {...defaultProps} onToggleSelect={onToggleSelect} /></tbody></table>);
    const checkbox = screen.getByTestId('square-icon').closest('button')!;
    await user.click(checkbox);
    expect(onToggleSelect).toHaveBeenCalledOnce();
  });

  it('disables checkbox when canDelete is false', () => {
    render(<table><tbody><FileTableRow {...defaultProps} canDelete={false} /></tbody></table>);
    const checkbox = screen.getByTestId('square-icon').closest('button')!;
    expect(checkbox).toBeDisabled();
  });

  it('calls window.open when view button is clicked', async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<table><tbody><FileTableRow {...defaultProps} /></tbody></table>);
    const viewButton = screen.getByTitle('View file');
    await user.click(viewButton);
    expect(openSpy).toHaveBeenCalledWith('https://example.com/report.pdf', '_blank');
    openSpy.mockRestore();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<table><tbody><FileTableRow {...defaultProps} onDelete={onDelete} /></tbody></table>);
    await user.click(screen.getByTitle('Delete file'));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('does not show delete button when canDelete is false', () => {
    render(<table><tbody><FileTableRow {...defaultProps} canDelete={false} /></tbody></table>);
    expect(screen.queryByTitle('Delete file')).not.toBeInTheDocument();
  });

  it('disables delete button when isDeleting is true', () => {
    render(<table><tbody><FileTableRow {...defaultProps} isDeleting={true} /></tbody></table>);
    expect(screen.getByTitle('Delete file')).toBeDisabled();
  });

  it('shows loader icon when isDeleting is true', () => {
    render(<table><tbody><FileTableRow {...defaultProps} isDeleting={true} /></tbody></table>);
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('shows trash icon when not deleting', () => {
    render(<table><tbody><FileTableRow {...defaultProps} isDeleting={false} /></tbody></table>);
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });
});
