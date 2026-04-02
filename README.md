# Focura

Focura is a focus-first productivity and collaboration platform for individuals and small teams.

It helps users turn scattered tasks into clear priorities, protect deep work time, and maintain steady progress without unnecessary complexity.

---

## What Focura Solves

- Too many tasks, low clarity on what to do next
- Constant context switching and attention fragmentation
- Team misalignment on ownership, deadlines, and progress
- Busy days with low meaningful output

---

## Core Product Capabilities

### Workspace and Team Collaboration
- Multiple workspaces per user
- Role-based access (Owner, Admin, Member, Guest)
- Invitations and membership management
- Workspace-level data isolation

### Project and Task Execution
- Project planning with statuses, priorities, members, and timelines
- Task lifecycle with assignees, labels, comments, and activity history
- Subtasks, dependencies, recurrence, and daily planning workflows
- Multiple work views: List, Calendar, and Kanban

### Focus and Productivity Intelligence
- Focus sessions (Pomodoro, deep work, custom)
- Daily focus flows and execution-oriented task metadata
- Capacity and workload-aware planning primitives
- Workspace analytics and usage insights

### Communication and Collaboration Signals
- In-app notifications with real-time updates (SSE)
- Mentions, comments, and collaborative discussion on tasks
- Workspace announcements and meeting coordination
- Activity logs for accountability and transparency

### Billing and Plan Management
- Workspace-level subscriptions and plan limits
- Plan upgrades, cancel/reactivate flows, and billing status
- Invoice history and usage-aware limits
- Admin-level billing visibility

### Security and Access Control
- NextAuth-based authentication (credentials + Google)
- Backend token exchange and refresh flow
- Role-aware authorization checks
- Rate limiting and audit-oriented security events

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- TanStack Query

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM

### Authentication and Session
- NextAuth
- Backend-issued JWT access/refresh tokens

---

## Architecture Snapshot

Focura follows a decoupled API-first architecture:

```
Frontend (Next.js)
   ->
Axios Client (auth interceptors + typed API hooks)
   ->
Backend API (Express auth/permission middleware)
   ->
Prisma ORM
   ->
PostgreSQL
```

Key properties:
- Frontend and backend are decoupled
- Workspace-scoped data access
- Centralized API client and error handling
- Schema-driven domain model with Prisma

---

## Environment Variables (Minimum)

Create a `.env` file:

```env
DATABASE_URL=""
NODE_ENV="development"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

BACKEND_URL="http://localhost:5000"
NEXT_PUBLIC_API_URL="http://localhost:5000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

See `AUTHENTICATION.md` for security and token-flow-specific environment requirements.

---

## Local Setup

1. Clone repository
```bash
git clone https://github.com/gaziraihan1/focura-client.git
cd focura-client/focura
```

2. Install dependencies
```bash
npm install
```

3. Generate Prisma client and run migrations
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start development server
```bash
npm run dev
```

---

## Current Scope Status

- Workspace management: available
- Project and task workflows: available
- Calendar and Kanban views: available
- Notifications: available
- Billing and plans: available
- Admin dashboard: available

---

## Contributing

Contributions are welcome.

Please read:
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`

---

## License

This project is licensed under the Source-Available License.
See [LICENSE](./LICENSE) for details.
