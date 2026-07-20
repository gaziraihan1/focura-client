import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest';
import { userEvent } from '@testing-library/user-event'
import TemplatesNotifyBanner from '@/components/Templates/TemplatesNotifyBanner'

describe('TemplatesNotifyBanner', () => {
  it('renders heading', () => {
    render(<TemplatesNotifyBanner />)
    expect(screen.getByText(/be first when templates launch/i)).toBeInTheDocument()
  })

  it('renders email input', () => {
    render(<TemplatesNotifyBanner />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<TemplatesNotifyBanner />)
    expect(screen.getByRole('button', { name: /notify me/i })).toBeInTheDocument()
  })

  it('shows privacy note', () => {
    render(<TemplatesNotifyBanner />)
    expect(screen.getAllByText(/no spam/i).length).toBeGreaterThanOrEqual(1)
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<TemplatesNotifyBanner />)
    await user.type(screen.getByPlaceholderText('your@email.com'), 'invalid')
    await user.click(screen.getByRole('button', { name: /notify me/i }))
    expect(screen.getByText(/valid email/i)).toBeInTheDocument()
  })

  it('disables submit when email is empty', () => {
    render(<TemplatesNotifyBanner />)
    expect(screen.getByRole('button', { name: /notify me/i })).toBeDisabled()
  })
})
