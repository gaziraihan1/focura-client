import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { PreviewContent } from '@/components/Dashboard/Workspaces/Announcement/PreviewContent'
import { RenderedContent } from '@/components/Dashboard/Workspaces/Announcement/RenderedContent'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

// Mock navigator.clipboard
Object.assign(navigator, { clipboard: { writeText: vi.fn(() => Promise.resolve()) } })

describe('PreviewContent', () => {
  it('shows empty message when raw is empty', () => {
    render(<PreviewContent raw="   " />)
    expect(screen.getByText(/preview will appear/i)).toBeInTheDocument()
  })

  it('renders plain text content', () => {
    render(<PreviewContent raw="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders bold text', () => {
    render(<PreviewContent raw="**bold text**" />)
    expect(screen.getByText('bold text')).toBeInTheDocument()
  })

  it('renders italic text', () => {
    render(<PreviewContent raw="//italic text//" />)
    expect(screen.getByText('italic text')).toBeInTheDocument()
  })

  it('renders link', () => {
    render(<PreviewContent raw="{https://example.com|Click here}" />)
    expect(screen.getByText('Click here')).toBeInTheDocument()
  })
})

describe('RenderedContent', () => {
  it('renders plain text', () => {
    render(<RenderedContent raw="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders bold text', () => {
    render(<RenderedContent raw="**strong**" />)
    expect(screen.getByText('strong')).toBeInTheDocument()
  })

  it('renders italic text', () => {
    render(<RenderedContent raw="//emphasis//" />)
    expect(screen.getByText('emphasis')).toBeInTheDocument()
  })

  it('renders link', () => {
    render(<RenderedContent raw="{https://example.com|link}" />)
    expect(screen.getByText('link')).toBeInTheDocument()
  })
})
