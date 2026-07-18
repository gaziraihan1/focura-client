import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

// ─── ContactHero ─────────────────────────────────────────────────────────────
import { ContactHero } from '@/components/Contact/ContactHero'

describe('ContactHero', () => {
  it('renders the badge', () => {
    render(<ContactHero />)
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<ContactHero />)
    expect(screen.getByText('Contact Focura')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<ContactHero />)
    expect(screen.getByText(/Have a question, found a bug/)).toBeInTheDocument()
  })

  it('renders meta pills', () => {
    render(<ContactHero />)
    expect(screen.getByText(/Response within 2 business days/)).toBeInTheDocument()
    expect(screen.getByText(/Mon – Fri · 9 AM – 6 PM/)).toBeInTheDocument()
    expect(screen.getByText('All enquiries welcome')).toBeInTheDocument()
  })
})

// ─── ContactInfo ─────────────────────────────────────────────────────────────
import { ContactInfo } from '@/components/Contact/ContactInfo'

describe('ContactInfo', () => {
  it('renders channel cards', () => {
    render(<ContactInfo />)
    expect(screen.getByText('General & Billing')).toBeInTheDocument()
    expect(screen.getByText('Security Issues')).toBeInTheDocument()
    expect(screen.getByText('Support Hours')).toBeInTheDocument()
  })

  it('renders email addresses', () => {
    render(<ContactInfo />)
    expect(screen.getByText('focurabusiness@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('security@focura.app')).toBeInTheDocument()
  })

  it('renders support hours', () => {
    render(<ContactInfo />)
    expect(screen.getByText('Mon – Fri · 9 AM – 6 PM')).toBeInTheDocument()
  })

  it('renders channel descriptions', () => {
    render(<ContactInfo />)
    expect(screen.getByText(/For all general enquiries/)).toBeInTheDocument()
    expect(screen.getByText(/Responsible disclosure only/)).toBeInTheDocument()
  })

  it('renders what we help with section', () => {
    render(<ContactInfo />)
    expect(screen.getByText('What we help with')).toBeInTheDocument()
    expect(screen.getByText('Technical Issue')).toBeInTheDocument()
    expect(screen.getByText('Billing & Plans')).toBeInTheDocument()
    expect(screen.getByText('Feature Request')).toBeInTheDocument()
    expect(screen.getByText('Partnership')).toBeInTheDocument()
  })

  it('renders auto-reply notice', () => {
    render(<ContactInfo />)
    expect(screen.getByText(/Auto-reply is instant/)).toBeInTheDocument()
  })
})

// ─── ContactFAQ ──────────────────────────────────────────────────────────────
import { ContactFAQ } from '@/components/Contact/ContactFaq'

describe('ContactFAQ', () => {
  it('renders the FAQ heading', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('Common questions')).toBeInTheDocument()
  })

  it('renders FAQ label', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('renders all FAQ questions', () => {
    render(<ContactFAQ />)
    expect(screen.getByText(/How quickly will I get a reply/)).toBeInTheDocument()
    expect(screen.getByText(/Can I contact support without/)).toBeInTheDocument()
    expect(screen.getByText(/I was charged but can't access/)).toBeInTheDocument()
  })

  it('toggles FAQ answer on click', () => {
    render(<ContactFAQ />)
    const question = screen.getByText(/How quickly will I get a reply/)
    // First FAQ is open by default (aria-expanded=true)
    expect(question.closest('button')).toHaveAttribute('aria-expanded', 'true')
    // Click to close
    fireEvent.click(question)
    expect(question.closest('button')).toHaveAttribute('aria-expanded', 'false')
    // Click to open again
    fireEvent.click(question)
    expect(question.closest('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens a different FAQ when clicked', () => {
    render(<ContactFAQ />)
    const secondQuestion = screen.getByText(/Can I contact support without/)
    fireEvent.click(secondQuestion)
    expect(screen.getByText(/Yes — the contact form is open to everyone/)).toBeInTheDocument()
  })
})

// ─── ContactContent ──────────────────────────────────────────────────────────
import { ContactContent } from '@/components/Contact/ContactContent'

describe('ContactContent', () => {
  it('renders the form panel header', () => {
    render(<ContactContent />)
    expect(screen.getByText('Send us a message')).toBeInTheDocument()
  })

  it('renders required fields notice', () => {
    render(<ContactContent />)
    expect(screen.getByText(/All fields marked with/)).toBeInTheDocument()
  })
})

// ─── ContactForm ─────────────────────────────────────────────────────────────
import { ContactForm } from '@/components/Contact/ContactForm'

describe('ContactForm', () => {
  it('renders the form', () => {
    render(<ContactForm />)
    expect(screen.getByRole('form', { name: /contact form/i })).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('renders consent checkbox', () => {
    render(<ContactForm />)
    expect(screen.getByText(/I agree to Focura's/)).toBeInTheDocument()
  })

  it('renders rate limit notice', () => {
    render(<ContactForm />)
    expect(screen.getByText(/Rate limited to 3 messages/)).toBeInTheDocument()
  })

  it('renders message character counter', () => {
    render(<ContactForm />)
    expect(screen.getByText('0/5000')).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/)).toBeInTheDocument()
    })
  })

  it('shows email validation error', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.type(screen.getByLabelText(/Full Name/), 'John')
    await user.type(screen.getByLabelText(/Email Address/), 'invalid-email')
    await user.type(screen.getByLabelText(/Subject/), 'Test Subject')
    await user.type(screen.getByLabelText(/Message/), 'This is a test message with enough characters.')
    await user.click(screen.getByLabelText(/I agree to Focura's/))
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument()
    })
  })

  it('shows consent validation error', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.type(screen.getByLabelText(/Full Name/), 'John Doe')
    await user.type(screen.getByLabelText(/Email Address/), 'john@example.com')
    await user.type(screen.getByLabelText(/Subject/), 'Test Subject')
    await user.type(screen.getByLabelText(/Message/), 'This is a test message with enough characters.')
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getByText(/You must agree to our Privacy Policy/)).toBeInTheDocument()
    })
  })

  it('updates character count when typing in message', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.type(screen.getByLabelText(/Message/), 'Hello')
    expect(screen.getByText('5/5000')).toBeInTheDocument()
  })

  it('shows all category options', () => {
    render(<ContactForm />)
    expect(screen.getByText('General Enquiry')).toBeInTheDocument()
    expect(screen.getByText('Billing & Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Technical Issue')).toBeInTheDocument()
    expect(screen.getByText('Feature Request')).toBeInTheDocument()
    expect(screen.getByText('Partnership')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })
})
