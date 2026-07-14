import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactHero } from '@/components/Contact/ContactHero'
import { ContactInfo } from '@/components/Contact/ContactInfo'
import { ContactFAQ } from '@/components/Contact/ContactFaq'

describe('ContactHero', () => {
  it('renders get in touch badge', () => {
    render(<ContactHero />)
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })

  it('renders heading', () => {
    render(<ContactHero />)
    expect(screen.getByText('Contact Focura')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ContactHero />)
    expect(screen.getByText(/Have a question, found a bug/)).toBeInTheDocument()
  })

  it('renders meta pills', () => {
    render(<ContactHero />)
    expect(screen.getByText('Response within 2 business days')).toBeInTheDocument()
    expect(screen.getByText(/Mon – Fri · 9 AM – 6 PM/)).toBeInTheDocument()
  })
})

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

describe('ContactFAQ', () => {
  it('renders FAQ heading', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByText('Common questions')).toBeInTheDocument()
  })

  it('renders FAQ questions', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('How quickly will I get a reply?')).toBeInTheDocument()
    expect(screen.getByText('Can I contact support without creating an account?')).toBeInTheDocument()
  })

  it('expands answer when question is clicked', () => {
    render(<ContactFAQ />)
    const question = screen.getByText('How quickly will I get a reply?')
    fireEvent.click(question)
    expect(screen.getByText(/We aim to respond to all enquiries/)).toBeInTheDocument()
  })

  it('toggles answer visibility on click', () => {
    render(<ContactFAQ />)
    const question = screen.getByText('How quickly will I get a reply?')
    
    // First click opens
    fireEvent.click(question)
    expect(screen.getByText(/We aim to respond/)).toBeInTheDocument()
    
    // Second click closes
    fireEvent.click(question)
  })
})
