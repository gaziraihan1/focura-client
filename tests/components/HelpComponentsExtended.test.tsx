import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// ─── HelpHero ────────────────────────────────────────────────────────────────
import { HelpHero } from '@/components/Help/HelpHero'

describe('HelpHero', () => {
  it('renders the badge', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByText('Focura Help Center')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByText('How can we help?')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByText(/Search guides, answers/)).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText(/Search for anything/)).toBeInTheDocument()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<HelpHero onSearch={onSearch} />)
    fireEvent.change(screen.getByPlaceholderText(/Search for anything/), { target: { value: 'task' } })
    expect(onSearch).toHaveBeenCalledWith('task')
  })

  it('renders all quick links', () => {
    render(<HelpHero onSearch={vi.fn()} />)
    expect(screen.getByText('Getting started')).toBeInTheDocument()
    expect(screen.getByText('Create a task')).toBeInTheDocument()
    expect(screen.getByText('Invite team members')).toBeInTheDocument()
    expect(screen.getByText('Kanban board')).toBeInTheDocument()
    expect(screen.getByText('Focus sessions')).toBeInTheDocument()
    expect(screen.getByText('Billing & plans')).toBeInTheDocument()
    expect(screen.getByText('Reset password')).toBeInTheDocument()
    expect(screen.getByText('File uploads')).toBeInTheDocument()
  })

  it('calls onSearch when quick link is clicked', () => {
    const onSearch = vi.fn()
    render(<HelpHero onSearch={onSearch} />)
    fireEvent.click(screen.getByText('Create a task'))
    expect(onSearch).toHaveBeenCalledWith('Create a task')
  })
})

// ─── HelpCategories ──────────────────────────────────────────────────────────
import { HelpCategories, HELP_CATEGORIES } from '@/components/Help/HelpCategories'

describe('HelpCategories', () => {
  it('renders the heading', () => {
    render(<HelpCategories onCategoryClick={vi.fn()} />)
    expect(screen.getByText('All help categories')).toBeInTheDocument()
  })

  it('renders all categories', () => {
    render(<HelpCategories onCategoryClick={vi.fn()} />)
    HELP_CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.title)).toBeInTheDocument()
    })
  })

  it('renders article counts', () => {
    render(<HelpCategories onCategoryClick={vi.fn()} />)
    expect(screen.getAllByText(/articles/).length).toBeGreaterThanOrEqual(1)
  })

  it('calls onCategoryClick when category is clicked', () => {
    const onCategoryClick = vi.fn()
    render(<HelpCategories onCategoryClick={onCategoryClick} />)
    fireEvent.click(screen.getByText('Getting Started'))
    expect(onCategoryClick).toHaveBeenCalledWith('getting-started')
  })
})

// ─── HelpGettingStarted ──────────────────────────────────────────────────────
import { HelpGettingStarted } from '@/components/Help/HelpGettingStarted'

describe('HelpGettingStarted', () => {
  it('renders the heading', () => {
    render(<HelpGettingStarted />)
    expect(screen.getByText('Set up Focura in 6 steps')).toBeInTheDocument()
  })

  it('renders all 6 steps', () => {
    render(<HelpGettingStarted />)
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByText('Create your first workspace')).toBeInTheDocument()
    expect(screen.getByText('Invite your team')).toBeInTheDocument()
    expect(screen.getByText('Create a project')).toBeInTheDocument()
    expect(screen.getByText('Add your first task')).toBeInTheDocument()
    expect(screen.getByText('Start your first focus session')).toBeInTheDocument()
  })

  it('renders step numbers', () => {
    render(<HelpGettingStarted />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('06')).toBeInTheDocument()
  })

  it('renders tips for steps', () => {
    render(<HelpGettingStarted />)
    expect(screen.getByText(/Use Google OAuth to skip/)).toBeInTheDocument()
  })

  it('renders contact support link', () => {
    render(<HelpGettingStarted />)
    expect(screen.getByText('Still stuck? Contact support')).toBeInTheDocument()
  })
})

// ─── HelpSearchResults ───────────────────────────────────────────────────────
import { HelpSearchResults } from '@/components/Help/HelpSearchResults'

describe('HelpSearchResults', () => {
  it('renders nothing when query is empty', () => {
    const { container } = render(<HelpSearchResults query="" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing when query is whitespace', () => {
    const { container } = render(<HelpSearchResults query="   " />)
    expect(container.innerHTML).toBe('')
  })

  it('renders article results for matching query', () => {
    render(<HelpSearchResults query="task" />)
    expect(screen.getByText(/result/)).toBeInTheDocument()
  })

  it('renders no results message for unmatched query', () => {
    render(<HelpSearchResults query="xyznonexistent" />)
    expect(screen.getByText(/No results for/)).toBeInTheDocument()
  })

  it('renders category matches', () => {
    render(<HelpSearchResults query="billing" />)
    expect(screen.getByText(/result/)).toBeInTheDocument()
  })

  it('renders ask support link on no results', () => {
    render(<HelpSearchResults query="xyznonexistent" />)
    expect(screen.getByText('Ask our support team')).toBeInTheDocument()
  })
})

// ─── HelpFAQ ─────────────────────────────────────────────────────────────────
import { HelpFAQ } from '@/components/Help/HelpFaq'

describe('HelpFAQ', () => {
  it('renders the heading', () => {
    render(<HelpFAQ />)
    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument()
  })

  it('renders FAQ groups', () => {
    render(<HelpFAQ />)
    expect(screen.getByText('Account & Access')).toBeInTheDocument()
    expect(screen.getByText('Workspaces & Teams')).toBeInTheDocument()
    expect(screen.getByText('Tasks & Projects')).toBeInTheDocument()
    expect(screen.getByText('Focus Sessions')).toBeInTheDocument()
    expect(screen.getByText('Billing & Payments')).toBeInTheDocument()
    expect(screen.getByText('Privacy & Security')).toBeInTheDocument()
  })

  it('renders FAQ questions', () => {
    render(<HelpFAQ />)
    expect(screen.getByText(/Can I use Focura without/)).toBeInTheDocument()
  })

  it('toggles FAQ answer on click', () => {
    render(<HelpFAQ />)
    const question = screen.getByText(/Can I use Focura without/)
    expect(question.closest('button')).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(question)
    expect(question.closest('button')).toHaveAttribute('aria-expanded', 'true')
  })
})

// ─── HelpContactCard ─────────────────────────────────────────────────────────
import { HelpContactCard } from '@/components/Help/HelpContactCard'

describe('HelpContactCard', () => {
  it('renders the heading', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Get in touch with us.')).toBeInTheDocument()
  })

  it('renders channel cards', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Contact Support')).toBeInTheDocument()
    expect(screen.getByText('Email Us Directly')).toBeInTheDocument()
    expect(screen.getByText('Security Issues')).toBeInTheDocument()
    expect(screen.getByText('GitHub Issues')).toBeInTheDocument()
  })

  it('renders documentation links', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Architecture Documentation')).toBeInTheDocument()
    expect(screen.getByText('Contributing Guidelines')).toBeInTheDocument()
  })

  it('renders policy links', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument()
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
    expect(screen.getByText('Refund Policy')).toBeInTheDocument()
  })

  it('renders developer docs section', () => {
    render(<HelpContactCard />)
    expect(screen.getByText('Developer & Legal Documentation')).toBeInTheDocument()
  })
})
