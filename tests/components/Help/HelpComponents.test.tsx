import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HelpHero } from '@/components/Help/HelpHero'
import { HelpContactCard } from '@/components/Help/HelpContactCard'
import { HelpCategories, HELP_CATEGORIES } from '@/components/Help/HelpCategories'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('HelpHero', () => {
  it('renders heading', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByText('How can we help?')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search for anything…')).toBeInTheDocument()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<HelpHero onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Search for anything…')
    fireEvent.change(input, { target: { value: 'tasks' } })
    expect(onSearch).toHaveBeenCalledWith('tasks')
  })

  it('renders quick links', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByText('Getting started')).toBeInTheDocument()
    expect(screen.getByText('Create a task')).toBeInTheDocument()
    expect(screen.getByText('Kanban board')).toBeInTheDocument()
  })

  it('calls onSearch when quick link is clicked', () => {
    const onSearch = vi.fn()
    render(<HelpHero onSearch={onSearch} />)
    fireEvent.click(screen.getByText('Getting started'))
    expect(onSearch).toHaveBeenCalledWith('Getting started')
  })
})

describe('HelpContactCard', () => {
  it('renders still need help heading', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Still need help?')).toBeInTheDocument()
  })

  it('renders contact channels', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Contact Support')).toBeInTheDocument()
    expect(screen.getByText('Email Us Directly')).toBeInTheDocument()
    expect(screen.getByText('Security Issues')).toBeInTheDocument()
    expect(screen.getByText('GitHub Issues')).toBeInTheDocument()
  })

  it('renders developer docs section', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Developer & Legal Documentation')).toBeInTheDocument()
    expect(screen.getByText('Architecture Documentation')).toBeInTheDocument()
    expect(screen.getByText('Contributing Guidelines')).toBeInTheDocument()
  })

  it('renders legal links', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument()
  })
})

describe('HelpCategories', () => {
  it('renders all categories', () => {
    const onCategoryClick = vi.fn()
    render(<HelpCategories onCategoryClick={onCategoryClick} />)
    HELP_CATEGORIES.forEach(cat => {
      expect(screen.getByText(cat.title)).toBeInTheDocument()
    })
  })

  it('renders category descriptions', () => {
    const onCategoryClick = vi.fn()
    render(<HelpCategories onCategoryClick={onCategoryClick} />)
    expect(screen.getByText(/Account setup, workspace creation/)).toBeInTheDocument()
  })

  it('renders article counts', () => {
    const onCategoryClick = vi.fn()
    render(<HelpCategories onCategoryClick={onCategoryClick} />)
    const articleCounts = screen.getAllByText(/articles/)
    expect(articleCounts.length).toBeGreaterThan(0)
  })

  it('calls onCategoryClick when category is clicked', () => {
    const onCategoryClick = vi.fn()
    render(<HelpCategories onCategoryClick={onCategoryClick} />)
    fireEvent.click(screen.getByText('Getting Started'))
    expect(onCategoryClick).toHaveBeenCalledWith('getting-started')
  })
})
