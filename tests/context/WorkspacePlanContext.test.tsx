import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkspacePlanProvider, useWorkspacePlan } from '@/context/workspacePlan/WorkspacePlanContext'

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}))

import { useWorkspace } from '@/hooks/useWorkspace'

function TestConsumer() {
  const ctx = useWorkspacePlan()
  return (
    <div>
      <span data-testid="plan">{ctx.planName}</span>
      <span data-testid="isLoading">{String(ctx.isLoading)}</span>
      <span data-testid="isFree">{String(ctx.isFree)}</span>
      <span data-testid="isPro">{String(ctx.isPro)}</span>
      <span data-testid="isPaid">{String(ctx.isPaid)}</span>
      <span data-testid="hasPro">{String(ctx.hasPlan('PRO'))}</span>
    </div>
  )
}

describe('WorkspacePlanContext', () => {
  it('provides FREE plan data', () => {
    vi.mocked(useWorkspace).mockReturnValue({
      data: { plan: 'FREE' },
      isLoading: false,
    } as any as Record<string, unknown>)

    render(
      <WorkspacePlanProvider slug="test">
        <TestConsumer />
      </WorkspacePlanProvider>
    )

    expect(screen.getByTestId('plan')).toHaveTextContent('FREE')
    expect(screen.getByTestId('isFree')).toHaveTextContent('true')
    expect(screen.getByTestId('isPro')).toHaveTextContent('false')
    expect(screen.getByTestId('isPaid')).toHaveTextContent('false')
  })

  it('provides PRO plan data', () => {
    vi.mocked(useWorkspace).mockReturnValue({
      data: { plan: 'PRO' },
      isLoading: false,
    } as any as Record<string, unknown>)

    render(
      <WorkspacePlanProvider slug="test">
        <TestConsumer />
      </WorkspacePlanProvider>
    )

    expect(screen.getByTestId('plan')).toHaveTextContent('PRO')
    expect(screen.getByTestId('isFree')).toHaveTextContent('false')
    expect(screen.getByTestId('isPro')).toHaveTextContent('true')
    expect(screen.getByTestId('isPaid')).toHaveTextContent('true')
  })

  it('provides BUSINESS plan data', () => {
    vi.mocked(useWorkspace).mockReturnValue({
      data: { plan: 'BUSINESS' },
      isLoading: false,
    } as any as Record<string, unknown>)

    render(
      <WorkspacePlanProvider slug="test">
        <TestConsumer />
      </WorkspacePlanProvider>
    )

    expect(screen.getByTestId('plan')).toHaveTextContent('BUSINESS')
    expect(screen.getByTestId('isPaid')).toHaveTextContent('true')
  })

  it('handles loading state', () => {
    vi.mocked(useWorkspace).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any as Record<string, unknown>)

    render(
      <WorkspacePlanProvider slug="test">
        <TestConsumer />
      </WorkspacePlanProvider>
    )

    expect(screen.getByTestId('isLoading')).toHaveTextContent('true')
    expect(screen.getByTestId('plan')).toHaveTextContent('')
  })

  it('hasPlan returns correct boolean', () => {
    vi.mocked(useWorkspace).mockReturnValue({
      data: { plan: 'PRO' },
      isLoading: false,
    } as any as Record<string, unknown>)

    render(
      <WorkspacePlanProvider slug="test">
        <TestConsumer />
      </WorkspacePlanProvider>
    )

    expect(screen.getByTestId('hasPro')).toHaveTextContent('true')
  })

  it('throws when useWorkspacePlan is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow(
      'useWorkspacePlan must be used inside WorkspacePlanProvider'
    )

    consoleSpy.mockRestore()
  })
})
