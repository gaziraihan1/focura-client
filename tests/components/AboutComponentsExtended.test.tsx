import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    const { fill, ...rest } = props
    return <img {...rest} data-fill={fill} />
  },
}))

// ─── AboutMission ────────────────────────────────────────────────────────────
import { AboutMission } from '@/components/About/AboutMission'

describe('AboutMission', () => {
  it('renders the label', () => {
    render(<AboutMission />)
    expect(screen.getByText('Why Focura Exists')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<AboutMission />)
    expect(screen.getByText('The modern team is overloaded.')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<AboutMission />)
    expect(screen.getByText(/Scattered tasks\. Siloed projects/)).toBeInTheDocument()
  })

  it('renders all three pillars', () => {
    render(<AboutMission />)
    expect(screen.getByText('Clarity Over Chaos')).toBeInTheDocument()
    expect(screen.getByText('Protect Deep Work')).toBeInTheDocument()
    expect(screen.getByText('Built for Real Teams')).toBeInTheDocument()
  })

  it('renders pillar descriptions', () => {
    render(<AboutMission />)
    expect(screen.getByText(/Most teams don't fail because/)).toBeInTheDocument()
    expect(screen.getByText(/Shallow busyness is the enemy/)).toBeInTheDocument()
    expect(screen.getByText(/Not solo todo lists/)).toBeInTheDocument()
  })
})

// ─── AboutValues ─────────────────────────────────────────────────────────────
import { AboutValues } from '@/components/About/AboutValues'

describe('AboutValues', () => {
  it('renders the label', () => {
    render(<AboutValues />)
    expect(screen.getByText('Engineering Principles')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<AboutValues />)
    expect(screen.getByText(/Values baked into/)).toBeInTheDocument()
  })

  it('renders all six value cards', () => {
    render(<AboutValues />)
    expect(screen.getByText('Security is Non-Negotiable')).toBeInTheDocument()
    expect(screen.getByText('Performance by Default')).toBeInTheDocument()
    expect(screen.getByText('Composable Architecture')).toBeInTheDocument()
    expect(screen.getByText('Full Type Safety')).toBeInTheDocument()
    expect(screen.getByText('Designed to be Tested')).toBeInTheDocument()
    expect(screen.getByText('Real-Time Without Compromise')).toBeInTheDocument()
  })

  it('renders value tags', () => {
    render(<AboutValues />)
    expect(screen.getByText('Security-First')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Composability')).toBeInTheDocument()
    expect(screen.getByText('Type Safety')).toBeInTheDocument()
    expect(screen.getByText('Testability')).toBeInTheDocument()
    expect(screen.getByText('Real-Time')).toBeInTheDocument()
  })

  it('renders value descriptions', () => {
    render(<AboutValues />)
    expect(screen.getByText(/RS256 JWT auth, Argon2id/)).toBeInTheDocument()
    expect(screen.getByText(/Server Components minimise client JS/)).toBeInTheDocument()
  })
})

// ─── AboutStack ──────────────────────────────────────────────────────────────
import { AboutStack } from '@/components/About/AboutStack'

describe('AboutStack', () => {
  it('renders the label', () => {
    render(<AboutStack />)
    expect(screen.getByText('Under the Hood')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<AboutStack />)
    expect(screen.getByText('A stack built for')).toBeInTheDocument()
  })

  it('renders all six stack categories', () => {
    render(<AboutStack />)
    expect(screen.getByText('Core Framework')).toBeInTheDocument()
    expect(screen.getByText('Styling & Motion')).toBeInTheDocument()
    expect(screen.getByText('Data & State')).toBeInTheDocument()
    expect(screen.getByText('Forms & Validation')).toBeInTheDocument()
    expect(screen.getByText('Auth & Security')).toBeInTheDocument()
    expect(screen.getByText('Infrastructure')).toBeInTheDocument()
  })

  it('renders technology names', () => {
    render(<AboutStack />)
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    expect(screen.getByText('TanStack Query')).toBeInTheDocument()
  })

  it('renders version numbers', () => {
    render(<AboutStack />)
    expect(screen.getByText('v16.0.10')).toBeInTheDocument()
    expect(screen.getByText('v19.2.0')).toBeInTheDocument()
  })

  it('renders role descriptions', () => {
    render(<AboutStack />)
    expect(screen.getByText('App Router — SSR, RSC, API routes')).toBeInTheDocument()
  })
})

// ─── AboutFeatures ───────────────────────────────────────────────────────────
import { AboutFeatures } from '@/components/About/AboutFeatures'

describe('AboutFeatures', () => {
  it('renders the label', () => {
    render(<AboutFeatures />)
    expect(screen.getByText('What Focura Ships')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<AboutFeatures />)
    expect(screen.getByText('Everything a team needs.')).toBeInTheDocument()
  })

  it('renders all eight feature cards', () => {
    render(<AboutFeatures />)
    expect(screen.getByText('Task & Project Management')).toBeInTheDocument()
    expect(screen.getByText('Four Work Views')).toBeInTheDocument()
    expect(screen.getByText('Focus Sessions')).toBeInTheDocument()
    expect(screen.getByText('Real-Time Collaboration')).toBeInTheDocument()
    expect(screen.getByText('Analytics & Insights')).toBeInTheDocument()
    expect(screen.getByText('File & Storage Management')).toBeInTheDocument()
    expect(screen.getByText('Billing & Subscriptions')).toBeInTheDocument()
    expect(screen.getByText('Role-Based Access Control')).toBeInTheDocument()
  })

  it('renders feature highlight tags', () => {
    render(<AboutFeatures />)
    expect(screen.getByText('Subtask hierarchy')).toBeInTheDocument()
    expect(screen.getByText('Pomodoro mode')).toBeInTheDocument()
    expect(screen.getByText('SSE real-time')).toBeInTheDocument()
  })
})

// ─── AboutArchitecture ───────────────────────────────────────────────────────
import { AboutArchitecture } from '@/components/About/AboutArchitecture'

describe('AboutArchitecture', () => {
  it('renders the label', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText("How It's Built")).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText('Architecture built to scale.')).toBeInTheDocument()
  })

  it('renders the three-layer architecture label', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText('Three-Layer Architecture')).toBeInTheDocument()
  })

  it('renders all three layer titles', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText('Frontend Layer')).toBeInTheDocument()
    expect(screen.getByText('Backend API Layer')).toBeInTheDocument()
    expect(screen.getByText('Data Layer')).toBeInTheDocument()
  })

  it('renders layer sublabels', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText(/Next\.js 16 \+ React 19/)).toBeInTheDocument()
    expect(screen.getByText(/Express\.js \+ Node\.js/)).toBeInTheDocument()
    expect(screen.getByText(/PostgreSQL \+ Prisma/)).toBeInTheDocument()
  })

  it('renders the data flow section', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText(/Request Lifecycle/)).toBeInTheDocument()
  })

  it('renders SSE callout', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText('Real-Time via SSE')).toBeInTheDocument()
  })

  it('renders auth token flow', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText('Auth Token Flow')).toBeInTheDocument()
  })

  it('renders auth flow steps', () => {
    render(<AboutArchitecture />)
    expect(screen.getByText('Login / OAuth')).toBeInTheDocument()
    expect(screen.getByText('HMAC proof')).toBeInTheDocument()
    expect(screen.getByText('RS256 JWT issued')).toBeInTheDocument()
  })
})

// ─── AboutFounder ────────────────────────────────────────────────────────────
import { AboutFounder } from '@/components/About/AboutFounder'

describe('AboutFounder', () => {
  it('renders the label', () => {
    render(<AboutFounder />)
    expect(screen.getByText('The Person Behind It')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<AboutFounder />)
    expect(screen.getByText('Built by one developer,')).toBeInTheDocument()
  })

  it('renders founder name in text', () => {
    render(<AboutFounder />)
    expect(screen.getAllByText(/Mohammad Raihan Gazi/).length).toBeGreaterThanOrEqual(2)
  })

  it('renders GitHub and website links', () => {
    render(<AboutFounder />)
    expect(screen.getByText('@gaziraihan1')).toBeInTheDocument()
    expect(screen.getByText('focura-client.vercel.app')).toBeInTheDocument()
  })

  it('renders stats', () => {
    render(<AboutFounder />)
    expect(screen.getByText('130+')).toBeInTheDocument()
    expect(screen.getByText('80+')).toBeInTheDocument()
    expect(screen.getAllByText('99.9%').length).toBeGreaterThanOrEqual(1)
  })

  it('renders tech stack tags', () => {
    render(<AboutFounder />)
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('React 19')).toBeInTheDocument()
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
  })

  it('renders repository languages', () => {
    render(<AboutFounder />)
    expect(screen.getByText('Repository Languages')).toBeInTheDocument()
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
  })
})

// ─── AboutOpenSource ─────────────────────────────────────────────────────────
import { AboutOpenSource } from '@/components/About/AboutOpenSource'

describe('AboutOpenSource', () => {
  it('renders the label', () => {
    render(<AboutOpenSource />)
    expect(screen.getByText('Open Contribution')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<AboutOpenSource />)
    expect(screen.getByText('Source-available.')).toBeInTheDocument()
  })

  it('renders contribution steps', () => {
    render(<AboutOpenSource />)
    expect(screen.getByText('Fork the repo')).toBeInTheDocument()
    expect(screen.getByText('Create a feature branch')).toBeInTheDocument()
    expect(screen.getByText('Follow the conventions')).toBeInTheDocument()
    expect(screen.getByText('Open a Pull Request')).toBeInTheDocument()
  })

  it('renders step details', () => {
    render(<AboutOpenSource />)
    expect(screen.getByText(/Fork gaziraihan1\/focura-client/)).toBeInTheDocument()
  })

  it('renders resource links', () => {
    render(<AboutOpenSource />)
    expect(screen.getByText('ARCHITECTURE.md')).toBeInTheDocument()
    expect(screen.getByText('CONTRIBUTING.md')).toBeInTheDocument()
    expect(screen.getByText('CODE_OF_CONDUCT.md')).toBeInTheDocument()
    expect(screen.getByText('Backend Repository')).toBeInTheDocument()
  })

  it('renders security note', () => {
    render(<AboutOpenSource />)
    expect(screen.getByText(/Security vulnerabilities/)).toBeInTheDocument()
  })
})
