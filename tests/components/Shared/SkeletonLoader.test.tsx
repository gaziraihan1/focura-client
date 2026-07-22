import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SkeletonLoader, CardSkeleton, ListSkeleton } from '@/components/Shared/SkeletonLoader'

describe('SkeletonLoader', () => {
  it('renders a single skeleton by default', () => {
    const { container } = render(<SkeletonLoader />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(1)
  })

  it('renders multiple skeletons when count > 1', () => {
    const { container } = render(<SkeletonLoader count={3} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(3)
  })

  it('applies custom className to wrapper', () => {
    const { container } = render(<SkeletonLoader className="my-class" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('my-class')
  })

  it('renders text variant by default', () => {
    const { container } = render(<SkeletonLoader variant="text" />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('h-4')
  })

  it('renders circle variant', () => {
    const { container } = render(<SkeletonLoader variant="circle" />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('rounded-full')
  })

  it('renders rect variant', () => {
    const { container } = render(<SkeletonLoader variant="rect" />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('rounded-lg')
  })

  it('renders card variant', () => {
    const { container } = render(<SkeletonLoader variant="card" />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton?.className).toContain('rounded-xl')
  })
})

describe('CardSkeleton', () => {
  it('renders card structure with animate-pulse', () => {
    const { container } = render(<CardSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(3)
  })

  it('renders card wrapper with border', () => {
    const { container } = render(<CardSkeleton />)
    const card = container.querySelector('.rounded-xl.border')
    expect(card).toBeInTheDocument()
  })
})

describe('ListSkeleton', () => {
  it('renders 5 items by default', () => {
    const { container } = render(<ListSkeleton />)
    const items = container.querySelectorAll('.rounded-xl')
    expect(items.length).toBe(5)
  })

  it('renders custom count', () => {
    const { container } = render(<ListSkeleton count={3} />)
    const items = container.querySelectorAll('.rounded-xl')
    expect(items.length).toBe(3)
  })
})
