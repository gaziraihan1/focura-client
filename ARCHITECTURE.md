# 🏗 Gablura Client – Complete System Architecture

This document describes the comprehensive architecture, design decisions, data flow, and implementation patterns of **Gablura Client**, a modern, full-stack productivity and collaboration SaaS platform.

---

## 📑 Table of Contents

- [Architecture Goals](#-architecture-goals)
- [High-Level Architecture](#-high-level-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Component Structure & Hierarchy](#-component-structure--hierarchy)
- [Data Management & State Flow](#-data-management--state-flow)
- [Authentication & Authorization](#-authentication--authorization)
- [API Integration Layer](#-api-integration-layer)
- [Real-Time Communication](#-real-time-communication)
- [Database Architecture](#-database-architecture)
- [Focus, Energy & Burnout Architecture](#-focus-energy--burnout-architecture)
- [Security Architecture](#-security-architecture)
- [Performance Optimization](#-performance-optimization)
- [Error Handling](#-error-handling)
- [Design Patterns](#-design-patterns)
- [Future Roadmap](#-future-roadmap)

---

## 🎯 Architecture Goals

Gablura Client is designed to be:

- **🚀 Scalable** – Supports personal workflows up to enterprise teams
- **🔒 Secure** – Workspace-level data isolation with role-based access
- **🛠 Maintainable** – Clean separation of concerns and modular architecture
- **🔧 Extensible** – Easy to add new features without breaking existing code
- **⚡ High-Performance** – Optimized queries, caching, and minimal re-renders
- **📱 Responsive** – Works seamlessly on desktop, tablet, and mobile
- **🔄 Real-Time** – Instant updates via Server-Sent Events (SSE)
- **♿ Accessible** – WCAG compliant UI components

---

## 🧱 High-Level Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Next.js 16 (App Router) + React 19 + TypeScript          │  │
│  │  ├─ Server Components (data fetching)                      │  │
│  │  ├─ Client Components (interactivity)                      │  │
│  │  ├─ Tailwind CSS + Framer Motion                           │  │
│  │  └─ NextAuth + TanStack Query                             │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTPS + RS256 JWT
                       │ Authorization: Bearer <token>
┌──────────────────────▼───────────────────────────────────────────┐
│                    Backend API Layer                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Express.js + Node.js + TypeScript                        │  │
│  │  ├─ Modular Monolith Architecture                         │  │
│  │  ├─ JWT Validation & Rate Limiting                        │  │
│  │  ├─ Real-Time SSE Notifications                           │  │
│  │  ├─ Audit Logging & Security Events                       │  │
│  │  └─ Cron Jobs & Background Tasks                          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼───────────────────────────────────────────┐
│                  Data Persistence Layer                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database + Prisma Schema                      │  │
│  │  ├─ Workspace Isolation                                   │  │
│  │  ├─ Relational Integrity                                  │  │
│  │  ├─ Optimized Indexes                                     │  │
│  │  └─ Backup & Replication                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🖥 Frontend Architecture

### Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | ^16.3.0 | Full-stack React with SSR |
| **UI Library** | React | 19.2.0 | Component-based UI |
| **Language** | TypeScript | ^5 | Type safety |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **UI State** | React Context | built-in | Sidebar, workspace plan, consent |
| **Server State** | TanStack Query | ^5.90.21 | Caching & deduplication |
| **Authentication** | NextAuth.js | ^4.24.15 | Session management |
| **HTTP Client** | Axios | ^1.13.2 | API requests |
| **Form Handling** | React Hook Form | ^7.66.1 | Form management |
| **Validation** | Zod | 3.25.76 | Schema validation |
| **Animations** | Framer Motion | ^12.23.24 | Smooth animations |
| **Charts** | Recharts | ^3.7.0 | Data visualization |
| **Icons** | Lucide React | ^0.554.0 | Icon library |
| **Notifications** | React Hot Toast | ^2.6.0 | Toast notifications |
| **Theme** | next-themes | ^0.4.6 | Dark/Light mode |
| **Testing** | Vitest + Testing Library + MSW | latest | Unit & integration tests |

> Versions reflect `package.json`. There is **no Redux** — global UI state is
> minimal React Context (`context/sidebarCollapse`, `context/workspacePlan`,
> `components/Consent`), and all server state lives in TanStack Query.

### Frontend Directory Structure

```
gablura-client/
├── app/                                  # Next.js App Router
│   ├── (dashboard-pages)/               # Protected dashboard routes
│   │   ├── admin-dashboard/             # Admin panel (role-gated in proxy.ts)
│   │   │   ├── page.tsx                 #   overview, users, workspaces,
│   │   │   ├── layout.tsx               #   projects, billing, activity,
│   │   │   └── [...admin-pages]/        #   careers, templates, resource...
│   │   │
│   │   └── dashboard/                   # Main dashboard
│   │       ├── layout.tsx               # Shared dashboard layout
│   │       ├── page.tsx                 # Dashboard home
│   │       ├── tasks/                   # Task management
│   │       ├── calendar/                # Calendar view
│   │       ├── projects/                # Projects under a workspace
│   │       │   └── [projectSlug]/...    #   details, tasks, analytics,
│   │       │                            #   milestones, sprints, views...
│   │       ├── workspaces/              # Workspace management
│   │       │   └── [workspaceSlug]/     #   settings, billing, kanban,
│   │       │                            #   meetings, labels, integrations
│   │       ├── storage/                 # File management
│   │       ├── notifications/           # Notifications page
│   │       ├── activity-logs/           # Activity feed
│   │       ├── profile/                 # User profile
│   │       ├── wellness/                # Focus & burnout insights
│   │       └── settings/                # Workspace settings ([workspaceSlug])
│   │
│   ├── (public-pages)/                  # Public marketing & info routes
│   │   ├── about/ pricing/ features/ solutions/
│   │   ├── careers/ contact/ resources/ roadmap/
│   │   ├── help/ guides/ dev-guides/ api-docs/
│   │   └── privacy/ terms/ cookies/ refund/
│   │
│   ├── authentication/                  # Auth entry routes
│   │   ├── login/ registration/
│   │   ├── forgot-password/ reset-password/
│   │   ├── verify-email/ verified/
│   │   ├── 2fa/                         # Two-factor challenge
│   │   └── success/
│   │
│   ├── api/                             # BFF route handlers (NextAuth only)
│   │   ├── auth/[...nextauth]/route.ts  # Session endpoints
│   │   ├── auth/register|verify-email|forgot-password|
│   │   │        reset-password|verify-2fa/route.ts
│   │   └── (proxied to the Express backend via RS256 JWT)
│   │
│   ├── layout.tsx                       # Root layout (Providers, Consent)
│   ├── globals.css                      # Global styles + Tailwind 4 theme tokens
│   └── not-found.tsx                    # 404 page
│
├── components/                          # React Components
│   ├── admin-dashboard/                 # Admin UI
│   │   ├── AdminOverviewContent.tsx
│   │   ├── AdminUsersContent.tsx
│   │   ├── StatCard.tsx
│   │   └── [...other-admin-components]
│   │
│   ├── shared/                          # Reusable primitives
│   │   ├── EmptyState.tsx
│   │   ├── ErrorFallback.tsx
│   │   ├── StatCard.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── SearchModal.tsx
│   │   ├── LoadingState.tsx
│   │   ├── Pagination.tsx
│   │   └── [...other-shared-components]
│   │
│   ├── dashboard/                       # Dashboard feature modules
│   │   ├── shell/                       #   Nav & layout (DashboardShell,
│   │   │   │                            #     Sidebar, TopNavbar)
│   │   ├── home/                        #   Dashboard page widgets
│   │   │   │                            #     (DashboardGreeting, QuickActions,
│   │   │   │                            #      WorkspaceList, TaskHighlights,
│   │   │   │                            #      RecentActivity,
│   │   │   │                            #      GettingStartedChecklist)
│   │   ├── wellness/                    #   Focus & burnout widgets
│   │   │   │                            #     (WellnessRecommendations,
│   │   │   │                            #      FocusStreakBadge,
│   │   │   │                            #      FocusDailySummary, GabluraTips)
│   │   ├── tasks/                       #   Task management
│   │   ├── calendar/                    #   Calendar view
│   │   ├── projects/                    #   Project management
│   │   ├── workspace/                   #   Workspace features
│   │   │   ├── analytics/               #     Analytics & charts
│   │   │   ├── billing/                 #     Billing & upgrades
│   │   │   ├── meetings/                #     Meeting management
│   │   │   ├── members/                 #     Team members
│   │   │   ├── project-overview/        #     Project detail pages
│   │   │   ├── detail/                  #     Workspace detail pages
│   │   │   ├── settings/                #     Workspace settings
│   │   │   ├── list/                    #     Workspace listing
│   │   │   ├── layout/                  #     Workspace layout shell
│   │   │   ├── announcements/           #     Announcements
│   │   │   └── project-card/            #     Project card components
│   │   ├── storage/                     #   File management
│   │   ├── notifications/               #   Notifications
│   │   ├── activity-logs/               #   Activity feed
│   │   ├── profile/                     #   User profile
│   │   ├── help/                        #   Help & support
│   │   ├── labels/                      #   Label management
│   │   ├── task-details/                #   Task detail views
│   │   ├── team-task/                   #   Team task views
│   │   ├── meeting-details/             #   Meeting detail views
│   │   ├── analytics/                   #   Workspace usage analytics
│   │   ├── create-workspace/            #   Workspace creation
│   │   └── invitation/                  #   Invitation flows
│   │
│   ├── settings/                        # Settings forms
│   │   ├── SecuritySettingsForm.tsx
│   │   ├── NotificationsSettingsForm.tsx
│   │   ├── BillingSettingsForm.tsx
│   │   └── [...other-settings-forms]
│   │
│   ├── ai/                              # AI-powered features
│   │   ├── AiDailyPlan.tsx
│   │   ├── AiMeetingSummary.tsx
│   │   ├── AiWeeklyInsights.tsx
│   │   └── [...other-ai-components]
│   │
│   ├── themes/                          # Theme switching
│   ├── navbar/                           # Global navigation
│   ├── footer/                           # Footer
│   ├── providers/                        # Context providers
│   │   ├── SessionProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── QueryProvider.tsx
│   └── [...other-top-level-components]
│
├── hooks/                               # Custom React Hooks (122) — see hooks/README.md
│   ├── useTaskQueries.ts                # Task queries (TanStack Query)
│   ├── taskMutations.ts                 # Task mutations
│   ├── taskKeys.ts                      # Query key factories
│   ├── useWorkspace.ts                  # Workspace operations
│   ├── useProjectFeatures.ts            # Milestones, sprints, sections, views
│   ├── useKanbanBoard.ts                # Kanban operations
│   ├── useNotifications.ts              # Real-time notifications + SSE
│   ├── useRouteParams.ts                # Typed route-param accessors
│   ├── useAdmin.ts                      # Admin operations
│   ├── useSecurity.ts                   # Password & 2FA management
│   └── [Page controllers: use<XxxPage>] # Compose queries + UI state
│
├── lib/                                 # Core infrastructure
│   ├── axios.ts                         # Barrel — re-exports the axios stack
│   ├── axios/                           # HTTP client stack (single source of
│   │   ├── client.ts                    #   API contract: api.*, unwrap(),
│   │   │                                #   normalizeError, interceptors
│   │   ├── instance.ts                  #   Axios instance creation
│   │   ├── refresh.ts                   #   Token refresh + request queue
│   │   ├── session.ts                   #   Session timers, force logout
│   │   └── types.ts                     #   ApiResponse, AppError, error codes
│   │
│   ├── auth/                            # Authentication
│   │   ├── authOptions.ts               # NextAuth config (JWT callbacks)
│   │   ├── exchange.ts                  # HMAC proof → RS256 token exchange
│   │   ├── refresh.ts                   # Silent session refresh w/ dedup lock
│   │   ├── bridge.ts / logout.ts / types.ts / index.ts
│   │
│   ├── csrf.ts                          # CSRF token fetch/invalidate
│   ├── limiter.ts                       # Rate limiting helpers
│   ├── prisma.ts                        # Prisma client
│   ├── react-query/                     # TanStack Query client config
│   ├── email.ts                         # Email utilities
│   ├── a11y.ts                          # Accessibility helpers (announce)
│   └── apiData|templatesData|roadmapData # Static content data
│
├── types/                               # TypeScript Definitions (30+)
│   ├── task.types.ts
│   ├── project.types.ts
│   ├── workspace-usage.types.ts
│   ├── admin.types.ts
│   ├── notification.types.ts
│   ├── comment.types.ts
│   ├── meeting.types.ts
│   ├── calendar.types.ts
│   ├── next-auth.d.ts                   # Session type augmentation
│   └── [<domain>.types.ts]
│
├── constants/                           # App constants (16 domain files)
│   └── [...constants]
│
├── context/                             # React Context (UI state only)
│   ├── providers/                       # QueryProvider, ToastProvider
│   ├── sidebarCollapse/
│   └── workspacePlan/
│
├── utils/                               # Utility functions
│   └── [Helpers & formatters]
│
├── tests/                               # Vitest suites (mirror src structure)
│   ├── setup.ts                         # Global mocks (axios, next-auth)
│   └── hooks|components|integration|lib|api|...
│
├── public/                              # Static assets
│   └── [...assets]
│
├── prisma/                              # Prisma schema
│   └── schema.prisma
│
├── proxy.ts                             # Next.js 16 middleware (route guards,
│   │                                    #  admin role check, security headers)
├── next.config.ts                       # Next.js config
├── tsconfig.json                        # TypeScript config
├── vitest.config.ts                     # Test runner config (+ coverage gate)
├── eslint.config.mjs                    # ESLint flat config (no-explicit-any: error)
├── .prettierrc.json                     # Formatting config
├── package.json                         # Dependencies
├── README.md                            # Project readme
├── ARCHITECTURE.md                      # This file
├── AUTHENTICATION.md                    # Auth documentation
├── CONTRIBUTING.md                      # Contributing guide
└── LICENSE                              # License
```

---

## 🎯 Component Structure & Hierarchy

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      RootLayout                             │
│  ├─ Providers (Session, Query, Theme)                       │
│  ├─ Navbar (global navigation)                              │
│  └─ Children (route-specific content)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌────────┐   ┌──────────┐   ┌────────────┐
   │ Auth   │   │Dashboard │   │Public Pages│
   │Layout  │   │ Layout   │   │  Layout    │
   └────────┘   └──────────┘   └────────────┘
        │             │             │
        ├─┐           ├─┐           ├─┐
        │ │           │ │           │ │
        ▼ ▼           ▼ ▼           ▼ ▼
      Login         Tasks        Landing
      Signup        Kanban       Pricing
      Forgot Pass   Calendar     Features
                    Projects
                    Analytics
```

### Component Patterns

**1. Feature-Based Module Organization**
```
components/dashboard/
├── shell/        → Nav/layout (DashboardShell, Sidebar, TopNavbar)
├── home/         → Dashboard page widgets (greeting, quick actions, task highlights)
├── wellness/     → Focus & burnout widgets (streak badge, recommendations)
├── tasks/        → Task management (all-tasks, kanban, time-log)
├── workspace/    → Workspace features (analytics, billing, meetings, members)
└── [feature]/    → Each feature owns its sub-components
```

**2. Server Component (Data Fetching)**
```typescript
// app/dashboard/tasks/page.tsx
export default async function TasksPage() {
  const tasks = await fetchTasks();
  return <TaskList tasks={tasks} />;
}
```

**3. Client Component (Interactivity)**
```typescript
// components/dashboard/tasks/all-tasks/TaskCard.tsx
"use client";

import { useState } from "react";

export default function TaskCard({ task }) {
  const [isOpen, setIsOpen] = useState(false);
  return <div onClick={() => setIsOpen(!isOpen)}>{task.title}</div>;
}
```

**4. Container/Presenter Pattern**
```typescript
// Container (logic)
export function TaskListContainer() {
  const { tasks } = useTask();
  return <TaskListPresenter tasks={tasks} />;
}

// Presenter (UI only)
export function TaskListPresenter({ tasks }) {
  return <ul>{tasks.map(t => <li>{t.title}</li>)}</ul>;
}
```

---

## 📊 Data Management & State Flow

### State Management Strategy

**Hierarchy:**

```
┌─────────────────────────────────────────────┐
│    Session State (NextAuth useSession)      │
│  ├─ User identity & role                    │
│  └─ Backend RS256 token (HTTP-only cookie)  │
└─────────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│     UI State (minimal React Context)      │
│  ├─ Sidebar collapsed                     │
│  ├─ Workspace plan (FREE/PRO/BUSINESS)    │
│  └─ Cookie consent                        │
└─────────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│      Server State (TanStack Query)         │
│  ├─ Tasks (cached, auto-refetch)           │
│  ├─ Projects (paginated, filtered)         │
│  ├─ Notifications (real-time via SSE)      │
│  └─ Analytics (stale-while-revalidate)     │
└─────────────────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│       Local State (React useState)         │
│  ├─ Form values                            │
│  ├─ UI toggles (modals, dropdowns)         │
│  └─ Temporary filters                      │
└─────────────────────────────────────────────┘
```

### Data Flow Example: Create Task

```
User fills form
    │
    ├─ onSubmit handler
    │
    ├─ 1. Client-side validation (Zod)
    │
    ├─ 2. Optimistic update
    │   └─ prepend to React Query cache
    │
    ├─ 3. Axios POST request
    │   └─ Token auto-attached by interceptor
    │
    ├─ 4. Backend creates in DB
    │   └─ Returns new task with ID
    │
    ├─ 5. Notification sent to assignees (SSE)
    │
    ├─ 6. React Query cache updated
    │
    └─ 7. UI reflects changes
       └─ Toast notification shown
```

### Caching Strategy

| Data Type | Strategy | TTL |
|-----------|----------|-----|
| **Tasks** | Stale-while-revalidate | 5 min |
| **Projects** | Stale-while-revalidate | 10 min |
| **Analytics** | Manual refetch | 1 hour |
| **Workspace** | Long-lived | Session |
| **User Profile** | Long-lived | Session |
| **Notifications** | Real-time SSE | N/A |

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User Login
   └─ POST credentials to NextAuth
   
2. Credentials Validation
   └─ NextAuth validates via Prisma DB
   
3. HMAC Proof Generation
   └─ Creates proof signed with NEXTAUTH_SECRET
   
4. Token Exchange
   └─ POST /api/v1/auth/exchange to backend
   
5. JWT Issuance
   └─ Backend returns RS256 tokens
   
6. Session Storage
   └─ Tokens stored in HTTP-only cookie
   
7. Axios Interceptor
   └─ Token attached to requests automatically
   
8. Backend Validation
   └─ Token verified on each request
```

### Authorization Matrix

| Route | Public | Authenticated | Owner | Admin | Member |
|-------|--------|---------------|-------|-------|--------|
| `/dashboard` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/workspaces/[workspaceSlug]/settings` | ❌ | ❌ | ✅ | ✅ | ❌ |
| `/admin-dashboard` | ❌ | ❌ | ⚠️ | ✅ | ❌ |
| `/tasks` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/workspaces/[workspaceSlug]/settings` (danger zone) | ❌ | ❌ | ✅ | ❌ | ❌ |

Admin routes are enforced at **two independent layers**: `proxy.ts` checks the
NextAuth JWT role before rendering, and the backend mounts `/api/v1/admin/*`
behind `authenticate → requireGabluraAdmin` so non-admin API calls are rejected
regardless of what the client renders.

---

## 🔗 API Integration Layer

### API Client Architecture

```
┌─────────────────────────────────────────┐
│      Component / Hook (useTask)          │
└─────────────────────┬───────────────────┘
                      │
┌─────────────────────▼───────────────────┐
│     React Query (Caching & Sync)        │
│  ├─ Cache invalidation                   │
│  ├─ Auto-refetch                         │
│  └─ Optimistic updates                   │
└─────────────────────┬───────────────────┘
                      │
┌─────────────────────▼───────────────────┐
│      Axios Instance (lib/axios.ts)      │
│  ├─ Request interceptor (add token)      │
│  ├─ Response interceptor (handle errors) │
│  └─ Error transformation                 │
└─────────────────────┬───────────────────┘
                      │
┌─────────────────────▼───────────────────┐
│         HTTP Request (HTTPS)             │
│  ├─ Authorization: Bearer <token>        │
│  ├─ Content-Type: application/json       │
│  └─ Custom headers (if needed)           │
└─────────────────────┬───────────────────┘
                      │
┌─────────────────────▼───────────────────┐
│        Backend Express Server            │
│  ├─ Middleware (auth, rate limit)        │
│  ├─ Route handlers (business logic)      │
│  ├─ Database queries (Prisma)            │
│  └─ Response formatting                  │
└─────────────────────────────────────────┘
```

### Request/Response Pattern

```typescript
// lib/axios/client.ts — the SINGLE place that knows the wire format
export const api = {
  get<T>(endpoint: string, options?: ApiOptions): Promise<ApiResponse<T> | undefined> { ... },
  post<T>(endpoint: string, data?: unknown, options?: ApiOptions) { ... },
  // put / patch / delete / upload follow the same shape
};

// Every success body from the backend is shaped like this:
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: { page; pageSize; totalCount; totalPages; hasNext; hasPrev };
}

// Hooks unwrap via the shared helpers — never hand-roll envelope sniffing:
import { api, unwrap, unwrapList } from "@/lib/axios";

const tasks   = unwrapList<Task[]>(await api.get<Task[]>("/api/v1/tasks"));
const project = unwrap<ProjectDetails>(res);

// Errors: normalizeError() extracts { message, status, code } from Axios
// errors without `any`. Toasts and forced logout are owned by the
// interceptor layer (opt in/out per request via ApiOptions).
```

**ApiOptions** accepted by every method: `showErrorToast`, `showSuccessToast`,
`params` (query params), `data` (body for DELETE-with-payload).

---

## 📡 Real-Time Communication

### SSE (Server-Sent Events) for Notifications

```
┌──────────────────┐
│  Browser         │
│  EventSource     │
│  Connected       │
└────────┬─────────┘
         │
    GET /api/notifications/stream?token=<jwt>
         │
┌────────▼─────────────────────────────────┐
│  Backend                                  │
│  ├─ Verify token                          │
│  ├─ Extract userId                        │
│  ├─ Store connection in Map<userId, res>  │
│  └─ Send events: data: JSON\n\n           │
└────────┬─────────────────────────────────┘
         │
    ┌────────────────────────┐
    │ Browser receives:      │
    │ {                      │
    │   type: "TASK_ASSIGNED"│
    │   taskId: "123"        │
    │   ...                  │
    │ }                      │
    └────────────────────────┘
         │
    React Query cache updated
         │
    Component re-renders
```

### SSE Connection Management

```typescript
// useNotifications hook
useEffect(() => {
  const source = new EventSource(
    `/api/notifications/stream?token=${token}`
  );

  source.addEventListener("notification", (event) => {
    const notification = JSON.parse(event.data);
    queryClient.setQueryData(["notifications"], (old) => [
      notification,
      ...old,
    ]);
  });

  return () => source.close();
}, [token]);
```

---

## 🗃 Database Architecture

### Core Entities

```
User
├─ id (PK)
├─ email (unique)
├─ password (hashed)
├─ name
├─ role
├─ emailVerified
└─ workspaces (relation)
   └─ Workspace
      ├─ id (PK)
      ├─ name
      ├─ ownerId (FK → User)
      ├─ members (relation)
      │  └─ WorkspaceMember
      │     ├─ userId (FK → User)
      │     ├─ role (OWNER, ADMIN, MEMBER)
      │     └─ joinedAt
      │
      ├─ projects (relation)
      │  └─ Project
      │     ├─ id (PK)
      │     ├─ name
      │     ├─ status
      │     ├─ tasks (relation)
      │     │  └─ Task
      │     │     ├─ id (PK)
      │     │     ├─ title
      │     │     ├─ status
      │     │     ├─ priority
      │     │     ├─ assignees (relation)
      │     │     │  └─ TaskAssignee
      │     │     │     ├─ userId (FK → User)
      │     │     │     └─ assignedAt
      │     │     ├─ subtasks (relation)
      │     │     │  └─ Subtask
      │     │     │     ├─ id (PK)
      │     │     │     ├─ title
      │     │     │     └─ completed
      │     │     ├─ comments (relation)
      │     │     │  └─ Comment
      │     │     │     ├─ id (PK)
      │     │     │     ├─ content
      │     │     │     ├─ authorId (FK → User)
      │     │     │     └─ createdAt
      │     │     ├─ labels (relation)
      │     │     │  └─ Label
      │     │     │     ├─ id (PK)
      │     │     │     ├─ name
      │     │     │     ├─ color
      │     │     │     └─ workspaceId
      │     │     └─ dueDate, startDate, etc.
      │     │
      │     └─ members (relation)
      │        └─ ProjectMember
      │           ├─ userId
      │           └─ role
      │
      ├─ notifications (relation)
      │  └─ Notification
      │     ├─ id (PK)
      │     ├─ userId (FK → User)
      │     ├─ type
      │     ├─ title, message
      │     ├─ read, readAt
      │     └─ createdAt
      │
      ├─ dailyTasks (relation)
      │  └─ DailyTask
      │     ├─ id (PK)
      │     ├─ taskId (FK → Task)
      │     ├─ date
      │     └─ completed
      │
      ├─ focusSessions (relation)
      │  └─ FocusSession
      │     ├─ id (PK)
      │     ├─ userId
      │     ├─ duration
      │     ├─ type (POMODORO, DEEP_WORK, CUSTOM)
      │     └─ completedAt
      │
      └─ labels (relation)
         └─ Label
            ├─ id (PK)
            ├─ name
            ├─ color
            └─ workspaceId
```

### Indexing Strategy

```sql
-- High-priority indexes
CREATE INDEX idx_task_workspace_status 
  ON tasks(workspaceId, status);

CREATE INDEX idx_task_assignee 
  ON taskAssignees(userId, taskId);

CREATE INDEX idx_notification_user_created 
  ON notifications(userId, createdAt DESC);

CREATE INDEX idx_workspace_member_user 
  ON workspaceMembers(userId, workspaceId);

CREATE INDEX idx_daily_task_date 
  ON dailyTasks(date, userId);
```

---

## 🧘 Focus, Energy & Burnout Architecture

### Overview

The wellness system combines focus sessions, energy tracking, calendar workload, and burnout risk into one cohesive view (`/dashboard/wellness`). Data flows from raw activity → per-day aggregates → weekly signals → user-facing widgets.

### Data Model

| Model | Purpose | Key fields |
|-------|---------|-----------|
| `FocusSession` | Completed/running focus blocks | `type` (POMODORO/DEEP_WORK/CUSTOM), `duration`, `completed`, `startedAt` |
| `CalendarDayAggregate` | Per-day workload rollup | `workloadScore`, `plannedHours`, `overCapacity`, `focusMinutes` |
| `BurnoutSignal` | Per-week risk level | `weekStart`, `riskLevel` (LOW/MODERATE/HIGH/CRITICAL), `consecutiveHeavyDays`, `avgDailyLoad` |
| `EnergyLevel` | One daily energy check-in per user | `date` (unique per user), `energyLevel` (1–10), `note` |
| `WellnessRecommendation` | Generated tips with priority + expiry | `type`, `priority`, `expiresAt`, `dismissed` |
| `UserCapacity` / `UserWorkSchedule` | User availability | `weeklyHours`, `dailyCapacityHours`, `workDays`, `workStartHour` |

### Data Flow

```
Daily activity (tasks, focus sessions, time entries)
    │
    ▼
CalendarDayAggregate (per-day workloadScore, plannedHours)
    │
    ├─▶ BurnoutSignal (weekly upsert — riskLevel from workloadScore)
    │       computed on-demand via insights + batch-precomputed weekly by
    │       burnoutSignal.cron.ts (Mon 7 AM, all verified users)
    │
    ├─▶ WellnessRecommendation (daily cron at 6 AM, 3-day expiry)
    │
    ▼
GET /calendar/burnout-trends   → BurnoutTrendsChart (auto-expands on HIGH/CRITICAL)
GET /calendar/recommendations  → WellnessRecommendations (dismiss / dismiss-all)
GET /calendar/energy/history   → EnergyTrendChart (last 30 days)
POST /calendar/energy          → EnergyQuickLog (daily check-in)
GET /focus-sessions/daily-summary → FocusDailySummary (today's sessions/minutes)
GET /focus-sessions/streak     → FocusStreakBadge
```

### Frontend Widgets

| Widget | Hook | Endpoint |
|--------|------|----------|
| `FocusStreakBadge` | `useFocusSession` | `GET /focus-sessions/streak` |
| `FocusDailySummary` | `useFocusSessionDailySummary` | `GET /focus-sessions/daily-summary` |
| `WellnessRecommendations` | `useRecommendations` | `GET /calendar/recommendations` + dismiss endpoints |
| `BurnoutTrendsChart` | `useBurnoutTrends` | `GET /calendar/burnout-trends` |
| `EnergyTrendChart` | `useEnergyHistory` | `GET /calendar/energy/history` |
| `EnergyQuickLog` | `useEnergyLevel` | `GET/POST /calendar/energy` |
| `CapacityChart` / `DailyCapacityView` | `useCapacityChart` / `useDailyCapacityView` | `GET /calendar/aggregates` + capacity/schedule |

### Design Notes

- **Caching** — energy, burnout trends, and daily summaries are Redis-cached with short TTLs and invalidated on mutations (`CalendarCache`, `FocusSessionCache`).
- **Error handling** — every chart exposes `loading` / `error` (with retry) / `empty` states.
- **Burnout risk thresholds** — CRITICAL when ≥5 consecutive heavy days or avgDailyLoad > 1.5; HIGH at ≥3 days or > 1.2; MODERATE at ≥2 heavy days or > 1.0.
- **CSV export** — full energy history is downloadable from the calendar day-details panel via `GET /calendar/energy/export`.

---

## 🔒 Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────┐
│         Transport Security (HTTPS)          │
│  └─ TLS 1.3, Encrypted data in transit      │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────▼─────────────────────┐
│        Session Security                    │
│  ├─ HTTP-only cookies                      │
│  ├─ Secure flag (HTTPS only)               │
│  ├─ SameSite=Lax (CSRF protection)         │
│  └─ Token rotation (15 min access)         │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────▼─────────────────────┐
│       Authentication (RS256 JWT)           │
│  ├─ HMAC proof for exchange                │
│  ├─ Token signature verification           │
│  ├─ Expiry checks                          │
│  └─ Replay attack detection                │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────▼─────────────────────┐
│     Authorization (Role-Based Access)     │
│  ├─ Workspace membership verification      │
│  ├─ Role permission checks                 │
│  ├─ Workspace data isolation               │
│  └─ Cross-workspace access prevention      │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────▼─────────────────────┐
│      Input Validation & Sanitization      │
│  ├─ Zod schema validation                  │
│  ├─ SQL injection prevention (Prisma)      │
│  ├─ XSS prevention (React escaping)        │
│  └─ Rate limiting                          │
└─────────────────────────────────────────────┘
                    │
┌─────────────────────▼─────────────────────┐
│     Data Protection & Privacy              │
│  ├─ Password hashing (Argon2id)            │
│  ├─ Sensitive data encryption              │
│  ├─ Audit logging (all security events)    │
│  └─ GDPR compliance                        │
└─────────────────────────────────────────────┘
```

### Security Checklist

✅ HTTPS only (enforced in production)  
✅ CORS configured (specific origins)  
✅ Rate limiting (5 login attempts/min)  
✅ Token expiry (15 min access, 7 day refresh)  
✅ Workspace isolation  
✅ Role-based access control  
✅ Audit logging  
✅ Timing-safe comparisons  
✅ Argon2 password hashing  
✅ No secrets in frontend code  
✅ No secrets in version control  
✅ Email verification required  
✅ Session timeout  
✅ Secure cookies  
✅ CSRF tokens  

---

## ⚡ Performance Optimization

### Frontend Performance

**1. Code Splitting**
```typescript
// Dynamic imports for lazy loading
const TaskDetails = dynamic(() => import("./TaskDetails"));

// Usage in routes
const TaskDetailsPage = lazy(() => import("@/app/tasks/[id]"));
```

**2. Image Optimization**
```typescript
import Image from "next/image";

// Automatic optimization, responsive sizing
<Image src={url} alt="task" width={400} height={300} />
```

**3. React Query Caching**
```typescript
const { data: tasks } = useQuery({
  queryKey: ["tasks"],
  queryFn: fetchTasks,
  staleTime: 5 * 60 * 1000, // 5 min
  cacheTime: 10 * 60 * 1000, // 10 min
});
```

**4. Component Memoization**
```typescript
// Prevent unnecessary re-renders
const MemoizedTaskCard = memo(TaskCard);

const MemoizedTaskList = useMemo(
  () => tasks.map(t => <TaskCard key={t.id} task={t} />),
  [tasks]
);
```

**5. Tailwind Purging**
- Automatic unused CSS removal
- Optimized bundle size
- Tree-shaking of unused components

### Backend Performance

**1. Database Query Optimization**
```typescript
// Selective includes (avoid N+1 queries)
const tasks = await prisma.task.findMany({
  where: { workspaceId },
  include: {
    assignees: { select: { id: true, name: true } },
    labels: true,
  },
  skip: (page - 1) * limit,
  take: limit,
});
```

**2. Pagination**
```typescript
// Cursor-based or offset-based
const tasks = await prisma.task.findMany({
  take: 20,
  skip: (pageNumber - 1) * 20,
  orderBy: { createdAt: "desc" },
});
```

**3. Caching**
- Redis for frequently accessed data
- Notification cache (Redis for JTI tracking)
- Rate limiting cache

### Monitoring & Metrics

- **Vercel Speed Insights** - Real user monitoring
- **Core Web Vitals** - LCP, FID, CLS
- **Backend metrics** - Response time, throughput
- **Error tracking** - Sentry or similar

---

## ❌ Error Handling

### Error Categories

| Category | Examples | Handling |
|----------|----------|----------|
| **Network** | Connection timeout, DNS failure | Retry with backoff |
| **Auth** | Token expired, unauthorized | Redirect to login |
| **Validation** | Invalid input, schema error | Show form error |
| **Server** | 500 error, database down | Show error page |
| **Rate Limit** | 429 Too Many Requests | Show retry message |

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  code: "AUTH_FAILED" | "RATE_LIMIT" | "INVALID_INPUT" | "SERVER_ERROR";
  message: string;
  details?: Record<string, string>;
}
```

### Error Handling Examples

```typescript
// In hooks
try {
  const response = await api.post("/api/v1/tasks", data);
  if (response?.success) {
    return response.data;
  }
} catch (error) {
  if (error.response?.status === 401) {
    signOut();
  }
  toast.error(error.message);
}

// In components
<ErrorBoundary fallback={<ErrorPage />}>
  <TaskList />
</ErrorBoundary>
```

---

## 🎨 Design Patterns

### 1. Container/Presenter Pattern

Separates logic from presentation:

```typescript
// Container (logic)
function TaskListContainer() {
  const { tasks, loading, error } = useTask();
  return <TaskListPresenter tasks={tasks} loading={loading} />;
}

// Presenter (UI)
function TaskListPresenter({ tasks, loading }) {
  if (loading) return <Spinner />;
  return <ul>{tasks.map(t => <TaskItem key={t.id} task={t} />)}</ul>;
}
```

### 2. Custom Hooks Pattern

Encapsulates business logic:

```typescript
export function useTaskForm() {
  const form = useForm();
  const { mutate: create } = useMutation(createTask);

  const onSubmit = async (data) => {
    await create(data);
    form.reset();
  };

  return { form, onSubmit };
}
```

### 3. Compound Components Pattern

Flexible component composition:

```typescript
<Modal>
  <Modal.Header title="Create Task" />
  <Modal.Body>
    <TaskForm />
  </Modal.Body>
  <Modal.Footer>
    <Button>Cancel</Button>
    <Button>Create</Button>
  </Modal.Footer>
</Modal>
```

### 4. HOC (Higher-Order Component)

Reuses component logic:

```typescript
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthedComponent(props: P) {
    const { data: session } = useSession();
    if (!session) return <LoginPage />;
    return <Component {...props} />;
  };
}

export default withAuth(Dashboard);
```

### 5. Render Props Pattern

Flexible data sharing:

```typescript
<TaskQuery taskId="123">
  {({ task, loading, error }) => (
    loading ? <Spinner /> : <TaskDetails task={task} />
  )}
</TaskQuery>
```

---

## 🔮 Future Roadmap

### Q2 2026

- [ ] WebSocket real-time updates (replace SSE)
- [ ] Offline-first capability (Service Workers)
- [ ] Advanced AI-assisted planning
- [ ] Mobile native apps (React Native)

### Q3 2026

- [ ] Multi-region deployment
- [ ] GraphQL API option
- [ ] Advanced analytics dashboard
- [ ] Integration marketplace

### Q4 2026

- [ ] Background job queues (Bull, RabbitMQ)
- [ ] File streaming & large uploads
- [ ] Video conference integration
- [ ] Advanced reporting

---

## 📚 Related Documentation

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Complete auth system
- [README.md](./README.md) - Getting started
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- [Backend Repo](https://github.com/gaziraihan1/gablura-backend) - API documentation

---

## 👤 Maintainer

**Mohammad Raihan Gazi**  
Creator & Maintainer of Gablura

---

**Last Updated**: August 26, 2026  
**Version**: 1.1.0 (matches package.json)