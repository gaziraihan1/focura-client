import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CareersEmpty } from '@/components/Careers/CareersEmpty'
import { CareersHero } from '@/components/Careers/CareersHero'
import { CareersValues } from '@/components/Careers/CareersValues'

describe('CareersEmpty', () => {
  it('shows no open roles message when no filters', () => {
    render(<CareersEmpty hasFilters={false} onClear={vi.fn()} />)
    expect(screen.getByText('No open roles right now')).toBeInTheDocument()
  })

  it('shows general application link when no filters', () => {
    render(<CareersEmpty hasFilters={false} onClear={vi.fn()} />)
    expect(screen.getByText('Send a general application')).toBeInTheDocument()
  })

  it('shows no match message when filters are active', () => {
    render(<CareersEmpty hasFilters={true} onClear={vi.fn()} />)
    expect(screen.getByText('No roles match your filters')).toBeInTheDocument()
  })

  it('shows clear filters button when filters are active', () => {
    render(<CareersEmpty hasFilters={true} onClear={vi.fn()} />)
    expect(screen.getByText('Clear filters')).toBeInTheDocument()
  })

  it('calls onClear when clear filters is clicked', () => {
    const onClear = vi.fn()
    render(<CareersEmpty hasFilters={true} onClear={onClear} />)
    fireEvent.click(screen.getByText('Clear filters'))
    expect(onClear).toHaveBeenCalled()
  })
})

describe('CareersHero', () => {
  it('renders hiring badge', () => {
    render(<CareersHero openCount={5} />)
    expect(screen.getByText(/We're hiring/)).toBeInTheDocument()
  })

  it('shows open roles count', () => {
    render(<CareersHero openCount={5} />)
    expect(screen.getByText('5 open roles')).toBeInTheDocument()
  })

  it('shows singular role for count of 1', () => {
    render(<CareersHero openCount={1} />)
    expect(screen.getByText('1 open role')).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<CareersHero openCount={3} />)
    expect(screen.getByText('Build the future of')).toBeInTheDocument()
    expect(screen.getByText('focused work.')).toBeInTheDocument()
  })

  it('renders culture pills', () => {
    render(<CareersHero openCount={3} />)
    expect(screen.getByText('Remote-first culture')).toBeInTheDocument()
    expect(screen.getByText('Async-friendly')).toBeInTheDocument()
  })

  it('shows see open roles link when openCount > 0', () => {
    render(<CareersHero openCount={3} />)
    expect(screen.getByText('See open roles')).toBeInTheDocument()
  })

  it('hides see open roles link when openCount is 0', () => {
    render(<CareersHero openCount={0} />)
    expect(screen.queryByText('See open roles')).not.toBeInTheDocument()
  })
})

describe('CareersValues', () => {
  it('renders values heading', () => {
    render(<CareersValues />)
    expect(screen.getByText('Why Focura')).toBeInTheDocument()
    expect(screen.getByText(/What it's like to work here/)).toBeInTheDocument()
  })

  it('renders all values', () => {
    render(<CareersValues />)
    expect(screen.getByText('Craft over velocity')).toBeInTheDocument()
    expect(screen.getByText('Remote-first by design')).toBeInTheDocument()
    expect(screen.getByText('Real ownership')).toBeInTheDocument()
    expect(screen.getByText('Honest communication')).toBeInTheDocument()
    expect(screen.getByText('Users first, always')).toBeInTheDocument()
    expect(screen.getByText('Sustainable pace')).toBeInTheDocument()
  })
})
