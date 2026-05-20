// ─── Mock Data ────────────────────────────────────────────────────────────────

import { JobPosting } from "@/types/job.types"
import { http, HttpResponse } from "msw"
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'


const mockJob: JobPosting = {
  id: 'job-1',
  title: 'Frontend Developer',
  slug: 'frontend-developer',
  department: 'ENGINEERING',
  location: 'Remote',
  locationType: 'REMOTE',
  type: 'FULL_TIME',
  experienceLevel: 'MID',
  salaryMin: 1000,
  salaryMax: 2000,
  salaryCurrency: 'USD',
  description: 'Build UI',
  requirements: 'React',
  niceToHave: null,
  benefits: null,
  isPinned: false,
  closingDate: null,
  publishedAt: null,
  applicationUrl: null,
  applicationEmail: null,
  status: 'OPEN',
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const jobsHandlers = [
  http.get(`${BASE}/api/v1/jobs/admin/all`, () =>
    HttpResponse.json({
      success: true,
      data: {
        jobs: [mockJob],
        total: 1,
      },
    })
  ),

  http.get(`${BASE}/api/v1/jobs/admin/:id`, ({ params }) => {
    if (params.id === 'not-found') {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({ success: true, data: mockJob })
  }),

  http.post(`${BASE}/api/v1/jobs/admin`, async () =>
    HttpResponse.json({ success: true, data: mockJob })
  ),

  http.put(`${BASE}/api/v1/jobs/admin/:id`, async () =>
    HttpResponse.json({ success: true, data: mockJob })
  ),

  http.delete(`${BASE}/api/v1/jobs/admin/:id`, async () =>
    HttpResponse.json({ success: true })
  ),

  http.patch(`${BASE}/api/v1/jobs/admin/:id/pin`, async () =>
    HttpResponse.json({
      success: true,
      data: { ...mockJob, isPinned: true },
    })
  ),
]
