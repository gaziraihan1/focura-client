import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { faqs, testimonials, features, integrations, plans } from '@/constants/home.constants'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, alt = "", ...imgProps } = props
    return <img alt={alt} {...imgProps} data-fill={fill} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock IntersectionObserver for framer-motion
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ─── FAQSection ──────────────────────────────────────────────────────────────
import FAQSection from '@/components/Home/FAQSection'

describe('FAQSection', () => {
  it('renders the heading', () => {
    render(<FAQSection />)
    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument()
  })

  it('renders all FAQ questions', () => {
    render(<FAQSection />)
    faqs.forEach((faq) => {
      expect(screen.getByText(faq.q)).toBeInTheDocument()
    })
  })

  it('shows answer when a question is clicked', () => {
    render(<FAQSection />)
    fireEvent.click(screen.getByText(faqs[0].q))
    expect(screen.getByText(faqs[0].a)).toBeInTheDocument()
  })

  it('opens different answers when different questions are clicked', () => {
    render(<FAQSection />)
    fireEvent.click(screen.getByText(faqs[0].q))
    expect(screen.getByText(faqs[0].a)).toBeInTheDocument()
    fireEvent.click(screen.getByText(faqs[1].q))
    expect(screen.getByText(faqs[1].a)).toBeInTheDocument()
  })
})

// ─── WorkflowSteps ───────────────────────────────────────────────────────────
import WorkflowSteps from '@/components/Home/WorkflowSteps'

describe('WorkflowSteps', () => {
  it('renders the heading', () => {
    render(<WorkflowSteps />)
    expect(screen.getByText('How Focura streamlines your workflow')).toBeInTheDocument()
  })

  it('renders all four steps', () => {
    render(<WorkflowSteps />)
    expect(screen.getByText('Plan with clarity')).toBeInTheDocument()
    expect(screen.getByText('Collaborate in real time')).toBeInTheDocument()
    expect(screen.getByText('Execute with confidence')).toBeInTheDocument()
    expect(screen.getByText('Review & improve')).toBeInTheDocument()
  })

  it('renders step descriptions', () => {
    render(<WorkflowSteps />)
    expect(screen.getByText(/Create organized roadmaps/)).toBeInTheDocument()
    expect(screen.getByText(/Discuss tasks, share updates/)).toBeInTheDocument()
  })
})

// ─── FeatureSection ──────────────────────────────────────────────────────────
import FeatureSection from '@/components/Home/FeatureSection'

describe('FeatureSection', () => {
  it('renders the heading', () => {
    render(<FeatureSection />)
    expect(screen.getByText('A Platform Built for Modern Teams')).toBeInTheDocument()
  })

  it('renders all three feature cards', () => {
    render(<FeatureSection />)
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument()
    expect(screen.getByText('All-in-One Workspace')).toBeInTheDocument()
    expect(screen.getByText('Secure by Default')).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<FeatureSection />)
    expect(screen.getByText(/Designed for speed/)).toBeInTheDocument()
    expect(screen.getByText(/Manage tasks, docs, teams/)).toBeInTheDocument()
    expect(screen.getByText(/Enterprise-grade protection/)).toBeInTheDocument()
  })
})

// ─── SecuritySection ─────────────────────────────────────────────────────────
import SecuritySection from '@/components/Home/SecuritySection'

describe('SecuritySection', () => {
  it('renders the heading', () => {
    render(<SecuritySection />)
    expect(screen.getByText('Security you can rely on')).toBeInTheDocument()
  })

  it('renders all four security items', () => {
    render(<SecuritySection />)
    expect(screen.getByText('Enterprise-grade protection')).toBeInTheDocument()
    expect(screen.getByText('End-to-end encryption')).toBeInTheDocument()
    expect(screen.getByText('Secure cloud infrastructure')).toBeInTheDocument()
    expect(screen.getByText('Role-based access control')).toBeInTheDocument()
  })

  it('renders descriptions for each item', () => {
    render(<SecuritySection />)
    expect(screen.getByText(/Focura uses industry-standard encryption/)).toBeInTheDocument()
    expect(screen.getByText(/All data is encrypted in transit/)).toBeInTheDocument()
  })
})

// ─── Hero ────────────────────────────────────────────────────────────────────
import Hero from '@/components/Home/Hero'

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />)
    expect(screen.getByText('One tool to manage')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Hero />)
    expect(screen.getByText('Start for Free')).toBeInTheDocument()
    expect(screen.getByText('Get a Demo')).toBeInTheDocument()
  })

  it('renders the badge text', () => {
    render(<Hero />)
    expect(screen.getByText(/Built for fast-moving teams/)).toBeInTheDocument()
  })

  it('renders trust text', () => {
    render(<Hero />)
    expect(screen.getByText(/More than.*people Trust us/)).toBeInTheDocument()
  })

  it('links to correct URLs', () => {
    render(<Hero />)
    const startBtn = screen.getByText('Start for Free').closest('a')
    expect(startBtn).toHaveAttribute('href', '/get-started')
    const demoBtn = screen.getByText('Get a Demo').closest('a')
    expect(demoBtn).toHaveAttribute('href', '/demo')
  })
})

// ─── FinalCTA ────────────────────────────────────────────────────────────────
import FinalCTA from '@/components/Home/FinalCTA'

describe('FinalCTA', () => {
  it('renders the heading', () => {
    render(<FinalCTA />)
    expect(screen.getByText(/Boost Your Productivity/)).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<FinalCTA />)
    expect(screen.getByText(/Join thousands of professionals/)).toBeInTheDocument()
  })

  it('renders the waitlist button', () => {
    render(<FinalCTA />)
    expect(screen.getByText('Join The Waitlist')).toBeInTheDocument()
  })

  it('renders no credit card notice', () => {
    render(<FinalCTA />)
    expect(screen.getByText('No credit card required. Cancel anytime.')).toBeInTheDocument()
  })
})

// ─── Testimonials ────────────────────────────────────────────────────────────
import TestimonialSection from '@/components/Home/Testimonials'

describe('Testimonials', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the heading', () => {
    render(<TestimonialSection />)
    expect(screen.getByText('Loved by teams everywhere')).toBeInTheDocument()
  })

  it('renders the first testimonial initially', () => {
    render(<TestimonialSection />)
    expect(screen.getByText(testimonials[0].name)).toBeInTheDocument()
    expect(screen.getByText(testimonials[0].role)).toBeInTheDocument()
  })

  it('renders testimonial quotes', () => {
    render(<TestimonialSection />)
    expect(screen.getByText(new RegExp(testimonials[0].quote))).toBeInTheDocument()
  })

  it('renders navigation dots', () => {
    render(<TestimonialSection />)
    const dots = screen.getAllByRole('button').filter(b => b.className.includes('rounded-full'))
    expect(dots.length).toBe(testimonials.length)
  })
})

// ─── FeatureShowcase ─────────────────────────────────────────────────────────
import FeatureShowcase from '@/components/Home/FeatureShowcase'

describe('FeatureShowcase', () => {
  it('renders the heading', () => {
    render(<FeatureShowcase />)
    expect(screen.getByText('Powerful features that help your team move faster')).toBeInTheDocument()
  })

  it('renders feature titles from constants', () => {
    render(<FeatureShowcase />)
    features.forEach((f) => {
      expect(screen.getByText(f.title)).toBeInTheDocument()
    })
  })

  it('renders Learn more buttons', () => {
    render(<FeatureShowcase />)
    const learnMoreButtons = screen.getAllByText('Learn more')
    expect(learnMoreButtons.length).toBe(features.length)
  })
})

// ─── IntegrationsSection ─────────────────────────────────────────────────────
import IntegrationsSection from '@/components/Home/IntegrationsSection'

describe('IntegrationsSection', () => {
  it('renders the heading', () => {
    render(<IntegrationsSection />)
    expect(screen.getByText('Works seamlessly with your tools')).toBeInTheDocument()
  })

  it('renders all integration names', () => {
    render(<IntegrationsSection />)
    integrations.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument()
    })
  })

  it('renders the explore button', () => {
    render(<IntegrationsSection />)
    expect(screen.getByText('Explore All Integrations')).toBeInTheDocument()
  })
})

// ─── PricingSection ──────────────────────────────────────────────────────────
import PricingSection from '@/components/Home/PricingSection'

describe('PricingSection', () => {
  it('renders the heading', () => {
    render(<PricingSection />)
    expect(screen.getByText('Simple, transparent pricing')).toBeInTheDocument()
  })

  it('renders all plan names', () => {
    render(<PricingSection />)
    plans.forEach((plan) => {
      expect(screen.getByText(plan.name)).toBeInTheDocument()
    })
  })

  it('renders plan prices', () => {
    render(<PricingSection />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('$12')).toBeInTheDocument()
    expect(screen.getByText('$49')).toBeInTheDocument()
  })

  it('renders Most Popular badge for highlighted plan', () => {
    render(<PricingSection />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('renders Get Started buttons', () => {
    render(<PricingSection />)
    const buttons = screen.getAllByText('Get Started')
    expect(buttons.length).toBe(3)
  })

  it('renders feature lists for plans', () => {
    render(<PricingSection />)
    expect(screen.getByText('Up to 3 projects')).toBeInTheDocument()
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument()
  })
})

// ─── ProductShowcase ─────────────────────────────────────────────────────────
import ProductShowcase from '@/components/Home/ProductShowcase'

describe('ProductShowcase', () => {
  it('renders the heading', () => {
    render(<ProductShowcase />)
    expect(screen.getByText(/See your team.s work come alive/)).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<ProductShowcase />)
    expect(screen.getByText(/Focura brings clarity to your workflow/)).toBeInTheDocument()
  })

  it('renders the dashboard mockup image', () => {
    render(<ProductShowcase />)
    const img = screen.getByAltText('Product dashboard mockup')
    expect(img).toBeInTheDocument()
  })

  it('renders the Task Progress overlay', () => {
    render(<ProductShowcase />)
    expect(screen.getByText('Task Progress')).toBeInTheDocument()
  })

  it('renders the Team Activity overlay', () => {
    render(<ProductShowcase />)
    expect(screen.getByText('Team Activity')).toBeInTheDocument()
  })
})
