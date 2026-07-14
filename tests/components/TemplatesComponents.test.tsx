import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TemplatesHero from '@/components/Templates/TemplatesHero'

describe('TemplatesHero', () => {
  it('renders coming soon badge', () => {
    render(<TemplatesHero onSearch={vi.fn()} />)
    expect(screen.getByText(/Project Templates — Coming Soon/)).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<TemplatesHero onSearch={vi.fn()} />)
    expect(screen.getByText('Start fast.')).toBeInTheDocument()
    expect(screen.getByText('Ship with confidence.')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<TemplatesHero onSearch={vi.fn()} />)
    expect(screen.getByText(/Pre-built project templates/)).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<TemplatesHero onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText(/Search templates by name/)).toBeInTheDocument()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<TemplatesHero onSearch={onSearch} />)
    const input = screen.getByPlaceholderText(/Search templates/)
    fireEvent.change(input, { target: { value: 'engineering' } })
    expect(onSearch).toHaveBeenCalledWith('engineering')
  })

  it('renders stat pills', () => {
    render(<TemplatesHero onSearch={vi.fn()} />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('9+')).toBeInTheDocument()
    expect(screen.getByText('Templates planned')).toBeInTheDocument()
  })
})
