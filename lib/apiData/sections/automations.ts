import { FULL_BASE, type ApiSection } from '../types';

export const automationsSection: ApiSection = {
  id         : 'automations',
  title      : 'Automations',
  description: 'Create workspace automation rules that run configured actions when tasks change status or are created.',
  endpoints  : [
    {
      id         : 'automations-list',
      method     : 'GET',
      path       : '/api/v1/automations',
      summary    : 'List automation rules',
      description: 'Lists rules for a workspace. Pass projectId to include the project\'s rules plus workspace-wide rules.',
      auth       : 'auth',
      queryParams: [
        { name: 'workspaceId', type: 'string', required: true,  description: 'Workspace to list rules for' },
        { name: 'projectId',   type: 'string', required: false, description: 'Scope to a project' },
      ],
      responses  : [
        { status: 200, description: 'Array of automation rules' },
        { status: 403, description: 'Not a member of the workspace' },
      ],
      examples   : [
        { label: 'cURL', code: `curl "${FULL_BASE}/automations?workspaceId=cm_ws_abc" \\
-H "Authorization: Bearer <token>"` },
      ],
      tags       : ['automations'],
    },
    {
      id         : 'automations-create',
      method     : 'POST',
      path       : '/api/v1/automations',
      summary    : 'Create an automation rule',
      description: 'Creates a rule for a workspace (optionally scoped to a project). Requires OWNER or ADMIN. Enforced against the plan\'s automation limit.',
      auth       : 'auth',
      bodyFields : [
        { name: 'workspaceId',  type: 'string', required: true,  description: 'Parent workspace' },
        { name: 'projectId',    type: 'string', required: false, description: 'Project scope (null = workspace-wide)' },
        { name: 'name',         type: 'string', required: true,  description: 'Rule name' },
        { name: 'triggerType',  type: 'string', required: true,  description: 'STATUS_CHANGED | TASK_CREATED' },
        { name: 'triggerConfig',type: 'object', required: false, description: '{ fromStatus?, toStatus? } or { projectId? }' },
        { name: 'actions',      type: 'array',  required: true,  description: '1–5 actions: ASSIGN_USER | SET_PRIORITY | NOTIFY_MEMBERS' },
      ],
      responses  : [
        { status: 201, description: 'Rule created' },
        { status: 403, description: 'Insufficient role or plan limit reached' },
      ],
      examples   : [
        { label: 'cURL', code: `curl -X POST ${FULL_BASE}/automations \\
-H "Authorization: Bearer <token>" \\
-H "Content-Type: application/json" \\
-d '{"workspaceId":"cm_ws_abc","name":"Auto-assign","triggerType":"STATUS_CHANGED","triggerConfig":{"toStatus":"IN_REVIEW"},"actions":[{"type":"ASSIGN_USER","config":{"role":"project-owner"}}]}'` },
      ],
      tags       : ['automations'],
    },
    {
      id         : 'automations-get',
      method     : 'GET',
      path       : '/api/v1/automations/:id',
      summary    : 'Get an automation rule',
      description: 'Returns a single rule. Any workspace member can read.',
      auth       : 'auth',
      pathParams : [
        { name: 'id', type: 'string', required: true, description: 'Rule id' },
      ],
      responses  : [
        { status: 200, description: 'The rule object' },
        { status: 404, description: 'Rule not found' },
      ],
      examples   : [
        { label: 'cURL', code: `curl ${FULL_BASE}/automations/cm_rule_1 \\
-H "Authorization: Bearer <token>"` },
      ],
      tags       : ['automations'],
    },
    {
      id         : 'automations-update',
      method     : 'PATCH',
      path       : '/api/v1/automations/:id',
      summary    : 'Update an automation rule',
      description: 'Updates rule fields or toggles enabled. Requires OWNER or ADMIN.',
      auth       : 'auth',
      pathParams : [
        { name: 'id', type: 'string', required: true, description: 'Rule id' },
      ],
      bodyFields : [
        { name: 'enabled',   type: 'boolean', required: false, description: 'Pause/resume the rule' },
        { name: 'name',      type: 'string',  required: false, description: 'New name' },
        { name: 'actions',   type: 'array',   required: false, description: 'Replaced action list' },
      ],
      responses  : [
        { status: 200, description: 'Rule updated' },
        { status: 403, description: 'Insufficient role' },
      ],
      examples   : [
        { label: 'cURL', code: `curl -X PATCH ${FULL_BASE}/automations/cm_rule_1 \\
-H "Authorization: Bearer <token>" \\
-H "Content-Type: application/json" \\
-d '{"enabled":false}'` },
      ],
      tags       : ['automations'],
    },
    {
      id         : 'automations-delete',
      method     : 'DELETE',
      path       : '/api/v1/automations/:id',
      summary    : 'Delete an automation rule',
      description: 'Permanently deletes the rule. Requires OWNER or ADMIN.',
      auth       : 'auth',
      pathParams : [
        { name: 'id', type: 'string', required: true, description: 'Rule id' },
      ],
      responses  : [
        { status: 200, description: 'Rule deleted' },
        { status: 403, description: 'Insufficient role' },
      ],
      examples   : [
        { label: 'cURL', code: `curl -X DELETE ${FULL_BASE}/automations/cm_rule_1 \\
-H "Authorization: Bearer <token>"` },
      ],
      tags       : ['automations'],
    },
    {
      id         : 'automations-runs',
      method     : 'GET',
      path       : '/api/v1/automations/:id/runs',
      summary    : 'Recent run history',
      description: 'Returns the 20 most recent executions of a rule, sourced from the activity feed.',
      auth       : 'auth',
      pathParams : [
        { name: 'id', type: 'string', required: true, description: 'Rule id' },
      ],
      responses  : [
        { status: 200, description: 'Array of run activity entries' },
      ],
      examples   : [
        { label: 'cURL', code: `curl ${FULL_BASE}/automations/cm_rule_1/runs \\
-H "Authorization: Bearer <token>"` },
      ],
      tags       : ['automations'],
    },
  ],
};
