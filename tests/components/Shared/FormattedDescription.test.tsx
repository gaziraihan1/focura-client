import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormattedDescription } from '@/components/Shared/FormattedDescription'

vi.mock('@/utils/resources.utils', () => ({
  splitDescriptionIntoSentences: (str: string) => str.split('. ').filter(Boolean),
}))

vi.mock('framer-motion', () => ({
  motion: {
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{props.children}</p>,
  },
}))

describe('FormattedDescription', () => {
  it('renders nothing for empty description', () => {
    const { container } = render(<FormattedDescription description="" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders single sentence', () => {
    render(<FormattedDescription description="Hello world" />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders multiple sentences', () => {
    const { container } = render(<FormattedDescription description="First sentence. Second sentence. Third sentence." />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBeGreaterThanOrEqual(2)
  })

  it('applies lede variant class', () => {
    const { container } = render(
      <FormattedDescription description="Hello world" variant="lede" />
    )
    expect(container.querySelector('.text-xl')).toBeInTheDocument()
  })

  it('applies body variant class by default', () => {
    const { container } = render(
      <FormattedDescription description="Hello world" />
    )
    expect(container.querySelector('.text-base')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <FormattedDescription description="Hello world" className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
