import { FULL_BASE, type ApiSection } from '../types';

export const jobsSection: ApiSection = {
  id         : 'jobs',
  title      : 'Job Postings (Careers)',
  description: 'Public read endpoints for the careers page. Write endpoints are admin-only, gated by FOCURA_ADMIN_IDS env var.',
  endpoints  : [
    {
      id         : 'jobs-list',
      method     : 'GET',
      path       : '/api/v1/jobs',
      summary    : 'List open job postings',
      description: 'Returns all OPEN job postings. Supports department, locationType, type, and search filtering.',
      auth       : 'public',
      queryParams: [
        { name: 'department',   type: 'string', required: false, description: 'ENGINEERING | DESIGN | PRODUCT | …' },
        { name: 'locationType', type: 'string', required: false, description: 'REMOTE | ONSITE | HYBRID' },
        { name: 'type',         type: 'string', required: false, description: 'FULL_TIME | PART_TIME | CONTRACT | …' },
        { name: 'search',       type: 'string', required: false, description: 'Full-text search on title, description, location' },
        { name: 'page',         type: 'number', required: false, description: 'Default: 1' },
        { name: 'limit',        type: 'number', required: false, description: 'Default: 20, max: 50' },
      ],
      responses  : [
        { status: 200, description: 'Paginated job posting list' },
      ],
      examples: [
        { label: 'cURL', code: `curl "${FULL_BASE}/jobs?locationType=REMOTE&department=ENGINEERING"` },
      ],
      tags: ['jobs', 'public'],
    },
    {
      id         : 'jobs-get',
      method     : 'GET',
      path       : '/api/v1/jobs/:slug',
      summary    : 'Get single job posting by slug',
      description: 'Returns the full job posting including description, requirements, benefits, and application instructions.',
      auth       : 'public',
      pathParams : [
        { name: 'slug', type: 'string', required: true, description: 'Job posting URL slug' },
      ],
      responses  : [
        { status: 200, description: 'Full job posting object' },
        { status: 404, description: 'Job not found or not OPEN' },
      ],
      examples: [
        { label: 'cURL', code: `curl ${FULL_BASE}/jobs/senior-frontend-engineer` },
      ],
      tags: ['jobs', 'public'],
    },
  ],
};
