import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/constants/storage.constants', () => ({
  FILTER_OPTIONS: [
    { value: 'all', label: 'All Files' },
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' },
    { value: 'pdfs', label: 'PDFs' },
    { value: 'documents', label: 'Documents' },
    { value: 'other', label: 'Other' },
  ],
}));

import { TableHeader } from '@/components/Dashboard/Storage/LargestFilesTable/TableHeader';

describe('TableHeader', () => {
  const defaultProps = {
    filterType: 'all',
    setFilterType: vi.fn(),
  };

  it('renders the title', () => {
    render(<TableHeader {...defaultProps} />);
    expect(screen.getByText('Largest Files')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<TableHeader {...defaultProps} />);
    expect(screen.getByText('Manage workspace storage')).toBeInTheDocument();
  });

  it('renders all filter buttons', () => {
    render(<TableHeader {...defaultProps} />);
    expect(screen.getByText('All Files')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('PDFs')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('calls setFilterType when a filter button is clicked', async () => {
    const user = userEvent.setup();
    const setFilterType = vi.fn();
    render(<TableHeader {...defaultProps} setFilterType={setFilterType} />);
    await user.click(screen.getByText('Images'));
    expect(setFilterType).toHaveBeenCalledWith('images');
  });

  it('applies primary class to active filter', () => {
    render(<TableHeader {...defaultProps} filterType="images" />);
    const imagesButton = screen.getByText('Images');
    expect(imagesButton.className).toContain('bg-primary');
  });

  it('applies muted class to inactive filter', () => {
    render(<TableHeader {...defaultProps} filterType="images" />);
    const allButton = screen.getByText('All Files');
    expect(allButton.className).toContain('bg-muted');
  });
});
