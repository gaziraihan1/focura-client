import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/components/shared/EmptyState'
import { Clock } from 'lucide-react'

vi.mock('lucide-react', () => ({
  Clock: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

describe('ActivityEmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState icon={Clock} title="No activities found" description="Activity will appear here as changes are made" />)
    expect(screen.getByText('No activities found')).toBeInTheDocument()
  })
})
