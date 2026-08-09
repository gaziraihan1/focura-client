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
- [Database Schema](#-database-schema)
- [API Integration](#-api-integration)
- [Hooks](#-hooks)
- [Testing](#-testing)
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
- ✅ Workspace settings and customization
- ✅ Workspace-level plan gating (Free, Pro, Business, Enterprise)
- ✅ Workspace usage analytics and limits tracking
- ✅ Workspace branding customization

#### **Task Management**
- ✅ Full CRUD operations for tasks
- ✅ Task metadata: title, description, status, priority, dates
- ✅ Task assignment to team members
- ✅ Subtasks with hierarchy support
- ✅ Task dependencies (blocking/related)
- ✅ Recurring tasks with custom schedules (daily, weekly, monthly, yearly)
- ✅ Task energy levels (low, medium, high)
- ✅ Task intent tracking (quick-win, deep-work, maintenance, collaboration, review)
- ✅ Task time tracking with estimated hours
- ✅ Task filtering, sorting, and searching
- ✅ Bulk operations for batch updates
- ✅ Daily task planning (primary/secondary tasks)
- ✅ Task quotas (personal and workspace-level)
- ✅ GitHub integration (PR, issue, branch, commit, workflow, release links)

#### **Multiple Work Views**
- ✅ **List View** - Traditional task list with filters
- ✅ **Kanban Board** - Status-driven columns with WIP limits and per-project custom workflows
- ✅ **Calendar View** - Visual task scheduling and deadlines with burnout trend analysis
- ✅ **Daily Tasks** - Focused daily planning workflow
- ✅ **Team Tasks** - Cross-workspace team task management

#### **Collaboration & Communication**
- ✅ Threaded comments and discussions on tasks
- ✅ @mentions for team notifications
- ✅ Real-time notifications via SSE + Redis pub/sub
- ✅ Activity feed and audit trail
- ✅ Team visibility and transparency
- ✅ Workspace announcements with targeting
- ✅ Project announcements with pinning

#### **Focus & Productivity Intelligence**
- ✅ Focus sessions (Pomodoro, deep work, custom)
- ✅ Time tracking and analytics
- ✅ Daily planning workflows
- ✅ Capacity and workload visualization
- ✅ Productivity insights and metrics
- ✅ Burnout risk detection and trend analysis
- ✅ Energy level tracking and check-ins
- ✅ Wellness recommendations
- ✅ Capacity scheduling and work schedule preferences

#### **Focus & Wellness System**
The wellness dashboard (`/dashboard/wellness`) brings focus, energy, and burnout data into one view:

| Widget | Purpose | Backed by |
|--------|---------|-----------|
| **Focus Streak Badge** | Current focus streak + best streak | `GET /focus-sessions/streak` |
| **Focus Daily Summary** | Today's sessions, minutes, per-type breakdown | `GET /focus-sessions/daily-summary` |
| **Wellness Recommendations** | Personalized burnout-prevention tips + dismiss / dismiss-all | `GET /calendar/recommendations`, `PATCH /:id/dismiss`, `POST /dismiss-all` |
| **Burnout Trends Chart** | Weekly risk level (LOW → CRITICAL); auto-expands when risk is HIGH/CRITICAL | `GET /calendar/burnout-trends` |
| **Energy Trend Chart** | Last 30 days of energy levels with hover tooltips | `GET /calendar/energy/history` |
| **Energy Quick Log** | Floating daily energy check-in (floating action button) | `POST /calendar/energy` |
| **Focus Session Card** | Per-task Pomodoro / Deep Work timer with auto-complete | `POST /focus-sessions/start`, `/:id/complete`, `/:id/cancel` |

- **Energy CSV export** — download full energy history via `GET /calendar/energy/export` (button in the calendar day details panel)
- **Error states** — every chart exposes a retry action and empty/loading states
- **Hook coverage** — `useEnergyLevel`, `useBurnoutTrends`, `useFocusSession`, `useCapacityChart`, `useDailyCapacityView`

#### **Meetings**
- ✅ Meeting creation and management
- ✅ Meeting visibility settings (public, private, team-only)
- ✅ Attendee management
- ✅ Meeting status tracking (scheduled, in-progress, completed, cancelled)
- ✅ Meeting detail pages with stats

#### **Project Management**
- ✅ Project creation and configuration
- ✅ Project statuses and lifecycle (PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, ARCHIVED)
- ✅ Team member assignment with roles (PROJECT_MANAGER, MEMBER, VIEWER)
- ✅ Project sections for Kanban organization
- ✅ Sprint planning
- ✅ Project milestones
- ✅ Custom project views (Kanban, List, Calendar, Timeline)
- ✅ Project favorites
- ✅ Project analytics and statistics
- ✅ Project archiving
- ✅ Project slug-based routing

#### **Automation Rules**
- ✅ "When X happens, do Y" rules at workspace or project level (`/settings/automations`)
- ✅ Triggers: status changed, task created (with from → to status filters)
- ✅ Actions: assign user (by email or role), set priority, notify members (SSE)
- ✅ Loop-safe by construction — rules fire only on user-initiated mutations
- ✅ Plan-gated rule limits (Free 10 · Pro 50 · Business 200 · Enterprise unlimited) with upgrade prompts
- ✅ Per-rule run history and activity logging

#### **Project Templates**
- ✅ Tier-gated template catalog (Free / Pro / Business) served live from the backend
- ✅ One-click import — clone a full project structure (sections, tasks, labels, milestones, views) into any workspace
- ✅ Templates surface inside the creation flow — pick one on the New Project page and import directly while creating
- ✅ Sidebar quick-picker — start a project from any dashboard page via the sidebar "New project" button
- ✅ Save any project as a reusable private workspace template from Project Settings → General
- ✅ Tier badges, lock states and upgrade CTAs so paid templates show their value
- ✅ Search, category and tier filters on the public templates page
- ✅ Community ratings — 1–5 stars, one per user, with live averages on every card
- ✅ Featured strip — a curated, rating-sorted highlight rail above the gallery
- ✅ Author credits on public templates (share a saved template publicly)
- ✅ Template email waitlist (request a template)

#### **Analytics & Insights**
- ✅ Workspace analytics dashboard
- ✅ Task completion rates and status distribution
- ✅ Focus session statistics
- ✅ Team activity tracking
- ✅ Storage and usage statistics
- ✅ Custom charts and visualizations (Recharts)
- ✅ Project-level analytics (KPI cards, completion trends, deadline risk, member leaderboard, priority distribution, time summaries)
- ✅ Workspace usage analytics (engagement, storage, features, growth)
- ✅ Burnout trend charts

#### **Labels & Organization**
- ✅ Custom label creation per workspace
- ✅ Multi-label task tagging
- ✅ Label filtering and organization
- ✅ Color-coded labels

#### **File Management & Storage**
- ✅ File uploads and attachments
- ✅ Cloudinary cloud integration
- ✅ Storage usage tracking per workspace
- ✅ File browser and management UI
- ✅ Storage optimization tools (largest files table, user contributions)
- ✅ Storage breakdown charts and trend analysis
- ✅ Upload rate limiting

#### **Billing & Subscription**
- ✅ Plan management and upgrades (Free, Pro, Business)
- ✅ Stripe payment integration
- ✅ Billing history and invoices
- ✅ Usage-aware plan limits (members, storage, meetings)
- ✅ Subscription status tracking
- ✅ Monthly and yearly billing cycles

#### **Integrations**
- ✅ Third-party OAuth integrations (GitHub, Slack, Google, Discord)
- ✅ Per-user and per-workspace integration configuration
- ✅ Integration sync and stats
- ✅ OAuth callback handling

#### **Admin Dashboard**
- ✅ Platform-wide metrics and monitoring
- ✅ User management (ban/unban, view details)
- ✅ Workspace administration (edit limits, delete/restore)
- ✅ Project administration
- ✅ Billing overview (subscriptions, invoices)
- ✅ Activity feed
- ✅ Contact message management
- ✅ Job posting management (create, edit, pin, toggle status)
- ✅ Templates waitlist management
- ✅ Resource management (popular resources, product updates)

#### **Feature Requests & Roadmap**
- ✅ Public feature request board
- ✅ Upvote/downvote system
- ✅ Feature status tracking (planned, in-progress, shipped)
- ✅ Product roadmap page

#### **Resources & CMS**
- ✅ Popular resources management
- ✅ Product updates/changelog
- ✅ Resource categories and search

#### **Security**
- ✅ Two-factor authentication (2FA)
- ✅ Active session management
- ✅ API token management (create, revoke)
- ✅ Due date reminder settings
- ✅ Security settings panel

#### **User Experience**
- ✅ Dark/Light theme support with FOUC prevention
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time updates via SSE + Redis pub/sub
- ✅ Optimistic UI updates
- ✅ Toast notifications and alerts
- ✅ Smooth animations with Framer Motion
- ✅ PWA support with offline capabilities (IndexedDB + Service Worker)
- ✅ Offline indicator and mutation queue
- ✅ Multi-tab session coordination via BroadcastChannel
- ✅ Session timeout with inactivity and absolute limits
- ✅ Keyboard focus trapping for accessibility
- ✅ Screen reader announcements

#### **Public Pages & Marketing**
- ✅ Landing page with hero, features, pricing, testimonials, FAQ
- ✅ About page with mission, values, founder, tech stack
- ✅ Pricing page with plan comparison and billing toggle
- ✅ Features page with interactive demo
- ✅ Solutions page with use cases
- ✅ Templates gallery (tier-gated live catalog + one-click import + save-as-template)
- ✅ Careers page with job listings
- ✅ Product roadmap
- ✅ Help center with searchable knowledge base
- ✅ User guides with sectioned documentation
- ✅ Developer guides with architecture docs
- ✅ API documentation with endpoint cards
- ✅ Legal pages (Terms, Privacy, Cookies, Refund)

---

## 🛠 Tech Stack

### **Frontend**

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.10 |
| **UI Library** | React | 19.2.0 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **State Management** | TanStack Query | 5.90.21 |
| **Authentication** | NextAuth.js | 4.24.13 |
| **HTTP Client** | Axios | 1.13.2 |
| **Form Management** | React Hook Form | 7.66.1 |
| **Validation** | Zod | 3.25.76 |
| **Animations** | Framer Motion | 12.23.24 |
| **Charts** | Recharts | 3.7.0 |
| **Icons** | Lucide React | 0.554.0 |
| **File Upload** | Cloudinary | 2.8.0 (next-cloudinary 6.17.5) |
| **Date Utilities** | date-fns + dayjs | 4.1.0 / 1.11.19 |
| **Notifications** | React Hot Toast | 2.6.0 |
| **Theme** | next-themes | 0.4.6 |
| **MDX** | @next/mdx + @mdx-js | 16.1.6 |
| **Accessibility** | Custom a11y utilities | - |

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
- **Database**: PostgreSQL (Prisma managed) — 59 models, 50 enums
- **Cache/Redis**: Upstash Redis
- **Pub/Sub**: Redis (ioredis TCP connection)
- **Files**: Cloudinary
- **Payments**: Stripe
- **Monitoring**: Vercel Speed Insights
- **Email**: Nodemailer (SMTP)
- **Offline**: IndexedDB (via idb) + Workbox Service Worker

### **Testing**
- **Framework**: Vitest 4.x
- **DOM**: jsdom
- **Component Testing**: @testing-library/react 16.x
- **Mocking**: MSW (Mock Service Worker) 2.x
- **Coverage**: @vitest/coverage-v8 (70% line threshold)
- **Assertions**: vitest/globals + @testing-library/jest-dom

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
│  • Hook-based data abstraction (116 hooks)                   │
│  • Centralized API layer with interceptors                   │
│  • React Query for caching & deduplication                   │
│  • PWA with offline support (IndexedDB + Service Worker)     │
│  • Multi-tab session coordination (BroadcastChannel)         │
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
POST /api/v1/tasks (with JWT token)
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
GET /api/v1/notifications/stream?token=<accessToken>
    ↓
Backend verifies token, extracts userId
    ↓
Awaits Redis SUBSCRIBE sse:user:<userId> confirmation
    ↓
Sends "connected" handshake — channel is guaranteed live
    ↓
────────────────────────────────────────────────
Any backend instance calls notifyUser()
    ↓
1. Writes Notification row to Postgres (durable)
2. PUBLISH sse:user:<userId> payload → Redis
    ↓
Redis delivers to all subscribed backend instances
    ↓
Each instance fans out to its open SSE Response objects
    ↓
────────────────────────────────────────────────
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

### **Offline Support (PWA)**

```
┌──────────────────────────────────────────────────────┐
│                Service Worker (Workbox)               │
│  • Precaching for offline shell                       │
│  • Runtime caching for API calls                      │
│  • Background sync for pending mutations              │
└────────────────┬─────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────┐
│              IndexedDB (via idb)                       │
│  • TASKS, PROJECTS, NOTIFICATIONS stores              │
│  • PENDING_MUTATIONS queue for offline writes         │
│  • USER_DATA for profile caching                      │
│  • CRUD operations with conflict resolution           │
└──────────────────────────────────────────────────────┘
```

### **Multi-Tab Session Coordination**

```
BroadcastChannel("focura-auth")
    ↓
Events: refresh-start, refresh-complete, logout-all
    ↓
All tabs stay in sync:
  • Token refresh in one tab → all tabs know
  • Logout in one tab → all tabs log out
  • Session expiry → all tabs redirect
```

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

# Email (SMTP — for verification and password reset)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=<your-email>
EMAIL_SERVER_PASSWORD=<your-app-password>
EMAIL_FROM="Focura <your-email>"

# Optional
NODE_OPTIONS=--dns-result-order=ipv4first
NEXT_PUBLIC_GA_MEASUREMENT_ID=from-google-analytics-admin

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

3. **Generate Prisma client**
```bash
npx prisma generate
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 📂 Project Structure

```
focura-client/
├── app/                               # Next.js App Router
│   ├── (auth)/                        # Auth route group
│   ├── (dashboard-pages)/             # Protected dashboard routes
│   │   ├── admin-dashboard/           # Admin dashboard (12 pages)
│   │   └── dashboard/                 # Main dashboard (40+ pages)
│   ├── (public-pages)/                # Public routes (17 pages)
│   │   ├── about/
│   │   ├── api-docs/
│   │   ├── careers/
│   │   ├── contact/
│   │   ├── dev-guides/
│   │   ├── features/
│   │   │   └── all-features/
│   │   ├── guides/
│   │   ├── help/
│   │   ├── pricing/
│   │   ├── resources/
│   │   │   ├── popular/[slug]/
│   │   │   └── update/[slug]/
│   │   ├── roadmap/
│   │   ├── solutions/
│   │   ├── templates/
│   │   └── legal/ (terms, privacy, cookies, refund)
│   ├── authentication/                # Auth flow (7 pages)
│   │   ├── login/
│   │   ├── registration/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── verify-email/
│   │   ├── verified/
│   │   └── success/
│   ├── api/                           # API route handlers
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       ├── register/
│   │       ├── verify-email/
│   │       ├── forgot-password/
│   │       └── reset-password/
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Home page
│   ├── error.tsx                      # Root error boundary
│   ├── global-error.tsx               # Global error page
│   ├── not-found.tsx                  # 404 page
│   └── globals.css                    # Global styles
│
├── components/                        # React Components (~350 files)
│   ├── Providers/                     # App providers (Session, Theme, Query, Toast, Offline)
│   ├── Wrapper/                       # Layout wrapper (nav/footer toggle)
│   ├── Navbar/                        # Navigation (Main + Auth variants)
│   ├── Footer/                        # Site footer
│   ├── Home/                          # Landing page (11 components)
│   ├── About/                         # About page (9 components)
│   ├── Features/                      # Features page (11 components)
│   ├── Solutions/                     # Solutions page (6 components)
│   ├── Pricing/                       # Pricing page (8 components)
│   ├── Templates/                     # Templates gallery (11 components)
│   ├── Contact/                       # Contact page (6 components)
│   ├── Careers/                       # Careers page (5 components)
│   ├── Help/                          # Help center (7 components + data)
│   ├── Guides/                        # User guides (15 components)
│   ├── DevGuides/                     # Developer guides (22 components)
│   ├── ApiDocs/                       # API documentation (9 components)
│   ├── Roadmap/                       # Product roadmap (3 components)
│   ├── Resources/                     # Resources hub (11 components)
│   ├── Authentication/                # Auth forms (6 components)
│   ├── ForgetPassword/                # Forgot password (3 components)
│   ├── Reset-password/                # Reset password (9 components)
│   ├── VerifyEmail/                   # Email verification (5 components)
│   ├── Themes/                        # Theme switcher
│   ├── Labels/                        # Label components (5 files)
│   ├── Notifications/                 # Notification bell + dropdown
│   ├── Tasks/                         # Task form components (9 files)
│   ├── Dashboard/                     # Main dashboard (~170 files)
│   │   ├── DashboardShell.tsx         # Layout shell
│   │   ├── Sidebar.tsx                # Main sidebar
│   │   ├── TopNavbar.tsx              # Top navigation
│   │   ├── Workspaces/                # Workspace management (30+ files)
│   │   │   ├── Workspaces/            # Workspace listing
│   │   │   ├── WorkspacePage/         # Workspace detail
│   │   │   ├── WorkspaceSettings/     # Workspace settings
│   │   │   ├── TeamPage/              # Team management
│   │   │   ├── ProjectCard/           # Project card components
│   │   │   ├── project/               # Project detail
│   │   │   │   ├── Tasks/             # Project task board
│   │   │   │   ├── Settings/          # Project settings
│   │   │   │   ├── Layout/            # Project layout
│   │   │   │   ├── Analytics/         # Project analytics (8 charts)
│   │   │   │   └── Announcements/     # Project announcements
│   │   │   └── Analytics/             # Workspace usage analytics
│   │   ├── Projects/                  # Projects listing (grid/list)
│   │   ├── AllProjects/               # Cross-workspace projects
│   │   ├── AllTasks/                  # Cross-workspace tasks
│   │   ├── TaskDetails/               # Task detail view
│   │   ├── TeamTask/                  # Team tasks view
│   │   ├── WorkspaceNewTask/          # Workspace task creation
│   │   ├── Calendar/                  # Calendar view (10 files)
│   │   ├── CalendarView/              # Alternative calendar (9 files)
│   │   ├── KanbanView/                # Kanban board (5 files)
│   │   ├── Profile/                   # User profile (10 files)
│   │   ├── Analytics/WorkspaceUsage/  # Workspace usage analytics
│   │   ├── Storage/                   # Storage management (10 files)
│   │   ├── Labels/                    # Label management
│   │   ├── Notifications/             # Notifications page
│   │   ├── ActivityLogs/              # Activity logs (12 files)
│   │   ├── Invitation/                # Invitation flow
│   │   ├── CreateWorkspacePage/       # Workspace creation wizard
│   │   ├── ProjectDetails/            # Legacy project details
│   │   └── help/                      # In-dashboard help
│   ├── AdminDashboard/                # Admin panel (30 files)
│   │   ├── User/                      # User management
│   │   ├── Workspace/                 # Workspace admin
│   │   ├── Resource/                  # Resource CMS
│   │   ├── Contact/                   # Contact messages
│   │   └── careers/                   # Job posting management
│   ├── Settings/                      # Settings forms (20 files)
│   │   ├── Integrations/              # Personal integrations
│   │   └── WorkspaceIntegrations/     # Workspace integrations
│   ├── Shared/                        # Reusable components (20 files)
│   ├── ui/                            # Atomic UI primitives
│   ├── TermsAndConditions/            # Legal: Terms (7 files)
│   ├── PrivacyAndPolicy/              # Legal: Privacy (9 files)
│   ├── RefundPolicy/                  # Legal: Refund (11 files)
│   └── Cookies/                       # Legal: Cookies (10 files)
│
├── hooks/                             # Custom React Hooks (116 files)
│   ├── *Keys.ts                       # Query key factories (4 files)
│   ├── useUser.ts                     # Current user
│   ├── useAuthForm.ts                 # Auth forms
│   ├── useForgetPasswordPage.ts       # Forgot password
│   ├── useResetPasswordPage.ts        # Reset password
│   ├── useVerifyEmail.ts             # Email verification
│   ├── useUserProfile.ts             # Profile management
│   ├── useTask*.ts                    # Task hooks (12 files)
│   ├── useWorkspace*.ts              # Workspace hooks (14 files)
│   ├── useProject*.ts                # Project hooks (5 files)
│   ├── useKanban*.ts                 # Kanban hooks (4 files)
│   ├── useNotification*.ts           # Notification hooks (7 files)
│   ├── useActivity*.ts              # Activity hooks (2 files)
│   ├── useAnalytics*.ts             # Analytics hooks (4 files)
│   ├── useCalendar*.ts              # Calendar hooks (3 files)
│   ├── useComment*.ts               # Comment hooks (2 files)
│   ├── useMeeting*.ts               # Meeting hooks (3 files)
│   ├── useLabel*.ts                 # Label hooks (2 files)
│   ├── useStorage*.ts               # Storage hooks (5 files)
│   ├── useResource*.ts              # File resource hooks (3 files)
│   ├── useTeam*.ts                  # Team hooks (3 files)
│   ├── useInvitationPage.ts         # Invitation handling
│   ├── useFocusSession.ts           # Focus sessions
│   ├── useEnergyLevel.ts            # Energy tracking
│   ├── useBilling*.ts               # Billing hooks (2 files)
│   ├── useSecurity.ts               # Security settings
│   ├── useApiTokens.ts              # API token management
│   ├── useUserSettings.ts           # User settings
│   ├── useAdmin.ts                  # Admin dashboard
│   ├── useContactMessage.ts         # Contact messages
│   ├── useHelpTopics.ts             # Help topics
│   ├── useGlobalSearch.ts           # Global search
│   ├── useFeatures.ts               # Feature flags
│   ├── useAnnouncement*.ts          # Announcements (2 files)
│   ├── useJobStatus.ts              # Background job polling
│   ├── integration/                  # Integration hooks (1 file)
│   ├── useServiceWorker.ts          # PWA service worker
│   ├── useOfflineStatus.ts          # Offline status
│   ├── useFocusTrap.ts              # Accessibility focus trap
│   ├── usePagination.ts             # Pagination state
│   ├── useUrlState.ts               # URL sync
│   └── useTheme.ts                  # Theme toggle
│
├── lib/                               # Core libraries & utilities (23 files)
│   ├── api/
│   │   ├── server.ts                 # Server-side API helper
│   │   └── fetcher.ts               # Client-side fetch wrapper
│   ├── auth/
│   │   ├── authOptions.ts            # NextAuth configuration (360 lines)
│   │   └── logout.ts                # Logout utility
│   ├── csrf.ts                       # CSRF token management
│   ├── axios.ts                      # Axios instance + interceptors (745 lines)
│   ├── prisma.ts                     # Prisma client singleton
│   ├── email.ts                      # Nodemailer email service (336 lines)
│   ├── hash.ts                       # Argon2 password hashing
│   ├── limiter.ts                    # Rate limiting (Redis/in-memory)
│   ├── tokens.ts                     # Crypto token generation
│   ├── theme.ts                      # Dark mode management
│   ├── utils.ts                      # cn() utility (clsx + tailwind-merge)
│   ├── a11y.ts                       # Accessibility helpers
│   ├── error/
│   │   └── error.ts                  # Error message extractor
│   ├── security/
│   │   └── sanitize.ts              # Input sanitization
│   ├── offline/
│   │   └── offlineStorage.ts        # IndexedDB wrapper (218 lines)
│   ├── react-query/
│   │   └── query-client.ts          # React Query client config
│   ├── task/
│   │   └── time.ts                  # Task time utilities
│   ├── apiData.ts                    # API endpoint registry (1194 lines)
│   ├── devGuides.ts                  # Dev guide metadata
│   ├── roadmapData.ts               # Product roadmap data
│   └── templatesData.ts             # Project templates (8 templates)
│
├── types/                             # TypeScript type definitions (33 files)
│   ├── types.ts                      # Core domain types (725 lines)
│   ├── index.ts                      # Barrel re-export
│   ├── task.types.ts                 # Task + GitHub integration types
│   ├── taskForm.types.ts             # Task creation form types
│   ├── taskDetails.types.ts          # Task detail view types
│   ├── task-activity.types.ts        # Activity feed types
│   ├── project.types.ts              # Project types
│   ├── workspace-usage.types.ts      # Workspace analytics types
│   ├── storage.types.ts              # Storage management types
│   ├── storage-overview.types.ts     # Storage overview types
│   ├── calendar.types.ts             # Calendar + wellness types
│   ├── calendarPage.types.ts         # Calendar page types
│   ├── billing.success.types.ts      # Billing success types
│   ├── billing.upgrade.types.ts      # Billing upgrade types
│   ├── meeting.types.ts              # Meeting types
│   ├── comment.types.ts              # Comment + mention types
│   ├── notification.types.ts         # Notification types
│   ├── resource.types.ts             # CMS resource types
│   ├── subtasks.types.ts             # Subtask types
│   ├── plan.types.ts                 # Plan context types
│   ├── activityFilter.types.ts       # Activity filter types
│   ├── admin.types.ts                # Admin panel types (323 lines)
│   ├── announcement.types.ts         # Announcement types (157 lines)
│   ├── dashboard.ts                  # Dashboard types
│   ├── docs.types.ts                 # Documentation types
│   ├── feature.types.ts              # Feature request types
│   ├── focusTask.types.ts            # Focus task types
│   ├── guides.types.ts               # Help guide types
│   ├── help.types.ts                 # Help center types
│   ├── integration.types.ts          # Integration types
│   ├── job.types.ts                  # Job posting types
│   ├── templates.types.ts            # Project template types
│   └── next-auth.d.ts               # NextAuth module augmentation
│
├── utils/                             # Utility functions (15 files)
│   ├── analytics.utils.ts            # Analytics formatting (205 lines)
│   ├── announcement.utils.ts         # Rich-text announcement parser
│   ├── billing.success.utils.ts      # Billing success helpers
│   ├── billing.upgrade.utils.ts      # Billing upgrade helpers
│   ├── calendar.utils.ts             # Calendar helpers
│   ├── comments.utils.ts             # Comment tree builder (146 lines)
│   ├── file.utils.ts                 # File handling helpers
│   ├── meeting.utils.ts              # Meeting formatting
│   ├── meetingDetails.utils.ts       # Meeting detail helpers
│   ├── project.utils.ts              # Project color helpers
│   ├── resources.utils.ts            # Resource page helpers
│   ├── slugify.ts                    # URL slug utilities
│   ├── task-activity.utils.ts        # Activity feed helpers (127 lines)
│   ├── task.utils.ts                 # Task formatting (88 lines)
│   └── taskcard.utils.ts             # Task card helpers
│
├── constants/                         # App constants (15 files)
│   ├── activityFilter.constants.ts   # Activity filter options
│   ├── admin.constants.ts            # Admin panel colors
│   ├── adminContact.constants.ts     # Contact message filters
│   ├── analytics.constants.ts        # Analytics KPI config (126 lines)
│   ├── announcement.constants.ts     # Announcement editor config
│   ├── billing.success.constants.ts  # Billing success data (152 lines)
│   ├── billing.upgrade.constants.ts  # Billing plans + prices (102 lines)
│   ├── features.constants.ts         # Marketing features
│   ├── guides.constants.ts           # Help guide content (273 lines)
│   ├── home.constants.ts             # Homepage content (120 lines)
│   ├── intent.constants.ts           # Task intent/energy config
│   ├── pricing.constants.ts          # Pricing page data (122 lines)
│   ├── storage.constants.ts          # Storage page data
│   ├── task.constants.ts             # Task status options
│   └── taskForm.constants.ts         # Task form defaults (69 lines)
│
├── context/                           # React Context (3 files)
│   ├── providers/
│   │   ├── query-provider.tsx        # React Query provider
│   │   └── ToastProvider.tsx         # Toast notifications + a11y announcers
│   └── workspacePlan/
│       └── WorkspacePlanContext.tsx   # Workspace plan tier context
│
├── prisma/                            # Database Schema
│   ├── schema.prisma                 # Full schema (1600+ lines, 59 models, 50 enums)
│   └── migrations/                   # 44 migrations (Feb 2026 - Aug 2026)
│
├── tests/                             # Test setup
│   ├── polyfill.js                   # Test polyfills
│   └── setup.ts                      # Test configuration
│
├── public/                            # Static assets
├── .env.local                         # Environment variables (local)
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── vitest.config.ts                   # Vitest test configuration
├── eslint.config.mjs                  # ESLint configuration
├── postcss.config.mjs                 # PostCSS configuration
├── vercel.json                        # Vercel deployment config
├── package.json                       # Dependencies
├── README.md                          # This file
├── ARCHITECTURE.md                    # Architecture documentation
├── AUTHENTICATION.md                  # Auth system documentation
├── CONTRIBUTING.md                    # Contributing guidelines
├── CODE_OF_CONDUCT.md                # Code of conduct
├── AI_IMPLEMENTATION_GUIDE.md         # AI implementation guide
├── FRONTEND_ANALYSIS.md               # Frontend analysis
├── FRONTEND_AUTH_GUIDE.md             # Frontend auth guide
└── INTEGRATIONS_CONNECTOR.md         # Integration connector docs
```

---

## 🔐 Authentication

### **Authentication Flow**

1. **User Login**
   - User enters credentials or uses Google OAuth
   - NextAuth validates credentials locally or with Google

2. **Token Exchange**
   - NextAuth generates HMAC-SHA256 proof of the session
   - Proof sent to backend's `/api/v1/auth/exchange`
   - Backend validates proof and issues RS256 JWT tokens (access + refresh)

3. **Token Storage**
   - Tokens stored in HTTP-only NextAuth session cookie
   - Private key never exposed to frontend
   - Secure by default

4. **Token Refresh**
   - Axios interceptor attaches token to requests
   - Backend validates token on every request
   - Token silently refreshes 1 minute before expiry via background timer
   - Automatic refresh on page load via NextAuth
   - Lock map prevents concurrent refresh calls for the same session

5. **Token Revocation**
   - Logout revokes token JTI in Upstash Redis
   - Logout-all-devices revokes all refresh tokens
   - Global invalidation via token version increment

6. **Multi-Tab Coordination**
   - BroadcastChannel broadcasts `refresh-start`, `refresh-complete`, `logout-all` events
   - All tabs stay in sync for token state and logout

7. **Session Timeout**
   - 30-minute inactivity timeout (warns at 25 min)
   - 7-day absolute timeout (warns at 6 days 23 hours)
   - Automatic force logout on expiry

### **Protected Routes**

All dashboard routes require authentication:
- Server components check `getServerSession()` for SSR redirect
- Client layouts check membership and roles via hooks
- API routes validate JWT token
- Admin routes check `useIsFocuraAdmin()` hook
- Plan-gated features check `useWorkspacePlan()` context

### **Role-Based Access Control**

```ts
// Owner - Full workspace control
// Admin - Member management, project creation
// Member - Task and project access

// Project roles:
// PROJECT_MANAGER - Full project control
// MEMBER - Task access
// VIEWER - Read-only access
```

### **Security Features**

- ✅ Argon2 password hashing with timing-attack resistance
- ✅ CSRF token management (55-min cache, auto-refresh on failure)
- ✅ Input sanitization (XSS and open redirect prevention)
- ✅ Rate limiting (5 attempts/min per IP on login)
- ✅ Timing-safe comparisons for token validation
- ✅ Terminal auth code detection (force logout on suspicious activity)

For detailed authentication documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md)

---

## 🗄 Database Schema

### **59 Models**

| Category | Models |
|----------|--------|
| **Auth & Users** | `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken`, `RefreshToken` |
| **Workspaces** | `Workspace`, `WorkspaceMember`, `WorkspaceInvitation` |
| **Projects** | `Project`, `ProjectSection`, `ProjectMember`, `Sprint`, `ProjectMilestone`, `ProjectView`, `ProjectFavorite` |
| **Tasks** | `Task`, `TaskAssignee`, `TaskDependency`, `TaskRecurrence`, `DailyTask` |
| **Collaboration** | `Comment`, `CommentMention`, `Label`, `TaskLabel`, `File`, `UploadRateLimit` |
| **Meetings** | `Meeting`, `MeetingAttendee` |
| **Announcements** | `Announcement`, `AnnouncementTarget` |
| **Focus & Wellness** | `FocusSession`, `TimeEntry`, `UserCapacity`, `UserWorkSchedule`, `CalendarDayAggregate`, `GoalCheckpoint`, `SystemCalendarEvent`, `BurnoutSignal` |
| **Activity** | `Activity`, `Notification` |
| **Billing** | `Plan`, `Subscription`, `Invoice`, `Payment`, `UsageRecord`, `BillingEvent` |
| **Integrations** | `Integration` |
| **Automation & Templates** | `AutomationRule`, `ProjectTemplate`, `TemplateRating` |
| **CMS & Content** | `PopularResource`, `ProductUpdate`, `ContactMessage`, `JobPosting`, `TemplateList`, `SubscribeList` |
| **Feature Requests** | `FeatureRequest`, `FeatureVote` |

### **50 Enums**

`UserRole`, `WorkspacePlan`, `WorkspaceRole`, `InvitationStatus`, `ProjectStatus`, `ProjectRole`, `ProjectViewType`, `TaskStatus`, `Priority`, `TaskEnergy`, `TaskEffort`, `TaskIntent`, `DependencyType`, `RecurrencePattern`, `DailyTaskType`, `MeetingVisibility`, `MeetingStatus`, `AnnouncementVisibility`, `GoalType`, `SystemEventType`, `BurnoutRisk`, `FocusType`, `ActivityType`, `EntityType`, `NotificationType`, `FeatureStatus`, `VoteType`, `BillingCycle`, `SubStatus`, `InvoiceStatus`, `PaymentStatus`, `UsageMetric`, `BillingEventType`, `ResourceStatus`, `TimeEntryCategory`, `RecommendationType`, `ContactCategory`, `ContactMessageStatus`, `JobDepartment`, `JobLocationType`, `JobType`, `JobExperience`, `JobStatus`, `TemplateTier`, `AutomationTrigger`, `AutomationActionType`

### **Migration History (44 migrations)**

Spanning **Feb 2, 2026** to **Aug 9, 2026**, including:
- Initial schema and daily tasks
- Calendar intelligence and wellness models
- Focus session task relations
- File upload and rate limiting
- Meeting system
- Billing and subscription system
- Comment mentions
- Announcement system with project targeting
- Plan feature fields
- User banning and workspace soft-delete
- Contact and job posting models
- Template waitlist and newsletter subscriptions
- Automation rules (triggers/actions) and tiered workspace templates
- Template ratings and featured templates
- Audit logging fields
- Resource management (popular resources, product updates)
- Energy tracking models
- Database performance indexes

---

## 🔌 API Integration

### **API Client Setup**

The Axios instance in `lib/axios.ts` handles:
- Automatic JWT token attachment from NextAuth session
- Token caching with 10-minute TTL to avoid redundant session fetches
- Silent token refresh on `TOKEN_EXPIRED` responses
- CSRF token attachment for mutating requests
- Type-safe API responses via `ApiResponse<T>` wrapper
- Session timeout management (30-min inactivity, 7-day absolute)
- Multi-tab coordination via BroadcastChannel
- Terminal auth code detection (force logout on suspicious activity)

```ts
import { api } from '@/lib/axios';

// api.get<T> returns ApiResponse<T> = { success, data?: T, message? }
const response = await api.get<NotificationsResponse>('/api/notifications');
const notifications = response?.data; // NotificationsResponse

// POST / PATCH / DELETE follow the same pattern
await api.post('/api/v1/tasks', { title: 'New Task' });

// File upload
await api.upload('/api/v1/resources/upload', formData);
```

### **Backend API Endpoints**

**Base URL:** `/api/v1`

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/exchange` | Exchange HMAC proof for RS256 tokens |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | Logout (single/all devices) |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset |
| `POST` | `/api/v1/auth/reset-password` | Reset password with token |
| `GET` | `/api/v1/user` | Get current user |
| `GET` | `/api/v1/user/profile` | Get user profile |
| `PUT` | `/api/v1/user/profile` | Update user profile |
| `POST` | `/api/v1/user/avatar` | Upload user avatar |

#### Workspaces
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/workspaces` | List user workspaces |
| `POST` | `/api/v1/workspaces` | Create workspace |
| `GET` | `/api/v1/workspaces/:slug` | Get workspace by slug |
| `PUT` | `/api/v1/workspaces/:id` | Update workspace |
| `DELETE` | `/api/v1/workspaces/:id` | Delete workspace (soft) |
| `GET` | `/api/v1/workspaces/:id/members` | List workspace members |
| `POST` | `/api/v1/workspaces/:id/members` | Add workspace member |
| `DELETE` | `/api/v1/workspaces/:id/members/:memberId` | Remove member |
| `PATCH` | `/api/v1/workspaces/:id/members/:memberId/role` | Update member role |
| `GET` | `/api/v1/workspaces/:id/stats` | Workspace statistics |
| `GET` | `/api/v1/workspaces/:id/storage` | Workspace storage usage |
| `GET` | `/api/v1/workspaces/:id/storage/overview` | Storage overview |
| `GET` | `/api/v1/workspaces/:id/storage/largest-files` | Largest files |
| `GET` | `/api/v1/workspaces/:id/settings` | Get workspace settings |
| `PUT` | `/api/v1/workspaces/:id/settings` | Update workspace settings |
| `GET` | `/api/v1/workspaces/:id/role` | Get user's role in workspace |
| `GET` | `/api/v1/workspaces/:id/activity` | Workspace activity feed |
| `POST` | `/api/v1/workspaces/:id/upgrade` | Upgrade workspace plan |
| `POST` | `/api/v1/invitations/:id/accept` | Accept workspace invitation |
| `POST` | `/api/v1/invitations/:id/decline` | Decline workspace invitation |

#### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/projects` | List projects (by workspaceId) |
| `POST` | `/api/v1/projects` | Create project |
| `GET` | `/api/v1/projects/:id` | Get project detail |
| `PUT` | `/api/v1/projects/:id` | Update project |
| `DELETE` | `/api/v1/projects/:id` | Delete project |
| `PATCH` | `/api/v1/projects/:id/archive` | Archive/unarchive project |
| `GET` | `/api/v1/projects/:projectId/sections` | List workflow sections |
| `POST` | `/api/v1/projects/:projectId/sections` | Create workflow section |
| `PUT` | `/api/v1/projects/:projectId/sections/reorder` | Reorder workflow sections |
| `PATCH` | `/api/v1/projects/:projectId/sections/:sectionId` | Update section (rename/WIP/status) |
| `DELETE` | `/api/v1/projects/:projectId/sections/:sectionId` | Delete section |
| `GET` | `/api/v1/projects/:id/analytics` | Project analytics |

#### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/templates/catalog` | Public tier-gated catalog |
| `GET` | `/api/v1/templates/:slug` | Public template detail |
| `POST` | `/api/v1/templates` | Template waitlist signup (public) |
| `POST` | `/api/v1/templates/:slug/use` | Import template into a workspace (tier-gated) |
| `POST` | `/api/v1/templates/:slug/rate` | Rate a template (1–5 stars, one per user) |
| `POST` | `/api/v1/templates/save-as-template/:projectId` | Save project as a private template |
| `GET` | `/api/v1/templates/private` | List private workspace templates |
| `PATCH` | `/api/v1/templates/:slug` | Update template (author/admin) |
| `DELETE` | `/api/v1/templates/:slug` | Delete template (author/admin) |

#### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/tasks` | List tasks (paginated, filterable) |
| `POST` | `/api/v1/tasks` | Create task |
| `GET` | `/api/v1/tasks/:id` | Get task detail |
| `PUT` | `/api/v1/tasks/:id` | Update task |
| `DELETE` | `/api/v1/tasks/:id` | Delete task |
| `DELETE` | `/api/v1/tasks/bulk` | Bulk delete tasks |
| `PATCH` | `/api/v1/tasks/:id/status` | Update task status |
| `PATCH` | `/api/v1/tasks/:id/assign` | Assign/unassign task |
| `POST` | `/api/v1/tasks/:id/recurrence` | Upsert task recurrence schedule |
| `DELETE` | `/api/v1/tasks/:id/recurrence` | Remove task recurrence |
| `GET` | `/api/v1/tasks/stats` | Task statistics |
| `GET` | `/api/v1/tasks/daily` | Daily tasks |
| `GET` | `/api/v1/tasks/quota/personal` | Personal task quota |
| `GET` | `/api/v1/tasks/quota/workspace/:workspaceId` | Workspace task quota |
| `GET` | `/api/v1/tasks/:taskId/subtasks` | List subtasks |
| `POST` | `/api/v1/tasks/:taskId/subtasks` | Create subtask |
| `PUT` | `/api/v1/tasks/:taskId/subtasks/:subtaskId` | Update subtask |
| `DELETE` | `/api/v1/tasks/:taskId/subtasks/:subtaskId` | Delete subtask |

#### Automations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/automations` | List automation rules |
| `POST` | `/api/v1/automations` | Create automation rule |
| `GET` | `/api/v1/automations/:id` | Get rule detail |
| `GET` | `/api/v1/automations/:id/runs` | Rule run history |
| `PATCH` | `/api/v1/automations/:id` | Update / toggle rule |
| `DELETE` | `/api/v1/automations/:id` | Delete rule |

#### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/tasks/:taskId/comments` | List comments |
| `POST` | `/api/v1/tasks/:taskId/comments` | Create comment |
| `PUT` | `/api/v1/tasks/:taskId/comments/:commentId` | Update comment |
| `DELETE` | `/api/v1/tasks/:taskId/comments/:commentId` | Delete comment |

#### Labels
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/labels` | List labels |
| `POST` | `/api/v1/labels` | Create label |
| `PUT` | `/api/v1/labels/:id` | Update label |
| `DELETE` | `/api/v1/labels/:id` | Delete label |

#### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/meetings` | List meetings |
| `GET` | `/api/v1/meetings/:id` | Get meeting detail |
| `POST` | `/api/v1/meetings` | Create meeting |
| `PUT` | `/api/v1/meetings/:id` | Update meeting |
| `DELETE` | `/api/v1/meetings/:id` | Delete meeting |

#### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/notifications/stream` | SSE stream (token via query param) |
| `GET` | `/api/v1/notifications` | Paginated list (cursor-based) |
| `GET` | `/api/v1/notifications/unread-count` | Badge count |
| `PATCH` | `/api/v1/notifications/:id/read` | Mark as read |
| `PATCH` | `/api/v1/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/v1/notifications/:id` | Delete notification |
| `DELETE` | `/api/v1/notifications/read/all` | Delete all read |
| `GET` | `/api/v1/notifications/preferences` | Get notification preferences |
| `PUT` | `/api/v1/notifications/preferences` | Update notification preferences |

#### Focus & Energy
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/focus/sessions/start` | Start focus session |
| `POST` | `/api/v1/focus/sessions/stop` | Stop focus session |
| `GET` | `/api/v1/focus/sessions/current` | Get current session |
| `GET` | `/api/v1/energy-level` | Get energy level history |
| `POST` | `/api/v1/energy-level` | Log energy level |

#### Calendar
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/calendar/events` | Calendar events |

#### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/analytics` | Personal analytics |
| `GET` | `/api/v1/analytics/burnout` | Burnout trend data |
| `GET` | `/api/v1/workspace-usage/:workspaceId/usage` | Workspace usage analytics |

#### Files & Storage
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/resources/upload` | Upload file |
| `GET` | `/api/v1/resources` | List resources |
| `DELETE` | `/api/v1/resources/:id` | Delete resource |
| `GET` | `/api/v1/resources/:id/download` | Download resource |
| `GET` | `/api/v1/resources/public/:shareToken` | Public shared resource |

#### Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/billing` | Get billing info |
| `GET` | `/api/v1/billing/invoices` | List invoices |
| `POST` | `/api/v1/billing/confirm` | Confirm billing (after Stripe checkout) |

#### Security
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/security` | Get security settings |
| `POST` | `/api/v1/security/2fa/enable` | Enable 2FA |
| `POST` | `/api/v1/security/2fa/disable` | Disable 2FA |
| `GET` | `/api/v1/security/sessions` | List active sessions |

#### API Tokens
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/api-tokens` | List API tokens |
| `POST` | `/api/v1/api-tokens` | Create API token |
| `DELETE` | `/api/v1/api-tokens/:id` | Revoke API token |

#### Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/user/integrations` | List user integrations |
| `POST` | `/api/v1/user/integrations/auth` | Initiate OAuth flow |
| `DELETE` | `/api/v1/user/integrations/:id` | Disconnect integration |
| `PUT` | `/api/v1/user/integrations/:id/config` | Update integration config |
| `POST` | `/api/v1/user/integrations/:id/sync` | Sync integration |

#### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/stats` | Platform statistics |
| `GET` | `/api/v1/admin/users` | List all users |
| `GET` | `/api/v1/contact-messages` | List contact messages |
| `POST` | `/api/v1/contact-messages` | Submit contact message |

#### Misc
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/search` | Global search |
| `GET` | `/api/v1/features` | Feature flags |
| `GET` | `/api/v1/announcements` | List announcements |
| `POST` | `/api/v1/announcements/:id/dismiss` | Dismiss announcement |
| `GET` | `/api/v1/help-topics` | Help topics |
| `GET` | `/api/v1/jobs/:jobId` | Poll background job status |
| `GET` | `/api/v1/csrf-token` | Get CSRF token |

For complete API documentation, see the [API Documentation](https://focura-client.vercel.app/api-docs) page or backend [README](https://github.com/gaziraihan1/focura-backend).

---

## 🪝 Hooks

### **Query Key Factories (7 files)**
- `taskKeys` — Task, comment, attachment, and overview cache keys
- `workspaceKeys` — Workspace detail, members, stats, storage cache keys
- `projectKeys` — Project list and detail cache keys
- `notificationKeys` — Notification list and unread count cache keys
- `templateKeys` — Template catalog, detail, and workspace-private cache keys
- `automationKeys` — Automation-rule cache keys
- `projectFeatureKeys` — Project feature-flag cache keys

### **Auth & User Hooks (6)**
| Hook | Purpose |
|------|---------|
| `useUser` | Get current authenticated user |
| `useAuthForm` | Handle login/register form state and submission |
| `useForgetPasswordPage` | Forgot password email submission |
| `useResetPasswordPage` | Password reset with token |
| `useVerifyEmail` | Email verification flow |
| `useUserProfile` | Profile fetch, update, avatar upload |

### **Task Hooks (14)**
| Hook | Purpose |
|------|---------|
| `useTaskQueries` | Task list, detail, stats queries |
| `useTaskMutations` | Create, update, delete, bulk delete, status change, assign |
| `useTaskDetailsController` | Orchestrate task detail page |
| `useTaskPermissions` | Derive user permissions for a task |
| `useTaskDueDate` | Calculate task due-date status |
| `useCreateTaskForm` | Create task form state |
| `useCreateTaskModal` | Create task modal state |
| `useAddTaskPage` | Orchestrate add task page |
| `useTaskQuotas` | Personal and workspace task quotas |
| `useSubtasks` | Subtask CRUD operations |
| `useDailyTasks` | Daily task planning |
| `useKanbanPage` | Orchestrate Kanban board |
| `useTask` | Single-task queries and orchestration |
| `useTasksPage` | Orchestrate cross-workspace tasks list |

### **Workspace Hooks (14)**
| Hook | Purpose |
|------|---------|
| `useWorkspaceQueries` | Workspace list, detail, members, stats, storage queries |
| `useWorkspaceMutations` | Create, update, delete, add/remove member, update role |
| `useWorkspaceRole` | Fetch current user's role |
| `useWorkspaceSettings` | Workspace settings management |
| `useWorkspaceLayout` | Orchestrate workspace layout |
| `useWorkspaceUsage` | Workspace usage analytics + CSV export |
| `useWorkspaceUpgrade` | Plan upgrade flow |
| `useCreateWorkspacePage` | Orchestrate workspace creation |
| `useWorkspacePage` | Orchestrate workspace dashboard |
| `useWorkspaceNewTaskPage` | Orchestrate workspace task creation |
| `useWorkspaceTasksPage` | Orchestrate workspace tasks list |
| `useWorkspaceKanbanPage` | Orchestrate workspace Kanban board |
| `useWorkspace` | Current workspace detail + plan |
| `useWorkspaceSections` | Workspace section / workflow data |

### **Project Hooks (8)**
| Hook | Purpose |
|------|---------|
| `useProjectQueries` | Project list and detail queries |
| `useProjectMutations` | Create, update, delete, archive |
| `useProjectsPage` | Orchestrate projects list page |
| `useProjectAnalyticsPage` | Orchestrate project analytics page |
| `useProjectAnalytics` | Project analytics queries |
| `useProjectFeatures` | Project feature flags (sections, reorder) |
| `useProjectRole` | Current user's role in a project |
| `useProjects` | Cross-workspace projects queries |

### **Notification Hooks (7)**
| Hook | Purpose |
|------|---------|
| `useNotificationQueries` | Notification list and unread count queries |
| `useNotificationMutations` | Mark read, mark all read, delete |
| `useNotificationBell` | Orchestrate notification bell |
| `useNotificationSSE` | Establish SSE connection |
| `useNotificationPreferences` | Fetch and update preferences |
| `useNotificationsPage` | Orchestrate notifications page |
| `useNotifications` | Real-time notifications + unread state |

### **Other Domain Hooks**
| Category | Hooks |
|----------|-------|
| **Kanban** | `useKanbanBoard` (status-based columns), `useKanbanCard`, `useKanbanInsightFooter` |
| **Templates** | `useTemplateCatalog`, `useTemplateDetail`, `useTemplateImport`, `useTemplateRate`, `useSaveAsTemplate`, `useWorkspacePrivateTemplates` |
| **Automations** | `useAutomations`, `useAutomationRuns`, `useCreateAutomation`, `useUpdateAutomation`, `useDeleteAutomation` |
| **Activity** | `useActivityFeed`, `useWorkspaceActivity`, `useUserActivity`, `useActivityPage` |
| **Analytics** | `useAnalytics`, `useProjectAnalytics`, `useBurnoutTrends`, `useAnalyticsPage` |
| **Calendar** | `useCalendarEvents`, `useCalenderDayView`, `useCalendarPage` |
| **Comments** | `useComments`, `useCreateComment`, `useUpdateComment`, `useDeleteComment`, `useCommentPage` |
| **Meetings** | `useMeetings`, `useMeetingDetail`, `useCreateMeeting`, `useUpdateMeeting`, `useDeleteMeeting`, `useMeetingForm`, `useMeetingPage` |
| **Labels** | `useLabels`, `useCreateLabel`, `useUpdateLabel`, `useDeleteLabel`, `useLabelPage` |
| **Storage** | `useStorageOverview`, `useLargestFileTable`, `useStoragePage`, `useFileManagemetPage` |
| **Resources** | `useResources`, `useUploadResource`, `useDeleteResource`, `useDownloadResource`, `usePublicResource` |
| **Team** | `useTeamMembers`, `useTeamPage`, `useTeamTasksPage` |
| **Invitation** | `useInvitationPage` |
| **Focus/Energy** | `useFocusSession`, `useStartFocusSession`, `useStopFocusSession`, `useEnergyLevel`, `useLogEnergyLevel` |
| **Billing** | `useBilling`, `useInvoices`, `useBillingSuccess` |
| **Security** | `useSecurity`, `useEnable2FA`, `useDisable2FA`, `useActiveSessions` |
| **API Tokens** | `useApiTokens`, `useCreateApiToken`, `useRevokeApiToken` |
| **Settings** | `useUserSettings`, `useUpdateUserSettings` |
| **Admin** | `useAdminStats`, `useAdminUsers` |
| **Contact** | `useContactMessage`, `useSubmitContactMessage` |
| **Help** | `useHelpTopics` |
| **Search** | `useGlobalSearch` |
| **Features** | `useFeatures`, `useAnnouncements`, `useDismissAnnouncement`, `useAnnouncementPage` |
| **Jobs** | `useJobStatus` |
| **Integrations** | `useIntegrations`, `useIntegration`, `useIsConnected`, `useConnectIntegration`, `useDisconnectIntegration`, `useUpdateIntegrationConfig`, `useSyncIntegration`, `useIntegrationStats` |
| **PWA** | `useServiceWorker`, `useOfflineStatus` |
| **UI Helpers** | `useFocusTrap`, `usePagination`, `useUrlState`, `useTheme` |

---

## 🧪 Testing

### **Setup**

- **Framework**: Vitest 4.x with jsdom environment
- **Component Testing**: @testing-library/react 16.x + @testing-library/user-event
- **Mocking**: MSW (Mock Service Worker) 2.x for API mocking
- **Coverage**: @vitest/coverage-v8 with 70% line threshold
- **Globals**: Enabled (no need to import `describe`, `it`, `expect`)

### **Commands**

```bash
# Run tests
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

### **Coverage Configuration**

- **Providers**: `utils/`, `lib/`, `components/`
- **Excluded**: Static data files, auth config, Prisma client, API client, hooks
- **Reporters**: text + lcov
- **Threshold**: 70% line coverage

---

## 💻 Development

### **Development Commands**

```bash
# Start development server
npm run dev

# Build for production (includes Prisma generate)
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Run tests
npm run test

# Clean build artifacts
npm run clean
```

### **Code Style**

- **Linter**: ESLint (Next.js core-web-vitals + TypeScript presets)
- **Formatter**: Prettier (configured in Next.js)
- **Language**: TypeScript (strict mode)
- **No explicit `any`**: Warning enabled for `@typescript-eslint/no-explicit-any`

### **Best Practices**

1. **Server Components by Default**
   - Use server components for data fetching
   - Minimize client-side JavaScript

2. **Use Custom Hooks**
   - 116 hooks for data fetching, state management, and page orchestration
   - Reuse across components
   - Easier testing

3. **Type Safety**
   - 33 type definition files covering the entire domain
   - Use Zod for runtime validation
   - No `any` types (lint warning)

4. **Error Handling**
   - Error boundaries at every route level (root, public, dashboard, admin, auth, workspace)
   - Loading states (skeletons) for every major page
   - Custom error fallback components

5. **Performance**
   - React Query for caching and deduplication
   - Lazy-loaded route components
   - Optimized images with next/image
   - DB read replica for heavy read operations

6. **Accessibility**
   - Screen reader announcements via live regions
   - Focus trapping in modals/dialogs
   - Skip-to-content link
   - Semantic HTML structure

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
EMAIL_SERVER_PASSWORD=<your-app-password>
EMAIL_FROM="Focura <email>"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch** — `git checkout -b feature/amazing-feature`
3. **Make your changes** — follow TypeScript and Tailwind conventions
4. **Run tests** — `npm run test:run`
5. **Run linter** — `npm run lint`
6. **Push to your fork** — `git push origin feature/amazing-feature`
7. **Open a Pull Request**

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## 🔒 Security

- ✅ HTTPS only communication
- ✅ RS256 JWT authentication
- ✅ HTTP-only secure cookies
- ✅ CORS enforcement
- ✅ Rate limiting on auth endpoints (5/min per IP)
- ✅ CSRF protection on mutating requests
- ✅ Audit logging of security events
- ✅ Timing-safe comparisons
- ✅ Argon2 password hashing
- ✅ Role-based access control
- ✅ Workspace-scoped data isolation
- ✅ Input sanitization (XSS and open redirect prevention)
- ✅ Terminal auth code detection (force logout on suspicious activity)
- ✅ Two-factor authentication (2FA)
- ✅ Active session management
- ✅ Multi-tab session coordination

For more details, see [AUTHENTICATION.md](./AUTHENTICATION.md)

---

## 📚 Documentation

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - System architecture and design decisions
- [**AUTHENTICATION.md**](./AUTHENTICATION.md) - Complete authentication and security documentation
- [**CONTRIBUTING.md**](./CONTRIBUTING.md) - How to contribute
- [**CODE_OF_CONDUCT.md**](./CODE_OF_CONDUCT.md) - Code of conduct
- [**AI_IMPLEMENTATION_GUIDE.md**](./AI_IMPLEMENTATION_GUIDE.md) - AI implementation guide
- [**FRONTEND_ANALYSIS.md**](./FRONTEND_ANALYSIS.md) - Frontend analysis
- [**FRONTEND_AUTH_GUIDE.md**](./FRONTEND_AUTH_GUIDE.md) - Frontend auth guide
- [**INTEGRATIONS_CONNECTOR.md**](./INTEGRATIONS_CONNECTOR.md) - Integration connector docs
- [**Backend README**](https://github.com/gaziraihan1/focura-backend) - Backend API documentation
- [**API Documentation**](https://focura-client.vercel.app/api-docs) - Interactive API docs (in-app)

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
