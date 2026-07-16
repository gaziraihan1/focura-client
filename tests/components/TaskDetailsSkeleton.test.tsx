import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import TaskDetailsSkeleton from '@/components/Dashboard/TaskDetails/TaskDetailsSkeleton'

describe('TaskDetailsSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<TaskDetailsSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('has max-width container', () => {
    const { container } = render(<TaskDetailsSkeleton />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('max-w-5xl')
  })
})
