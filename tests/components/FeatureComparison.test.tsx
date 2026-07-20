import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FeatureComparison from '@/components/Pricing/FeatureComparison'

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{props.children}</div>,
  },
}))

describe('FeatureComparison', () => {
  it('renders the heading', () => {
    render(<FeatureComparison />)
    expect(screen.getByText('Compare all plans')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<FeatureComparison />)
    expect(screen.getByText(/Every plan includes powerful tools/)).toBeInTheDocument()
  })

  it('renders table headers', () => {
    render(<FeatureComparison />)
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Pro').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Business').length).toBeGreaterThanOrEqual(1)
  })

  it('renders all 7 feature names', () => {
    render(<FeatureComparison />)
    expect(screen.getAllByText('Unlimited Projects').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Real-time Collaboration').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Advanced Analytics').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('AI-Powered Suggestions').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Priority Support').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Team Workspace').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Custom Branding').length).toBeGreaterThanOrEqual(1)
  })
})
