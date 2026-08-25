# 🤝 Contributing to Focura Client

Thank you for your interest in contributing to **Focura Client** — the Next.js frontend of Focura, a focused, workspace-based productivity SaaS.

This guide reflects how the repository actually works today (stack, scripts, structure, test conventions, and review process). Please read it fully before opening a pull request.

---

## 📌 Before You Contribute

Please make sure you have read:

- [`README.md`](./README.md) — features, setup, and environment variables
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system architecture, data flow, and design patterns
- [`AUTHENTICATION.md`](./AUTHENTICATION.md) — auth flows (NextAuth + backend JWT exchange)
- [`AI_IMPLEMENTATION_GUIDE.md`](./AI_IMPLEMENTATION_GUIDE.md) — if you touch AI-adjacent features
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) — our community standards

---

## 🧭 What You Can Contribute

### ✅ Code Contributions
- Bug fixes
- Performance improvements
- UI/UX refinements
- Accessibility improvements
- Refactoring (without changing behavior)
- New features aligned with Focura's vision

### 📝 Documentation
- Improve existing documentation
- Fix typos or unclear explanations
- Add usage examples

### 🧪 Testing
- Add or improve component/hook tests
- Extend MSW handlers and fixtures

### 🚫 Please Avoid
- Large architectural changes without prior discussion (open an issue first)
- Breaking existing API contracts with the backend
- Adding heavy dependencies without justification
- Features unrelated to productivity, focus, or workspace collaboration

---

## 🛠 Tech Stack (what you'll be working with)

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Language | TypeScript (strict) |
| Server state | TanStack Query 5 |
| Forms/validation | React Hook Form + Zod |
| Charts | Recharts |
| Icons/animations | lucide-react + Framer Motion |
| Dates | date-fns + dayjs |
| Notifications | react-hot-toast |
| Tests | Vitest 4 + jsdom + @testing-library/react 16 + MSW 2 |
| API | Axios (interceptor-based, `lib/axios.ts`) |

---

## 🚀 Development Setup

> **Prerequisites:** Node.js 20.9+ (LTS recommended — required by Next.js 16), npm, and the **backend running locally on `http://localhost:5000`** (the client proxies all API calls to it).

1. **Fork** the repository and clone your fork:
```bash
git clone https://github.com/gaziraihan1/focura-client.git
cd focura-client
```

2. **Install dependencies** (this also runs `prisma generate` via `postinstall`):
```bash
npm install
```

3. **Create environment variables** (Next.js loads these from `.env.local`):
```bash
cp .env.example .env.local
```
Then fill in at minimum:
```env
NEXTAUTH_SECRET=<any-random-string>
NEXTAUTH_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Optional keys (OAuth, Cloudinary, Redis, email) are documented in `.env.example` / `README.md` — you only need them when working on those features.

4. **Run the dev server:**
```bash
npm run dev
```
Open **http://localhost:3000**.

### Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the dev server (port 3000) |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run lint` | Run ESLint on the whole project |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Run tests with v8 coverage (70% line threshold) |
| `npm run clean` | Remove `.next`, `node_modules`, build artifacts |

---

## 🌱 Branching Strategy

- `main` → stable, production-ready (deploys to Vercel)
- `dev` → active development branch
- Feature branches:

```
feature/your-feature-name
fix/bug-description
refactor/area-name
test/area-name
docs/topic
```

**Always branch from `dev`** and open pull requests **against `dev`**. If you can't see `dev` in your fork, fetch it (`git fetch origin dev`) or ask the maintainer which branch to target. Keep branches short-lived and focused on a single concern.

---

## ✅ Commit Guidelines

Use conventional commit messages:

```
feat: add energy trend chart to wellness page
fix: resolve focus session timer drift
refactor: extract query-key factory for tasks
test: cover CapacityChart error state
docs: update wellness architecture section
chore: bump lucide-react
```

---

## 📁 Project Structure (quick map)

```
app/                  # Next.js App Router — pages & layouts
  (dashboard-pages)/  # protected dashboard routes (dashboard/*)
  (public-pages)/     # marketing pages
  api/                # NextAuth + auth route handlers
components/           # React components (grouped by feature area)
  dashboard/          # main dashboard components (calendar/, task-details/, ...)
  settings/           # settings forms
  shared/             # reusable UI primitives (Avatar, Modal, Pagination, ...)
hooks/                # ~107 custom hooks + *Keys.ts query-key factories
lib/                  # axios client, auth options, prisma, utils
types/                # TypeScript domain types (calendar.types.ts, etc.)
utils/                # pure helpers
constants/            # static config/data
tests/                # test suites (see below)
prisma/               # schema mirror + migrations (dev mirror)
```

### Conventions to follow

- **Server components by default**; add `"use client"` only when interactivity is needed.
- **Data fetching lives in hooks**, not components. Reuse existing hooks (e.g. `useTask`, `useWorkspace`, `useEnergyLevel`) instead of re-implementing.
- **Query keys go through `*Keys.ts` factories** (e.g. `taskKeys`, `workspaceKeys`) so cache invalidation stays consistent.
- **Styling:** Tailwind tokens only (`bg-card`, `text-muted-foreground`, `border-border`, …). Use the `cn()` helper from `lib/utils.ts` for conditional classes.
- **Icons:** lucide-react. **Charts:** Recharts. Don't introduce a second icon/chart library.
- **No `any`** — use proper generics. `@typescript-eslint/no-explicit-any` is a warning.
- **Accessibility:** every interactive element needs a label/`aria-*`, modals must trap focus (`useFocusTrap`), and status changes should use screen-reader announcements (`lib/a11y.ts`).

---

## 🧪 Testing Your Changes

Tests use **Vitest + jsdom**, and the global `tests/setup.ts` already:

- Mocks `@/lib/axios` (routes through MSW), `next-auth/react`, `next/navigation`, and `react-hot-toast`
- Boots the **MSW server** from `tests/mock/` (`server.listen/resetHandlers/close`)
- Sets `NEXT_PUBLIC_API_URL=http://localhost:5000`

### Where to put tests

| Test type | Location | How it works |
|-----------|----------|--------------|
| Hook tests | `tests/hooks/*.test.ts` | `renderHook` with mocked deps, assert state + side effects |
| Component tests | `tests/components/**/*.test.tsx` | `render` + `screen` queries; mock hooks with `vi.mock` |
| Integration | `tests/integration/` | Full page/flow tests with providers |
| API mock handlers | `tests/mock/handlers/*.handlers.ts` | Register endpoints the components call |

### Writing a test — the patterns used

**Components:** mock the hooks they consume, not the network:
```tsx
vi.mock('@/hooks/useEnergyLevel', () => ({
  useEnergyHistory: () => ({ data: [], loading: false, error: null, refetch: vi.fn() }),
}));
```

**Hooks / data fetching:** rely on the MSW handlers + `api` mock, or mock `@/lib/axios` in-file for failure cases:
```tsx
server.use(http.get(`${BASE}/api/v1/...`, () => HttpResponse.json({ success: true, data: [...] })));
```

**Providers:** use `renderWithProviders` from `tests/utils/renderWithProviders.tsx` when a component needs a QueryClient.

**Run the targeted suite while developing:**
```bash
npx vitest run tests/hooks/useEnergyLevel.test.ts tests/components/Dashboard/Calendar/calendar/EnergyTrendChart.test.tsx
```

**Before submitting:**
- [ ] `npm run lint` passes (no new errors)
- [ ] `npm run test:run` — your new tests pass and you haven't broken existing ones
- [ ] `npx tsc --noEmit` — no new type errors in your files
- [ ] `npm run build` succeeds (catches RSC/import issues lint may miss)

---

## 🔒 Security Rules

- Never commit secrets — `.env.local` and `keys/` are gitignored
- Don't log tokens, passwords, or PII
- Respect workspace and user isolation when fetching data
- Use the existing auth patterns (`useUser`, session checks, `authenticate` middleware on the backend side)
- Sanitize user-generated HTML/URLs with the existing utilities

---

## 🔁 Pull Request Process

1. Branch from `dev`: `git checkout -b feature/your-feature-name dev`
2. Make focused commits with conventional messages
3. Push to your fork: `git push origin feature/your-feature-name`
4. Open a **Pull Request against `dev`** and describe:
   - What you changed and why
   - How you tested it (commands run)
   - Screenshots or screen recordings for UI changes
5. Link any related issue

---

## 📋 Pull Request Checklist

- [ ] Code follows project conventions (components/hooks/styling above)
- [ ] No new `any` types, no unused imports/variables
- [ ] New/updated tests included and passing (`npm run test:run`)
- [ ] Lint clean (`npm run lint`)
- [ ] Typecheck clean for changed files (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] No unnecessary dependencies added
- [ ] Documentation updated if the change affects README/ARCHITECTURE
- [ ] Verified the change against a running backend (`localhost:5000`)

---

## 🧠 Project Philosophy

Focura values:

- Focus over feature bloat
- Simplicity over complexity
- Quality over quantity
- Intentional productivity

All contributions should align with this mindset.

---

## 👤 Maintainer

All contributions are reviewed by:

**Mohammad Raihan Gazi** — Creator & Maintainer of Focura

Thank you for contributing 🚀
