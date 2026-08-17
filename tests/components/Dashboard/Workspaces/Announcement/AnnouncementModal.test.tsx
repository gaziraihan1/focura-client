import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnnouncementModal } from '@/components/Dashboard/Workspaces/Announcement/AnnouncementModal'

vi.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
}))

vi.mock('lucide-react', () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
  Megaphone: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="megaphone" {...props} />,
  Loader2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="loader" {...props} />,
  Pin: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="pin" {...props} />,
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}))

vi.mock('@/components/Dashboard/Workspaces/Announcement/AnnouncementForm', () => ({
  AnnouncementForm: (props: React.HTMLAttributes<HTMLDivElement>) => <div data-testid="announcement-form" />,
}))

const defaultProps = {
  isOpen: true,
  isLoading: false,
  isValid: true,
  form: { title: '', content: '', visibility: 'PUBLIC' as const, isPinned: false, targetIds: [], projectId: null },
  members: [],
  projects: [],
  lockedProjectId: null,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  onTitleChange: vi.fn(),
  onContentChange: vi.fn(),
  onVisibilityChange: vi.fn(),
  onIsPinnedChange: vi.fn(),
  onProjectChange: vi.fn(),
  onTargetToggle: vi.fn(),
}

describe('AnnouncementModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<AnnouncementModal {...defaultProps} isOpen={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the heading when open', () => {
    render(<AnnouncementModal {...defaultProps} />)
    expect(screen.getByText('New Announcement')).toBeInTheDocument()
  })

  it('renders the Publish button when open', () => {
    render(<AnnouncementModal {...defaultProps} />)
    expect(screen.getByText('Publish')).toBeInTheDocument()
  })

  it('renders the Cancel button when open', () => {
    render(<AnnouncementModal {...defaultProps} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('shows pinned chip when the announcement is pinned', () => {
    render(<AnnouncementModal {...defaultProps} form={{ ...defaultProps.form, isPinned: true }} />)
    expect(screen.getByText('Will be pinned')).toBeInTheDocument()
  })

  it('hides pinned chip when not pinned', () => {
    render(<AnnouncementModal {...defaultProps} />)
    expect(screen.queryByText('Will be pinned')).not.toBeInTheDocument()
  })

  it('shows create mode by default', () => {
    render(<AnnouncementModal {...defaultProps} />)
    expect(screen.getByText('New Announcement')).toBeInTheDocument()
    expect(screen.getByText('Publish')).toBeInTheDocument()
  })

  it('shows edit heading and save button when isEditing', () => {
    render(<AnnouncementModal {...defaultProps} isEditing={true} />)
    expect(screen.getByText('Edit Announcement')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
    expect(screen.queryByText('New Announcement')).not.toBeInTheDocument()
    expect(screen.queryByText('Publish')).not.toBeInTheDocument()
  })
})
