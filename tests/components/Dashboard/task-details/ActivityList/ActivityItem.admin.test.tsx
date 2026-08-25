import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt = '', ...rest } = props
    return <img src={src as string} alt={alt} {...rest} />
  },
}))

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />
    Component.displayName = name
    return Component
  }
  return {
    Clock: icon('Clock'),
    ShieldCheck: icon('ShieldCheck'),
    Plus: icon('Plus'),
    Pencil: icon('Pencil'),
    Trash2: icon('Trash2'),
    CheckCircle2: icon('CheckCircle2'),
    Users: icon('Users'),
    MessageSquare: icon('MessageSquare'),
    AlertCircle: icon('AlertCircle'),
    Circle: icon('Circle'),
  }
})

vi.mock('@/components/shared/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}))

import { ActivityItem } from '@/components/dashboard/task-details/ActivityList/ActivityItem'

describe('ActivityItem – Focura-admin workspace-limit changes', () => {
  const adminActivity = {
    id: 'act-admin',
    action: 'UPDATED',
    entityType: 'WORKSPACE',
    createdAt: new Date().toISOString(),
    user: { id: 'admin-1', name: 'Grace Hopper', image: null },
    metadata: {
      source: 'focura-admin',
      changes: {
        aiDailyCalls: { from: null, to: 9000 },
        plan: { from: 'PRO', to: 'ENTERPRISE' },
      },
    },
  }

  it('renders the friendly label, admin badge, shield icon, and change chips', () => {
    render(<ActivityItem activity={adminActivity as never} />)

    // Friendly label instead of raw field names
    expect(screen.getByText(/updated workspace limits/)).toBeInTheDocument()
    // Focura admin attribution badge
    expect(screen.getByText('Focura admin')).toBeInTheDocument()
    // Shield icon differentiates system changes from regular edits
    expect(screen.getByTestId('icon-ShieldCheck')).toBeInTheDocument()
    // Friendly before → after chips
    expect(screen.getByText(/default → 9,000/)).toBeInTheDocument()
    expect(screen.getByText(/PRO → ENTERPRISE/)).toBeInTheDocument()
  })

  it('renders no badge or chips for regular activities', () => {
    const regular = {
      id: 'act-1',
      action: 'UPDATED',
      entityType: 'TASK',
      createdAt: new Date().toISOString(),
      user: { id: 'u1', name: 'Jane Doe', image: null },
      metadata: { changes: { title: 'new title' } },
    }
    render(<ActivityItem activity={regular as never} />)

    expect(screen.queryByText('Focura admin')).not.toBeInTheDocument()
    expect(screen.queryByText(/default → 9,000/)).not.toBeInTheDocument()
    expect(screen.getByTestId('icon-Clock')).toBeInTheDocument()
  })
})
