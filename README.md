# 🎯 **Focura Client**

> **Focus Smarter. Manage Workspaces, Projects & Teams.**

A modern, full-stack productivity and collaboration SaaS platform built with **Next.js 16, React 19, TypeScript, and TanStack Query**. Focura helps teams turn scattered tasks into clear priorities, protect deep work time, and maintain steady progress without unnecessary complexity.

**Live Demo:** https://focura-client.vercel.app

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Authentication](#-authentication)
- [API Integration](#-api-integration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### **Core Productivity Features**

#### **Workspace & Team Management**
- ✅ Multiple workspaces per user
- ✅ Role-based access control (OWNER, ADMIN, MEMBER)
- ✅ Team member invitations and management
- ✅ Workspace-level data isolation
- ✅ Settings and customization per workspace

#### **Task Management**
- ✅ Full CRUD operations for tasks
- ✅ Task metadata: title, description, status, priority, dates
- ✅ Task assignment to team members
- ✅ Subtasks with hierarchy support
- ✅ Task dependencies and relationships
- ✅ Recurring tasks with custom schedules
- ✅ Task filtering, sorting, and searching
- ✅ Bulk operations for batch updates

#### **Multiple Work Views**
- ✅ **List View** - Traditional task list with filters
- ✅ **Kanban Board** - Drag-and-drop task board
- ✅ **Calendar View** - Visual task scheduling and deadlines
- ✅ **Daily Tasks** - Focused daily planning workflow

#### **Collaboration & Communication**
- ✅ Comments and discussions on tasks
- ✅ @mentions for team notifications
- ✅ Real-time notifications via SSE + Redis pub/sub
- ✅ Activity feed and audit trail
- ✅ Team visibility and transparency
- ✅ Workspace announcements

#### **Focus & Productivity Intelligence**
- ✅ Focus sessions (Pomodoro, deep work, custom)
- ✅ Time tracking and analytics
- ✅ Daily planning workflows
- ✅ Capacity and workload visualization
- ✅ Productivity insights and metrics

#### **Project Management**
- ✅ Project creation and configuration
- ✅ Project statuses and lifecycle
- ✅ Team member assignment
- ✅ Project timelines and milestones
- ✅ Project analytics and statistics
- ✅ Project archiving

#### **Analytics & Insights**
- ✅ Workspace analytics dashboard
- ✅ Task completion rates
- ✅ Focus session statistics
- ✅ Team activity tracking
- ✅ Storage and usage statistics
- ✅ Custom charts and visualizations

#### **Labels & Organization**
- ✅ Custom label creation per workspace
- ✅ Multi-label task tagging
- ✅ Label filtering and organization
- ✅ Color-coded labels

#### **File Management & Storage**
- ✅ File uploads and attachments
- ✅ Cloudinary cloud integration
- ✅ Storage usage tracking
- ✅ File browser and management UI
- ✅ Storage optimization tools

#### **Billing & Subscription**
- ✅ Plan management and upgrades
- ✅ Stripe payment integration
- ✅ Billing history and invoices
- ✅ Usage-aware plan limits
- ✅ Subscription status tracking

#### **Admin Dashboard**
- ✅ Platform-wide metrics and monitoring
- ✅ User management
- ✅ Workspace administration
- ✅ System statistics and health

#### **User Experience**
- ✅ Dark/Light theme support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time updates via SSE + Redis pub/sub
- ✅ Optimistic UI updates
- ✅ Toast notifications and alerts
- ✅ Smooth animations with Framer Motion

---

## 🛠 Tech Stack

### **Frontend**

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.0.10 |
| **UI Library** | React | 19.2.0 |
| **Language** | TypeScript | 5.9.3 |
| **Styling** | Tailwind CSS | 4.0 |
| **State Management** | TanStack Query | 5.90.21 |
| **Authentication** | NextAuth.js | 4.24.13 |
| **HTTP Client** | Axios | 1.13.2 |
| **Form Management** | React Hook Form | 7.66.1 |
| **Validation** | Zod | 4.1.13 |
| **Animations** | Framer Motion | 12.23.24 |
| **Charts** | Recharts | 3.7.0 |
| **Icons** | Lucide React | 0.554.0 |
| **File Upload** | Cloudinary | 2.8.0 |
| **State Management** | Redux Toolkit | 2.11.0 |
| **Notifications** | React Hot Toast | 2.6.0 |
| **Theme** | next-themes | 0.4.6 |

### **Backend (API)**
- Node.js with Express.js
- PostgreSQL with Prisma ORM (primary + read replica)
- RS256 JWT Authentication
- Upstash Redis (REST) for caching, rate limiting, and dedup
- ioredis for Redis pub/sub (SSE fan-out)
- Server-Sent Events (SSE) for real-time delivery

### **Infrastructure & Deployment**
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Database**: PostgreSQL (Prisma managed)
- **Cache/Redis**: Upstash Redis
- **Pub/Sub**: Redis (ioredis TCP connection)
- **Files**: Cloudinary
- **Payments**: Stripe
- **Monitoring**: Vercel Speed Insights

---

## 🏗 Architecture

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  Next.js 16 (App Router) + React 19 + TypeScript + Tailwind │
│                                                              │
│  • Server Components for data fetching                       │
│  • Client Components for interactivity                       │
│  • Hook-based data abstraction                               │
│  • Centralized API layer with interceptors                   │
│  • React Query for caching & deduplication                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS + RS256 JWT Authentication
                 │ Authorization: Bearer <accessToken>
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Backend API Layer                         │
│     Express.js + Node.js + Prisma ORM + PostgreSQL          │
│                                                              │
│  • Modular monolith architecture                             │
│  • Role-based access control middleware                      │
│  • Real-time notifications (SSE + Redis pub/sub)             │
│  • Rate limiting & audit logging                             │
│  • DB connection pooling (primary + read replica)            │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

```
User Action (e.g., Create Task)
    ↓
useTask() hook triggered
    ↓
Optimistic update: prepend to React Query cache
    ↓
POST /api/tasks (with JWT token)
    ↓
Axios interceptor attaches token
    ↓
Backend validates token → checks permissions → creates task
    ↓
Notification written to Postgres + published to Redis channel
    ↓
SSE stream delivers notification to recipient's browser
    ↓
Response updates React Query cache
    ↓
UI reflects changes (already visible via optimistic update)
```

### **Real-Time Notifications (SSE + Redis Pub/Sub)**

```
useNotifications hook — browser opens SSE connection
    ↓
GET /api/notifications/stream?token=<accessToken>
    ↓
Backend verifies token, extracts userId
    ↓
Awaits Redis SUBSCRIBE sse:user:<userId> confirmation
    ↓
Sends "connected" handshake — channel is guaranteed live
    ↓
─────────────────────────────────────────────────
Any backend instance calls notifyUser()
    ↓
1. Writes Notification row to Postgres (durable)
2. PUBLISH sse:user:<userId> payload → Redis
    ↓
Redis delivers to all subscribed backend instances
    ↓
Each instance fans out to its open SSE Response objects
    ↓
─────────────────────────────────────────────────
Browser EventSource.onmessage fires
    ↓
React Query cache prepended → unread count incremented
    ↓
UI re-renders instantly
```

**Why Redis pub/sub instead of in-memory Map:**
- Works across multiple backend instances (horizontal scaling)
- Any instance can publish; every instance with that user's SSE connection delivers it
- Notifications are durable in Postgres — Redis failure never loses data
- One Redis SUBSCRIBE per unique userId per process, not one per browser tab

**Two Redis clients (ioredis):**

| Client | Purpose |
|--------|---------|
| `publisher` | Sends PUBLISH commands — stays in normal mode |
| `subscriber` | Dedicated to SUBSCRIBE/UNSUBSCRIBE — required because a subscribed ioredis client can only send subscribe commands |

**Upstash Redis (REST)** remains untouched for token revocation, rate limiting, and notification dedup keys. ioredis handles only pub/sub over a standard TCP connection.

### **DB Connection Pooling**

Two Prisma clients with separate connection pools:

| Client | Pool size | Used for |
|--------|-----------|---------|
| `prisma` | 5 | All mutations, consistency-critical reads (unread count) |
| `prismaRead` | 10 | Notification list, analytics, activity feeds, calendar aggregates |

Read-heavy endpoints hit the replica so write traffic on the primary stays low. If `READ_DATABASE_URL` is not set, `prismaRead` falls back to the primary automatically.

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18+ and npm
- **Backend** running locally or accessible via API URL
- `.env.local` file with required environment variables

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Authentication
NEXTAUTH_SECRET=<your-nextauth-secret>
NEXTAUTH_URL=http://localhost:3000

# API Configuration
BACKEND_URL=http://localhost:5000                    # Server-side only
NEXT_PUBLIC_API_URL=http://localhost:5000           # Client-side for SSE stream

# OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# File Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>

# Redis (Upstash REST — for rate limiting and caching)
UPSTASH_REDIS_REST_URL=<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>

# Optional
NODE_OPTIONS=--dns-result-order=ipv4first
```

> **Note:** The `REDIS_URL` (ioredis TCP) env var is backend-only and never
> needed on the frontend.

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/gaziraihan1/focura-client.git
cd focura-client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

---

## 📂 Project Structure

```
focura-client/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Auth routes (login, signup)
│   ├── (dashboard-pages)/         # Protected dashboard routes
│   │   ├── admin-dashboard/       # Admin dashboard
│   │   └── dashboard/             # Main dashboard
│   ├── (public-pages)/            # Public routes (landing, pricing)
│   ├── authentication/            # Auth flow pages
│   ├── api/                       # API route handlers
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   └── not-found.tsx              # 404 page
│
├── components/                    # React Components
│   ├── AdminDashboard/            # Admin UI
│   ├── Authentication/            # Auth forms
│   ├── Dashboard/                 # Dashboard layouts
│   ├── Tasks/                     # Task management UI
│   ├── Kanban/                    # Kanban board
│   ├── Calendar/                  # Calendar view
│   ├── Notifications/             # Notifications UI
│   ├── Labels/                    # Label management
│   ├── Projects/                  # Project management
│   ├── Workspace/                 # Workspace UI
│   ├── Billing/                   # Payment & billing
│   ├── Storage/                   # File management
│   ├── Shared/                    # Reusable components
│   ├── Navbar/                    # Navigation
│   └── Footer/                    # Footer
│
├── lib/                           # Core libraries & utilities
│   ├── api/                       # API client methods
│   ├── auth/                      # NextAuth configuration
│   ├── axios.ts                   # Axios instance + interceptors
│   ├── email.ts                   # Email utilities
│   ├── hash.ts                    # Hashing functions
│   ├── limiter.ts                 # Rate limiting
│   ├── react-query/               # TanStack Query setup
│   ├── task/                      # Task utilities
│   └── tokens.ts                  # JWT utilities
│
├── hooks/                         # Custom React Hooks (80+)
│   ├── useWorkspace.ts            # Workspace operations
│   ├── useTask.ts                 # Task CRUD
│   ├── useProject.ts              # Project management
│   ├── useCalendar.ts             # Calendar logic
│   ├── useKanbanBoard.ts          # Kanban operations
│   ├── useNotifications.ts        # Real-time notifications (SSE + pub/sub)
│   ├── useLabels.ts               # Label operations
│   ├── useFocusSession.ts         # Focus sessions
│   ├── useAnalytics.ts            # Analytics queries
│   ├── useBilling.ts              # Billing operations
│   ├── useStorage.ts              # File storage
│   ├── useAdmin.ts                # Admin operations
│   └── [Page-specific hooks]      # Page controllers
│
├── types/                         # TypeScript type definitions
│   ├── types.ts                   # Core domain types
│   ├── task.types.ts              # Task types
│   ├── project.types.ts           # Project types
│   ├── workspace-usage.types.ts   # Usage types
│   ├── admin.types.ts             # Admin types
│   └── [Feature types]            # Feature-specific types
│
├── utils/                         # Utility functions
│   └── [Helpers & formatters]     # Common utilities
│
├── constants/                     # App constants
│   └── [Configuration values]     # Feature flags, defaults
│
├── context/                       # React Context
│   └── [Context providers]        # Global state
│
├── public/                        # Static assets
│   └── [Images, fonts]            # Public files
│
├── .env.local                     # Environment variables (local)
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── components.json                # Shadcn UI components config
├── package.json                   # Dependencies
├── README.md                      # This file
├── ARCHITECTURE.md                # Architecture documentation
├── AUTHENTICATION.md              # Auth system documentation
├── CONTRIBUTING.md                # Contributing guidelines
└── LICENSE                        # Project license
```

---

## 🔐 Authentication

### **Authentication Flow**

1. **User Login**
   - User enters credentials or uses Google OAuth
   - NextAuth validates credentials locally or with Google

2. **Token Exchange**
   - NextAuth generates HMAC-signed proof
   - Proof sent to backend's `/api/auth/exchange`
   - Backend validates proof and issues RS256 JWT tokens

3. **Token Storage**
   - Tokens stored in HTTP-only NextAuth session cookie
   - Private key never exposed to frontend
   - Secure by default

4. **Token Refresh**
   - Axios interceptor attaches token to requests
   - Backend validates token on every request
   - Token silently refreshes 1 min before expiry
   - Automatic refresh on page load via NextAuth

5. **Token Revocation**
   - Logout revokes token JTI in Upstash Redis
   - Logout-all-devices revokes all refresh tokens
   - Global invalidation via token version increment

### **Protected Routes**

All dashboard routes require authentication:
- Middleware checks for valid session
- Missing/invalid session redirects to login
- API routes validate JWT token

### **Role-Based Access Control**

```ts
// Owner - Full workspace control
// Admin - Member management, project creation
// Member - Task and project access
```

For detailed authentication documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md)

---

## 🔌 API Integration

### **API Client Setup**

The Axios instance in `lib/axios.ts` handles:
- Automatic JWT token attachment from NextAuth session
- Token caching with 10-minute TTL to avoid redundant session fetches
- Silent token refresh on `TOKEN_EXPIRED` responses
- CSRF token attachment for mutating requests
- Type-safe API responses via `ApiResponse<T>` wrapper

```ts
import { api } from '@/lib/axios';

// api.get<T> returns ApiResponse<T> = { success, data?: T, message? }
const response = await api.get<NotificationsResponse>('/api/notifications');
const notifications = response?.data; // NotificationsResponse

// POST / PATCH / DELETE follow the same pattern
await api.post('/api/tasks', { title: 'New Task' });
```

### **Backend API Endpoints**

**Base URL:** `/api`

#### Authentication
- `POST /api/auth/exchange` - Exchange for RS256 tokens
- `POST /api/auth/refresh` - Rotate refresh token
- `POST /api/auth/logout` - Logout (single/all devices)

#### Workspaces
- `GET /api/workspaces` - List user workspaces
- `POST /api/workspaces` - Create workspace
- `PATCH /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

#### Tasks
- `GET /api/tasks` - List tasks (paginated)
- `GET /api/tasks/stats` - Task statistics
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment

#### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Notifications
- `GET /api/notifications/stream` - SSE stream (token via query param, Redis-backed)
- `GET /api/notifications` - Paginated list (cursor-based, read replica)
- `GET /api/notifications/unread-count` - Badge count (primary DB)
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/read/all` - Delete all read

#### More Endpoints
- `GET /api/labels` - List labels
- `GET /api/calendar` - Calendar events
- `GET /api/analytics` - Workspace analytics
- `GET /api/storage` - Storage usage
- `POST /api/upload` - File upload

For complete API documentation, see backend [README](https://github.com/gaziraihan1/focura-backend)

---

## 💻 Development

### **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### **Code Style**

- **Linter**: ESLint (Next.js preset)
- **Formatter**: Prettier (configured in Next.js)
- **Language**: TypeScript (strict mode)

### **Best Practices**

1. **Server Components by Default**
   - Use server components for data fetching
   - Minimize client-side JavaScript

2. **Use Custom Hooks**
   - Encapsulate data fetching logic
   - Reuse across components
   - Easier testing

3. **Type Safety**
   - Fully type all props and returns
   - Use Zod for runtime validation
   - Avoid `any` types

4. **Error Handling**
   - Use try-catch in async operations
   - Show user-friendly error messages
   - Log errors for debugging

5. **Performance**
   - Use React.memo for expensive renders
   - Lazy load routes and components
   - Optimize images with next/image

---

## 🚀 Deployment

### **Deploy to Vercel**

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import this repository
   - Add environment variables
   - Deploy

3. **Automatic Deployments**
   - Every push to `main` triggers deployment
   - Preview deployments for PRs

### **Environment Variables (Production)**

Set these in Vercel dashboard:
```env
NEXTAUTH_SECRET=<production-secret>
NEXTAUTH_URL=https://your-domain.com
BACKEND_URL=https://your-api.com
NEXT_PUBLIC_API_URL=https://your-api.com
GOOGLE_CLIENT_ID=<production-id>
GOOGLE_CLIENT_SECRET=<production-secret>
UPSTASH_REDIS_REST_URL=<upstash-url>
UPSTASH_REDIS_REST_TOKEN=<upstash-token>
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=<email>   
EMAIL_SERVER_PASSWORD=<your password>
EMAIL_FROM="Focura <email>"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>

```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** — `git checkout -b feature/amazing-feature`
3. **Make your changes** — follow TypeScript and Tailwind conventions
4. **Push to your fork** — `git push origin feature/amazing-feature`
5. **Open a Pull Request**

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## 🔒 Security

- ✅ HTTPS only communication
- ✅ RS256 JWT authentication
- ✅ HTTP-only secure cookies
- ✅ CORS enforcement
- ✅ Rate limiting on auth endpoints
- ✅ CSRF protection on mutating requests
- ✅ Audit logging of security events
- ✅ Timing-safe comparisons
- ✅ Argon2 password hashing
- ✅ Role-based access control
- ✅ Workspace-scoped data isolation

For more details, see [AUTHENTICATION.md](./AUTHENTICATION.md)

---

## 📚 Documentation

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - System architecture and design decisions
- [**AUTHENTICATION.md**](./AUTHENTICATION.md) - Complete authentication and security documentation
- [**CONTRIBUTING.md**](./CONTRIBUTING.md) - How to contribute
- [**Backend README**](https://github.com/gaziraihan1/focura-backend) - Backend API documentation

---

## 🔗 Quick Links

- **Live Demo**: https://focura-client.vercel.app
- **Backend Repository**: https://github.com/gaziraihan1/focura-backend
- **Issues**: https://github.com/gaziraihan1/focura-client/issues

---

## 📄 License

This project is licensed under the **Source-Available License**. See [LICENSE](./LICENSE) for details.

---

## 👤 Maintainer

**Mohammad Raihan Gazi** — Creator & Maintainer of Focura

- GitHub: [@gaziraihan1](https://github.com/gaziraihan1)

---

**Happy coding! 🚀**

If you find Focura Client helpful, please consider giving it a ⭐ star on GitHub!