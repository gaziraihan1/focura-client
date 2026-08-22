import { FULL_BASE, type ApiSection } from '../types';

export const filesSection: ApiSection = {
  id         : 'files',
  title      : 'Files & Attachments',
  description: 'File upload and management via Cloudinary. All uploads are rate-limited per user and subject to workspace storage quotas.',
  endpoints  : [
    {
      id         : 'files-upload',
      method     : 'POST',
      path       : '/api/v1/files/upload',
      summary    : 'Upload a file',
      description: 'Accepts multipart/form-data. File is stored on Cloudinary and a File record is created in the database. Rate-limited per user.',
      auth       : 'auth',
      bodyFields : [
        { name: 'file',        type: 'File',   required: true,  description: 'The file to upload (multipart)' },
        { name: 'workspaceId', type: 'string', required: true,  description: 'Target workspace' },
        { name: 'projectId',   type: 'string', required: false, description: 'Associate with a project' },
        { name: 'taskId',      type: 'string', required: false, description: 'Associate with a task' },
        { name: 'folder',      type: 'string', required: false, description: 'Virtual folder path (default: /)' },
      ],
      responses  : [
        { status: 201, description: 'File uploaded', shape: [
          { name: 'data.id',           type: 'string', description: 'File cuid' },
          { name: 'data.url',          type: 'string', description: 'Cloudinary public URL' },
          { name: 'data.thumbnail',    type: 'string?', description: 'Optimised thumbnail URL (images only)' },
          { name: 'data.size',         type: 'number', description: 'File size in bytes' },
          { name: 'data.mimeType',     type: 'string', description: 'MIME type' },
        ]},
        { status: 413, description: 'File exceeds plan file size limit' },
        { status: 429, description: 'Upload rate limit exceeded' },
        { status: 507, description: 'Workspace storage limit reached' },
      ],
      examples: [
        { label: 'cURL', code: `curl -X POST ${FULL_BASE}/files/upload \\\n  -H "Authorization: Bearer <token>" \\\n  -F "file=@report.pdf" \\\n  -F "workspaceId=cm_ws_abc123" \\\n  -F "taskId=cm_task_xyz"` },
        { label: 'Axios', code: `const form = new FormData();\nform.append('file', fileInput.files[0]);\nform.append('workspaceId', wsId);\nform.append('taskId', taskId);\n\nconst { data } = await axios.post('/api/v1/files/upload', form, {\n  headers: {\n    Authorization: \`Bearer \${token}\`,\n    'Content-Type': 'multipart/form-data',\n  },\n});` },
      ],
      tags: ['files'],
    },
    {
      id         : 'files-list',
      method     : 'GET',
      path       : '/api/v1/files',
      summary    : 'List workspace files',
      description: 'Returns all files in a workspace with optional folder and task filters.',
      auth       : 'auth',
      queryParams: [
        { name: 'workspaceId', type: 'string', required: true,  description: 'Workspace to list files from' },
        { name: 'projectId',   type: 'string', required: false, description: 'Filter by project' },
        { name: 'taskId',      type: 'string', required: false, description: 'Filter by task' },
        { name: 'folder',      type: 'string', required: false, description: 'Filter by virtual folder path' },
        { name: 'page',        type: 'number', required: false, description: 'Default: 1' },
        { name: 'limit',       type: 'number', required: false, description: 'Default: 20' },
      ],
      responses  : [
        { status: 200, description: 'Paginated file list' },
      ],
      examples: [
        { label: 'cURL', code: `curl "${FULL_BASE}/files?workspaceId=cm_ws_abc" \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['files'],
    },
    {
      id         : 'files-delete',
      method     : 'DELETE',
      path       : '/api/v1/files/:fileId',
      summary    : 'Delete a file',
      description: 'Deletes the file record from the database and removes it from Cloudinary. Frees used storage immediately.',
      auth       : 'auth',
      pathParams : [
        { name: 'fileId', type: 'string', required: true, description: 'File cuid' },
      ],
      responses  : [
        { status: 200, description: 'File deleted' },
        { status: 403, description: 'Not the uploader or workspace Admin/Owner' },
      ],
      examples: [
        { label: 'cURL', code: `curl -X DELETE ${FULL_BASE}/files/cm_file_xyz \\\n  -H "Authorization: Bearer <token>"` },
      ],
      tags: ['files'],
    },
  ],
};
