import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileTypeChart } from '@/components/Dashboard/Storage/FileTypeChart'

vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@/hooks/useStoragePage', () => ({
  formatStorageSize: (mb: number) => `${mb} MB`,
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
}))

const types = [
  { mimeType: 'image/png', category: 'images', count: 4, sizeMB: 120 },
  { mimeType: 'image/jpeg', category: 'images', count: 6, sizeMB: 80 },
  { mimeType: 'application/pdf', category: 'pdfs', count: 2, sizeMB: 300 },
]

describe('FileTypeChart', () => {
  it('renders the heading and subtitle', () => {
    render(<FileTypeChart types={types} />)
    expect(screen.getByText('Storage by File Type')).toBeInTheDocument()
    expect(screen.getByText('Distribution across categories')).toBeInTheDocument()
  })

  it('aggregates by category and shows total', () => {
    render(<FileTypeChart types={types} />)
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('Pdfs')).toBeInTheDocument()
    expect(screen.getByText('500 MB')).toBeInTheDocument()
    expect(screen.getByText('12 files')).toBeInTheDocument()
  })

  it('shows empty state when no types exist', () => {
    render(<FileTypeChart types={[]} />)
    expect(screen.getByText('No file type data available yet.')).toBeInTheDocument()
  })
})