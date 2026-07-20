import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  SectionH, Prose, InfoCard, Tip, Warn, CodeBlock, IC, Badge, Step, StepList, Table, FileTree, DividerLabel, RowList,
} from '@/components/DevGuides/index'

describe('DevGuides SectionH', () => {
  it('renders children', () => {
    render(<SectionH>Getting Started</SectionH>)
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
  })
})

describe('DevGuides Prose', () => {
  it('renders paragraph text', () => {
    render(<Prose>This is a paragraph.</Prose>)
    expect(screen.getByText('This is a paragraph.')).toBeInTheDocument()
  })
})

describe('DevGuides InfoCard', () => {
  it('renders icon, title, and children', () => {
    render(<InfoCard icon="📦" title="Package Info"><span>Details here</span></InfoCard>)
    expect(screen.getByText('Package Info')).toBeInTheDocument()
    expect(screen.getByText('Details here')).toBeInTheDocument()
  })
})

describe('DevGuides Tip', () => {
  it('renders tip content', () => {
    render(<Tip>Use this wisely</Tip>)
    expect(screen.getByText('Use this wisely')).toBeInTheDocument()
  })
})

describe('DevGuides Warn', () => {
  it('renders warning content', () => {
    render(<Warn>Be careful!</Warn>)
    expect(screen.getByText('Be careful!')).toBeInTheDocument()
  })
})

describe('DevGuides CodeBlock', () => {
  it('renders code without label', () => {
    render(<CodeBlock>const x = 1;</CodeBlock>)
    expect(screen.getByText('const x = 1;')).toBeInTheDocument()
  })

  it('renders code with label', () => {
    render(<CodeBlock label="config">key: value</CodeBlock>)
    expect(screen.getByText('config')).toBeInTheDocument()
    expect(screen.getByText('key: value')).toBeInTheDocument()
  })
})

describe('DevGuides IC', () => {
  it('renders inline code', () => {
    render(<IC>useState</IC>)
    expect(screen.getByText('useState')).toBeInTheDocument()
  })
})

describe('DevGuides Badge', () => {
  it('renders with default color', () => {
    render(<Badge>v1.0</Badge>)
    expect(screen.getByText('v1.0')).toBeInTheDocument()
  })

  it('renders with custom color', () => {
    render(<Badge color="blue">Beta</Badge>)
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })
})

describe('DevGuides Step', () => {
  it('renders step number, title, and description', () => {
    render(<Step num={1} title="First Step" desc="Do something" />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('First Step')).toBeInTheDocument()
    expect(screen.getByText('Do something')).toBeInTheDocument()
  })
})

describe('DevGuides StepList', () => {
  it('renders multiple steps', () => {
    const steps = [
      { title: 'Step One', desc: 'First' },
      { title: 'Step Two', desc: 'Second' },
    ]
    render(<StepList steps={steps} />)
    expect(screen.getByText('Step One')).toBeInTheDocument()
    expect(screen.getByText('Step Two')).toBeInTheDocument()
  })
})

describe('DevGuides Table', () => {
  it('renders headers and rows', () => {
    render(<Table headers={['Name', 'Type']} rows={[['foo', 'string'], ['bar', 'number']]} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('foo')).toBeInTheDocument()
    expect(screen.getByText('bar')).toBeInTheDocument()
  })
})

describe('DevGuides FileTree', () => {
  it('renders file tree', () => {
    render(<FileTree>{'src/\n  index.ts'}</FileTree>)
    expect(screen.getByText(/src/)).toBeInTheDocument()
  })
})

describe('DevGuides DividerLabel', () => {
  it('renders label', () => {
    render(<DividerLabel>OR</DividerLabel>)
    expect(screen.getByText('OR')).toBeInTheDocument()
  })
})

describe('DevGuides RowList', () => {
  it('renders items', () => {
    const items = [
      { label: 'PORT', desc: 'Server port' },
      { label: 'HOST', desc: 'Server host' },
    ]
    render(<RowList items={items} />)
    expect(screen.getByText('PORT')).toBeInTheDocument()
    expect(screen.getByText('Server port')).toBeInTheDocument()
  })
})
