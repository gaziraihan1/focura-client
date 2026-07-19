import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactFAQ } from '@/components/Contact/ContactFaq'

vi.mock('lucide-react', () => ({
  ChevronDown: (props: any) => <svg data-testid="chevron-down" {...props} />,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

describe('ContactFAQ', () => {
  it('renders the FAQ heading', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('Common questions')).toBeInTheDocument()
  })

  it('renders FAQ label', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('renders the first question by default (open)', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('How quickly will I get a reply?')).toBeInTheDocument()
  })

  it('renders all FAQ questions', () => {
    render(<ContactFAQ />)
    expect(screen.getByText('How quickly will I get a reply?')).toBeInTheDocument()
    expect(screen.getByText('Can I contact support without creating an account?')).toBeInTheDocument()
    expect(screen.getByText('I was charged but can\'t access my plan. What should I do?')).toBeInTheDocument()
  })
})
