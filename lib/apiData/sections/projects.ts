import { FULL_BASE, type ApiSection } from '../types';

export const projectsSection: ApiSection = {
  id         : 'projects',
  title      : 'Projects',
  description: 'Projects group tasks within a workspace. Each project has its own views, members, milestones, and analytics.',
  endpoints  : [
    {
      id         : 'projects-list',
      method     : 'GET',
      path       : '/api/v1/projects',
      summary    : 'List projects',
      description: 'Returns all projects the caller has access to. Accepts optional workspaceId filter.',
      auth       : 'auth',
      queryParams: [
        { name: 'workspaceId', type: 'string',  required: false, description: 'Filter by workspace' },
        { name: 'status',      type: 'string',  required: false, description: 'PLANNING | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED' },
        { name: 'page',        type: 'number',  required: false, description: 'Page number (default: 1)' },
        { name: 'limit',       type: 'number',  required: false, description: 'Items per page (default: 20, max: 50)' },
      ],
      responses  : [
        { status: 200, description: 'Paginated list of projects', shape: [
          { name: 'data.projects[].id',     type: 'string', description: 'Project cuid' },
          { name: 'data.projects[].name',   type: 'string', description: 'Project name' },
          { name: 'data.projects[].status', type: 'string', description: 'Project status' },
          { name: 'data.projects[].slug',   type: 'string', description: 'Unique slug within workspace' },
          { name: 'data.pagination',        type: 'object', description: 'page, limit, total, totalPages' },
        ]},
      ],
      examples: [
        { label: 'cURL', code: `curl "${FULL_BASE}/projects?workspaceId=cm_ws_abc&status=ACTIVE" \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['projects'],
    },
    {
      id         : 'projects-create',
      method     : 'POST',
      path       : '/api/v1/projects',
      summary    : 'Create a project',
      description: 'Creates a new project inside a workspace. Creator becomes Manager automatically.',
      auth       : 'auth',
      bodyFields : [
        { name: 'name',        type: 'string',  required: true,  description: 'Project name' },
        { name: 'workspaceId', type: 'string',  required: true,  description: 'Parent workspace cuid' },
        { name: 'description', type: 'string',  required: false, description: 'Optional description' },
        { name: 'color',       type: 'string',  required: false, description: 'Hex colour', example: '#667eea' },
        { name: 'startDate',   type: 'string',  required: false, description: 'ISO 8601 date' },
        { name: 'dueDate',     type: 'string',  required: false, description: 'ISO 8601 date' },
        { name: 'priority',    type: 'string',  required: false, description: 'URGENT | HIGH | MEDIUM | LOW' },
      ],
      responses  : [
        { status: 201, description: 'Project created' },
        { status: 403, description: 'Project limit reached for this workspace plan' },
      ],
      examples: [
        { label: 'Axios', code: `const { data } = await axios.post('/api/v1/projects', {\n  name: 'Q3 Launch',\n  workspaceId: 'cm_ws_abc123',\n  color: '#667eea',\n  priority: 'HIGH',\n}, { headers: { Authorization: \`Bearer \${token}\` } });` },
      ],
      tags: ['projects'],
    },
    {
      id         : 'projects-get',
      method     : 'GET',
      path       : '/api/v1/projects/:projectId',
      summary    : 'Get project by ID',
      description: 'Returns the full project object including members, milestones count, and active views.',
      auth       : 'auth',
      pathParams : [
        { name: 'projectId', type: 'string', required: true, description: 'Project cuid' },
      ],
      responses  : [
        { status: 200, description: 'Full project object' },
        { status: 403, description: 'Not a project member' },
        { status: 404, description: 'Project not found' },
      ],
      examples: [
        { label: 'cURL', code: `curl ${FULL_BASE}/projects/cm_proj_xyz \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['projects'],
    },
    {
      id         : 'projects-update',
      method     : 'PUT',
      path       : '/api/v1/projects/:projectId',
      summary    : 'Update project',
      description: 'Updates project metadata. Requires MANAGER or workspace ADMIN/OWNER.',
      auth       : 'auth',
      pathParams : [
        { name: 'projectId', type: 'string', required: true, description: 'Project cuid' },
      ],
      bodyFields : [
        { name: 'name',        type: 'string', required: false, description: 'New name' },
        { name: 'status',      type: 'string', required: false, description: 'New status' },
        { name: 'description', type: 'string', required: false, description: 'New description' },
        { name: 'dueDate',     type: 'string', required: false, description: 'New due date ISO 8601' },
      ],
      responses  : [
        { status: 200, description: 'Project updated' },
        { status: 403, description: 'Insufficient role' },
      ],
      examples: [
        { label: 'cURL', code: `curl -X PUT ${FULL_BASE}/projects/cm_proj_xyz \\\n  -H "Authorization: Bearer <token>" \\\n  -H "Content-Type: application/json" \\\n  -d '{"status":"COMPLETED"}'` },
      ],
      tags: ['projects'],
    },
    {
      id         : 'projects-delete',
      method     : 'DELETE',
      path       : '/api/v1/projects/:projectId',
      summary    : 'Delete project',
      description: 'Permanently deletes the project and all its tasks, files, and comments. Irreversible.',
      auth       : 'auth',
      pathParams : [
        { name: 'projectId', type: 'string', required: true, description: 'Project cuid' },
      ],
      responses  : [
        { status: 200, description: 'Project deleted' },
        { status: 403, description: 'MANAGER or workspace ADMIN/OWNER required' },
      ],
      examples: [
        { label: 'cURL', code: `curl -X DELETE ${FULL_BASE}/projects/cm_proj_xyz \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['projects'],
    },
  ],
};
