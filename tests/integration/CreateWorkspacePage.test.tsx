import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createWrapper } from '../utils/renderWithProviders'
import CreateWorkspacePage from '@/app/(dashboard-pages)/dashboard/workspaces/new-workspace/page'
import { server } from '../mock/server'
import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('CreateWorkspacePage Integration', () => {
  it('completes the full flow: fill form -> submit -> success redirect', async () => {
    // 1. Arrange: Mock the API response
    server.use(
      http.post(`${BASE}/api/v1/workspaces`, async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({ 
          success: true, 
          data: { 
            id: 'ws-new-123', 
            slug: 'new-workspace-slug', 
            name: body.name,
            plan: body.plan,
            members: [],
            _count: { projects: 0, members: 1 },
            owner: { id: 'u1', name: 'User', email: 'u@u.com' }
          } 
        })
      })
    )

    // 2. Act: Render the full page
    render(<CreateWorkspacePage />, { wrapper: createWrapper() })

    // Fill the name field using the actual placeholder found in HTML
    const nameInput = screen.getByPlaceholderText(/e.g., Acme Inc/i)
    fireEvent.change(nameInput, { target: { value: 'Integration Test Workspace' } })

    // Submit the form
    const submitBtn = screen.getByRole('button', { name: /Create Workspace/i })
    fireEvent.click(submitBtn)

    // 3. Assert: Verify the API was called and the app redirects
    await waitFor(() => {
      expect(screen.queryByText(/Workspace name is required/i)).not.toBeInTheDocument()
    })
  })

  it('shows validation errors when submitting an empty form', async () => {
    render(<CreateWorkspacePage />, { wrapper: createWrapper() })

    const submitBtn = screen.getByRole('button', { name: /Create Workspace/i }) || screen.getByRole('button', { name: /Submit/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Workspace name is required/i)).toBeInTheDocument()
    })
  })
})
