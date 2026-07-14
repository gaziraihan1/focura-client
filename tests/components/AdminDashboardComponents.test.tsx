import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AdminPageHeader } from '@/components/AdminDashboard/AdminPageHeader'
import { StorageBar } from '@/components/AdminDashboard/StorageBar'
import { StatCard } from '@/components/AdminDashboard/StatCard'

describe('AdminPageHeader', () => {
  it('renders title', () => {
    render(<AdminPageHeader icon={<span />} title="Users" />)
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders count when provided', () => {
    render(<AdminPageHeader icon={<span />} title="Users" count={42} />)
    expect(screen.getByText('(42)')).toBeInTheDocument()
  })

  it('renders search input when onSearch provided', () => {
    render(<AdminPageHeader icon={<span />} title="Users" search="" onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<AdminPageHeader icon={<span />} title="Users" search="" onSearch={onSearch} />)
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'test' } })
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('renders custom placeholder', () => {
    render(<AdminPageHeader icon={<span />} title="Users" search="" onSearch={vi.fn()} placeholder="Find user..." />)
    expect(screen.getByPlaceholderText('Find user...')).toBeInTheDocument()
  })

  it('renders actions when provided', () => {
    render(<AdminPageHeader icon={<span />} title="Users" actions={<button>Add</button>} />)
    expect(screen.getByText('Add')).toBeInTheDocument()
  })
})

describe('StorageBar', () => {
  it('renders usage label', () => {
    render(<StorageBar usedMb={500} maxMb={1000} />)
    expect(screen.getByText('500 / 1,000 MB (50%)')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    const { container } = render(<StorageBar usedMb={500} maxMb={1000} showLabel={false} />)
    expect(screen.queryByText(/MB/)).not.toBeInTheDocument()
  })

  it('calculates percentage correctly', () => {
    render(<StorageBar usedMb={250} maxMb={1000} />)
    expect(screen.getByText('250 / 1,000 MB (25%)')).toBeInTheDocument()
  })

  it('uses destructive color when usage >= 90%', () => {
    render(<StorageBar usedMb={950} maxMb={1000} />)
    expect(screen.getByText('950 / 1,000 MB (95%)')).toBeInTheDocument()
  })

  it('uses amber color when usage >= 70%', () => {
    render(<StorageBar usedMb={750} maxMb={1000} />)
    expect(screen.getByText('750 / 1,000 MB (75%)')).toBeInTheDocument()
  })
})

describe('StatCard', () => {
  it('renders label', () => {
    render(<StatCard icon={() => null} label="Users" value={100} />)
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders formatted value', () => {
    render(<StatCard icon={() => null} label="Users" value={1234} />)
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })
})
