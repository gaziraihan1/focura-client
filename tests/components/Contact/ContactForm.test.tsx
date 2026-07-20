import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactForm } from '@/components/Contact/ContactForm'

vi.mock('lucide-react', () => ({
  Send: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="send-icon" {...props} />,
  CheckCircle2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-circle" {...props} />,
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="alert-circle" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader" {...props} />,
}))

vi.mock('@/components/Contact/ContactFormFields', () => ({
  ContactFields: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="contact-fields" />,
}))

describe('ContactForm', () => {
  it('renders the Send Message button', () => {
    render(<ContactForm />)
    expect(screen.getByText('Send Message')).toBeInTheDocument()
  })

  it('renders the rate limit notice', () => {
    render(<ContactForm />)
    expect(screen.getByText(/Rate limited to 3 messages/)).toBeInTheDocument()
  })

  it('renders the form with aria-label', () => {
    render(<ContactForm />)
    expect(screen.getByRole('form', { name: 'Contact form' })).toBeInTheDocument()
  })

  it('renders the ContactFields component', () => {
    render(<ContactForm />)
    expect(screen.getByTestId('contact-fields')).toBeInTheDocument()
  })
})
