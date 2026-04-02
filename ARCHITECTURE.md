# 🏗 Focura – System Architecture

This document describes the high-level architecture, design decisions, and data flow of **Focura**, a workspace-based task and collaboration SaaS platform.

---

## 🎯 Architecture Goals

Focura is designed to be:

- **Scalable** – supports personal and team workflows
- **Secure** – workspace-level data isolation
- **Maintainable** – clean separation of concerns
- **Extensible** – easy to add new features and plans
- **Performance-aware** – optimized queries and caching

---

## 🧱 High-Level Architecture

Focura follows a **modern full-stack architecture**:
Client (Next.js + React) ↓ HTTPS + JWT API Server (Node.js + Express) ↓ Prisma ORM PostgreSQL Database
---

## 🖥 Frontend Architecture

### Technology Stack
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query**
- **NextAuth**

### Frontend Structure
```
src/ 
├─ app/ │   
├─ (auth)/ │   
├─ (dashboard)/ │   
├─ api/ │ 
├─ components/ 
├─ hooks/ 
├─ lib/ 
├─ types/
```

### Principles
- Server Components for data fetching
- Client Components for interactivity
- Hook-based data abstraction
- Centralized API layer
- Workspace-aware routing

---

## 🔐 Authentication & Authorization

### Authentication
- NextAuth handles login
- Backend issues JWT
- JWT stored in session
- Axios interceptor attaches token
- Backend validates token on each request

### Authorization
- Workspace-based access control
- Roles:
  - Owner
  - Admin
  - Member
- Middleware validates:
  - Authentication
  - Workspace membership
  - Permissions

---

## 🧠 Backend Architecture

### Stack
- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL

### Folder Structure
```
src/ 
├─ controllers/ 
├─ services/ 
├─ routes/ 
├─ middleware/ 
├─ prisma/ 
├─ utils/ 
└─ index.ts
```

### Pattern
- Controllers handle HTTP
- Services handle business logic
- Prisma handles DB access
- Clear separation of concerns

---

## 🗃 Database Architecture

### ORM
- Prisma

### Database
- PostgreSQL

### Core Models
- User
- Workspace
- Project
- Task
- Comment
- Notification

### Design Rules
- Strong relational integrity
- Workspace-level isolation
- Indexed foreign keys
- Minimal data duplication

---

## 📊 Task System

### Task Types
- Personal Tasks
- Team Tasks
- Assigned Tasks

### Task Fields
- Title
- Description
- Status
- Priority
- Start Date
- Due Date
- Estimated Time
- Focus Mode
- Task Intent
- Assignees
- Project Reference

---

## ⏱ Time Intelligence

- Overdue detection
- Due today detection
- Attention-required flags
- Status-aware calculations
- Client-side + server-side validation

---

## 📈 Task Statistics

### Flow
```
Client → 
useTaskStats → 
/api/tasks/stats → 
Task Service → 
Prisma Aggregation
```

### Stats
- Assigned
- Overdue
- Due Today
- In Progress

All stats are:
- Workspace-scoped
- User-aware
- Cached with TanStack Query

---

## 🔔 Notification System

### Triggers
- Task assignment
- Status change
- Comment added
- Task updates

### Design
- Event-based creation
- User-scoped delivery
- Read/unread state
- Extensible for email/push

---

## 🔐 Security Architecture

### Transport
- HTTPS
- Encrypted data in transit

### Application
- JWT validation
- Token expiration handling
- Protected routes
- Rate limiting on auth endpoints

### Data Safety
- Workspace-scoped queries
- No cross-workspace leakage
- Server-side permission enforcement

---

## 🧩 API Design

### REST Endpoints
/api/auth 
/api/workspaces 
/api/projects 
/api/tasks 
/api/labels
/api/activity
/api/comments 
/api/notifications

### Principles
- RESTful design
- Predictable responses
- Centralized error handling
- Typed contracts

---

## ⚙️ Performance Strategy

- Optimized Prisma queries
- Pagination for large datasets
- Selective includes
- Cached stats
- Minimal over-fetching

---

## 🔮 Future Architecture

- Background job queues
- Real-time updates (WebSockets)
- File storage service
- Advanced AI-assisted planning workflows
- Deeper observability and operations tooling
- Multi-region deployment

---

## 🧠 Architecture Philosophy

- Clarity over complexity
- Security by default
- Scalability from day one
- Maintainability first

---

## 👤 Maintainer

**Mohammad Raihan Gazi**  
Creator & Maintainer of Focura
