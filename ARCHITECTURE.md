# 🏗 Focura Client – Complete System Architecture

This document describes the comprehensive architecture, design decisions, data flow, and implementation patterns of **Focura Client**, a modern, full-stack productivity and collaboration SaaS platform.

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
- [Security Architecture](#-security-architecture)
- [Performance Optimization](#-performance-optimization)
- [Error Handling](#-error-handling)
- [Design Patterns](#-design-patterns)
- [Future Roadmap](#-future-roadmap)

---

## 🎯 Architecture Goals

Focura Client is designed to be:

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
│  │  └─ NextAuth + Redux Toolkit + TanStack Query             │  │
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
| **Framework** | Next.js (App Router) | 16.0.10 | Full-stack React with SSR |
| **UI Library** | React | 19.2.0 | Component-based UI |
| **Language** | TypeScript | 5.9.3 | Type safety |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS |
| **State Management** | Redux Toolkit | 2.11.0 | Global state |
| **Server State** | TanStack Query | 5.90.21 | Caching & deduplication |
| **Authentication** | NextAuth.js | 4.24.13 | Session management |
| **HTTP Client** | Axios | 1.13.2 | API requests |
| **Form Handling** | React Hook Form | 7.66.1 | Form management |
| **Validation** | Zod | 4.1.13 | Schema validation |
| **Animations** | Framer Motion | 12.23.24 | Smooth animations |
| **Charts** | Recharts | 3.7.0 | Data visualization |
| **Icons** | Lucide React | 0.554.0 | Icon library |
| **Notifications** | React Hot Toast | 2.6.0 | Toast notifications |
| **Theme** | next-themes | 0.4.6 | Dark/Light mode |

### Frontend Directory Structure

```
focura-client/
├── app/                                  # Next.js App Router
│   ├── (auth)/                          # Authentication routes
│   │   ├── page.tsx
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── (dashboard-pages)/               # Protected dashboard routes
│   │   ├── admin-dashboard/             # Admin panel
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── [...admin-pages]
│   │   │
│   │   └── dashboard/                   # Main dashboard
│   │       ├── layout.tsx               # Shared dashboard layout
│   │       ├── page.tsx                 # Dashboard home
│   │       ├── tasks/                   # Task management
│   │       │   ├── page.tsx
│   │       │   ├── [id]/page.tsx        # Task details
│   │       │   └── new/page.tsx
│   │       ├── kanban/                  # Kanban board
│   │       │   └── page.tsx
│   │       ├── calendar/                # Calendar view
│   │       │   └── page.tsx
│   │       ├── projects/                # Project management
│   │       │   ├── page.tsx
│   │       │   ├── [id]/page.tsx
│   │       │   └── new/page.tsx
│   │       ├── workspaces/              # Workspace management
│   │       │   ├── page.tsx
│   │       │   ├── [id]/page.tsx
│   │       │   └── new/page.tsx
│   │       ├── analytics/               # Analytics dashboard
│   │       │   └── page.tsx
│   │       ├── labels/                  # Label management
│   │       │   └── page.tsx
│   │       ├── storage/                 # File management
│   │       │   └── page.tsx
│   │       ├── notifications/           # Notifications page
│   │       │   └── page.tsx
│   │       ├── activity-logs/           # Activity feed
│   │       │   └── page.tsx
│   │       ├── profile/                 # User profile
│   │       │   └── page.tsx
│   │       ├── help/                    # Help & documentation
│   │       │   └── page.tsx
│   │       ├── billing/                 # Billing & subscription
│   │       │   └── page.tsx
│   │       └── settings/                # Workspace settings
│   │           └── page.tsx
│   │
│   ├── (public-pages)/                  # Public routes
│   │   ├── page.tsx                     # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── resources/page.tsx
│   │   └── features/page.tsx
│   │
│   ├── api/                             # API route handlers
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── [api-routes]/route.ts
│   │
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Home page
│   ├── not-found.tsx                    # 404 page
│   ├── globals.css                      # Global styles
│   └── icon.png                         # Favicon
│
├── components/                          # React Components
│   ├── AdminDashboard/                  # Admin UI
│   │   ├── AdminHeader.tsx
│   │   ├── AdminStats.tsx
│   │   ├── UserManagement.tsx
│   │   └── [...other-admin-components]
│   │
│   ├── Authentication/                  # Auth components
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── GoogleAuthButton.tsx
│   │   └── PasswordReset.tsx
│   │
│   ├── Dashboard/                       # Dashboard layouts
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainContent.tsx
│   │
│   ├── Tasks/                           # Task components
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskDetails.tsx
│   │   ├── TaskForm.tsx
│   │   ├── SubtaskList.tsx
│   │   ├── TaskFilters.tsx
│   │   └── TaskActions.tsx
│   │
│   ├── Kanban/                          # Kanban board
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── KanbanCard.tsx
│   │   └── DragDropContext.tsx
│   │
│   ├── Calendar/                        # Calendar components
│   │   ├── CalendarView.tsx
│   │   ├── CalendarDay.tsx
│   │   ├── EventPopover.tsx
│   │   └── DayViewModal.tsx
│   │
│   ├── Projects/                        # Project components
│   │   ├── ProjectList.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ProjectDetails.tsx
│   │
│   ├── Workspace/                       # Workspace components
│   │   ├── WorkspaceSelector.tsx
│   │   ├── WorkspaceSettings.tsx
│   │   ├── MemberManagement.tsx
│   │   └── WorkspaceDetails.tsx
│   │
│   ├── Labels/                          # Label management
│   │   ├── LabelList.tsx
│   │   ├── LabelForm.tsx
│   │   └── LabelBadge.tsx
│   │
│   ├── Notifications/                   # Notifications
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationPanel.tsx
│   │   ├── NotificationItem.tsx
│   │   └── NotificationCenter.tsx
│   │
│   ├── Shared/                          # Reusable components
│   │   ├── Modal.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── [...other-shared-components]
│   │
│   ├── Navbar/                          # Navigation
│   │   ├── Navbar.tsx
│   │   ├── NavMenu.tsx
│   │   └── UserDropdown.tsx
│   │
│   ├── Footer/                          # Footer
│   │   ├── Footer.tsx
│   │   └── FooterLinks.tsx
│   │
│   ├── Billing/                         # Payment & billing
│   │   ├── PricingCard.tsx
│   │   ├── UpgradeModal.tsx
│   │   ├── InvoiceHistory.tsx
│   │   └── BillingSettings.tsx
│   │
│   ├── Storage/                         # File management
│   │   ├── FileUploader.tsx
│   │   ├── FileList.tsx
│   │   ├── StorageUsage.tsx
│   │   └── FilePreview.tsx
│   │
│   ├── Analytics/                       # Analytics charts
│   │   ├── TaskChart.tsx
│   │   ├── ProductivityChart.tsx
│   │   ├── TeamChart.tsx
│   │   └── StatCard.tsx
│   │
│   └── Providers/                       # Context providers
│       ├── SessionProvider.tsx
│       ├── ThemeProvider.tsx
│       └── QueryProvider.tsx
│
├── hooks/                               # Custom React Hooks (80+)
│   ├── useWorkspace.ts                  # Workspace operations
│   ├── useTask.ts                       # Task CRUD
│   ├── useProject.ts                    # Project management
│   ├── useCalendar.ts                   # Calendar logic
│   ├── useKanbanBoard.ts                # Kanban operations
│   ├── useNotifications.ts              # Real-time notifications + SSE
│   ├── useLabels.ts                     # Label operations
│   ├── useFocusSession.ts               # Focus sessions
│   ├── useAnalytics.ts                  # Analytics queries
│   ├── useBilling.ts                    # Billing operations
│   ├── useStorage.ts                    # File storage
│   ├── useAdmin.ts                      # Admin operations
│   ├── useUser.ts                       # User profile
│   ├── useTheme.ts                      # Theme management
│   ├── usePagination.ts                 # Pagination logic
│   ├── useComment.ts                    # Comment operations
│   ├── useDailyTasks.ts                 # Daily task management
│   ├── useFeatures.ts                   # Feature voting
│   ├── useMeeting.ts                    # Meeting management
│   └── [Page-specific hooks]            # Page controllers
│
├── lib/                                 # Core utilities
│   ├── api/                             # API client
│   │   └── [...api-methods]
│   │
│   ├── auth/                            # Authentication
│   │   ├── authOptions.ts               # NextAuth config
│   │   ├── logout.ts                    # Logout logic
│   │   └── [...auth-helpers]
│   │
│   ├── axios.ts                         # Axios with interceptors
│   ├── email.ts                         # Email utilities
│   ├── hash.ts                          # Hashing functions
│   ├── limiter.ts                       # Rate limiting
│   ├── prisma.ts                        # Prisma client
│   ├── react-query/                     # TanStack Query config
│   ├── task/                            # Task utilities
│   ├── tokens.ts                        # JWT utilities
│   ├── utils.ts                         # Common utilities
│   └── docs/                            # Documentation helpers
│
├── types/                               # TypeScript Definitions (30+)
│   ├── types.ts                         # Core domain types
│   ├── task.types.ts
│   ├── project.types.ts
│   ├── workspace-usage.types.ts
│   ├── admin.types.ts
│   ├── notification.types.ts
│   ├── comment.types.ts
│   ├── meeting.types.ts
│   ├── calendar.types.ts
│   ├── billing.types.ts
│   └── [Feature types]
│
├── constants/                           # App constants
│   └── [...constants]
│
├── context/                             # React Context
│   └── [Context providers]
│
├── utils/                               # Utility functions
│   └── [Helpers & formatters]
│
├── public/                              # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── prisma/                              # Prisma schema
│   ├── schema.prisma
│   └── migrations/
│
├── next.config.ts                       # Next.js config
├── tsconfig.json                        # TypeScript config
├── tailwind.config.ts                   # Tailwind config
├── components.json                      # Shadcn UI config
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

**1. Server Component (Data Fetching)**
```typescript
// app/dashboard/tasks/page.tsx
export default async function TasksPage() {
  // Server-side data fetching
  const tasks = await fetchTasks();
  return <TaskList tasks={tasks} />;
}
```

**2. Client Component (Interactivity)**
```typescript
// components/Tasks/TaskCard.tsx
"use client";

import { useState } from "react";

export default function TaskCard({ task }) {
  const [isOpen, setIsOpen] = useState(false);
  return <div onClick={() => setIsOpen(!isOpen)}>{task.title}</div>;
}
```

**3. Container/Presenter Pattern**
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
│         Global State (Redux Toolkit)         │
│  ├─ Authentication (user, session)           │
│  ├─ Workspaces (current, list)               │
│  └─ UI State (theme, sidebar open)           │
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
   └─ POST /api/auth/exchange to backend
   
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
| `/workspace/[id]/settings` | ❌ | ❌ | ✅ | ✅ | ❌ |
| `/admin` | ❌ | ❌ | ⚠️ | ✅ | ❌ |
| `/tasks` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/workspace/[id]/delete` | ❌ | ❌ | ✅ | ❌ | ❌ |

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
// Request
export const api = {
  async get<T>(endpoint: string) {
    return axiosInstance.get<ApiResponse<T>>(endpoint);
  },
};

// Response Format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

// Usage
const response = await api.get<Task[]>("/api/tasks");
if (response?.success) {
  setTasks(response.data);
}
```

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
  const response = await api.post("/api/tasks", data);
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
- [Backend Repo](https://github.com/gaziraihan1/focura-backend) - API documentation

---

## 👤 Maintainer

**Mohammad Raihan Gazi**  
Creator & Maintainer of Focura

---

**Last Updated**: April 5, 2026  
**Version**: 1.0.0