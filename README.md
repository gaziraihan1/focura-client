# Focura

Focura is a modern, workspace-based task and collaboration platform built for individuals and teams who want clarity, structure, and focus in their daily work.

It supports **personal tasks**, **team collaboration**, **multiple task views**, and **scalable architecture**, designed with real-world SaaS growth in mind.

---

## 🚀 Features

### 🏢 Workspace System
- Multiple workspaces per user
- Role-based access (Owner, Admin, Member)
- Workspace-level data isolation

### ✅ Task Management
- Personal and team tasks
- Task assignment
- Status and priority tracking
- Due dates and overdue detection
- Task comments and discussions

### 📊 Task Statistics & Insights
- Total tasks
- Overdue tasks
- Completed tasks
- Assigned vs personal task separation
- Workspace-scoped analytics

### 🗂 Multiple Task Views
- **List View** – clean, filterable task lists
- **Calendar View** – deadline-focused planning
- **Kanban View** – workflow-based task movement

### 🔐 Authentication & Security
- Secure authentication using NextAuth
- JWT-based backend authorization
- Protected API routes
- Role and permission checks

---

## 🧱 Tech Stack

### Frontend
- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **TanStack Query (React Query)**

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**

### Authentication
- **NextAuth**
- **JWT (Backend Token)**

---

## 🏗 Architecture Overview

Focura follows a **clean, scalable architecture**:

- Frontend and backend are decoupled
- API-first design
- Workspace-scoped data queries
- Centralized Axios instance with interceptors
- Prisma for strict data modeling and type safety

```
Frontend (Next.js)
   ↓
Axios Client (JWT + Interceptors)
   ↓
Express API (Auth Middleware)
   ↓
Prisma ORM
   ↓
PostgreSQL
```

---

## 🔐 Security Practices

- HTTPS enforced in production
- Authorization headers injected via Axios interceptors
- Token expiration and invalid token handling
- Workspace-level authorization checks
- Rate limiting on sensitive endpoints (login, registration)

> End-to-end encryption is applied for data in transit (HTTPS) and data at rest via database-level encryption.

---

## 📂 Project Structure (Simplified)

```
src/
 ├── app/                # Next.js App Router
 ├── components/         # UI components
 ├── hooks/              # Custom React hooks
 ├── lib/                # Axios, utilities, constants
 ├── server/             # Backend logic
 ├── prisma/             # Prisma schema
```

---

## ⚙️ Environment Variables

Create a `.env` file and configure:

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=
```

---

## 🛠 Installation & Setup

### 1. Clone the repository
```
git clone https://github.com/your-username/focura.git
cd focura
```

### 2. Install dependencies
```
npm install
```

### 3. Setup Prisma
```
npx prisma generate
npx prisma migrate dev
```

### 4. Run the project
```
npm run dev
```

---

## 🧪 Development Status

- Core task system: ✅ Complete
- Calendar view: ✅ Complete
- Kanban view: ✅ Complete
- Analytics & stats: ✅ Complete
- Notifications: 🚧 In progress
- Billing & plans: 🚧 Planned

---

## 🤝 Contributing

Contributions are welcome.

Please read:
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`

before submitting pull requests.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Mohammad Raihan Gazi**  
Full Stack Developer  
Dhaka, Bangladesh

---

> Focura is built with long-term scalability, clean architecture, and real SaaS principles in mind.
