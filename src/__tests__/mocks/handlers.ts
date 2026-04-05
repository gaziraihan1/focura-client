import { rest } from 'msw';

// Mocked API endpoints for authentication, tasks, workspaces, and projects
export const handlers = [
  // Authentication
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { username, password } = req.body;
    if (username === 'testuser' && password === 'password') {
      return res(ctx.status(200), ctx.json({ token: 'mocked_token' }));
    }
    return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
  }),
  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Logged out successfully' }));
  }),

  // Tasks
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ]));
  }),
  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;
    return res(ctx.status(201), ctx.json({ id: 3, title, completed: false }));
  }),

  // Workspaces
  rest.get('/api/workspaces', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      { id: 1, name: 'Workspace 1' },
      { id: 2, name: 'Workspace 2' }
    ]));
  }),
  rest.post('/api/workspaces', (req, res, ctx) => {
    const { name } = req.body;
    return res(ctx.status(201), ctx.json({ id: 3, name }));
  }),

  // Projects
  rest.get('/api/projects', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      { id: 1, name: 'Project 1', workspaceId: 1 },
      { id: 2, name: 'Project 2', workspaceId: 2 }
    ]));
  }),
  rest.post('/api/projects', (req, res, ctx) => {
    const { name, workspaceId } = req.body;
    return res(ctx.status(201), ctx.json({ id: 3, name, workspaceId }));
  }),
];