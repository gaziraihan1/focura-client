import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryProvider } from '@/context/providers/query-provider'

vi.mock('@tanstack/react-query', () => ({
  QueryClient: class MockQueryClient {},
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}))

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="query-devtools" />,
}))

describe('QueryProvider', () => {
  it('renders children inside QueryClientProvider', () => {
    render(
      <QueryProvider>
        <div>Test child</div>
      </QueryProvider>
    )

    expect(screen.getByText('Test child')).toBeInTheDocument()
    expect(screen.getByTestId('query-provider')).toBeInTheDocument()
  })

  it('renders devtools', () => {
    render(
      <QueryProvider>
        <div>Child</div>
      </QueryProvider>
    )

    expect(screen.getByTestId('query-devtools')).toBeInTheDocument()
  })
})
