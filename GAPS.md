# 🕳️ Focura — Focus & Burnout Feature Gap Analysis

> **Generated:** July 30, 2026  
> **Scope:** Frontend (`Focura-client/focura`) & Backend (`Focura-backend`)  
> **Focus areas:** Focus Sessions, Burnout Detection, Capacity Management, Energy Levels, AI Features, Daily Tasks

---

## Table of Contents

1. [Test Coverage Gaps](#1-test-coverage-gaps)
2. [AI Features Not Implemented](#2-ai-features-not-implemented)
3. [Error Handling Gaps](#3-error-handling-gaps)
4. [Type Safety & Casting Issues](#4-type-safety--casting-issues)
5. [Missing UI Components](#5-missing-ui-components)
6. [Backend Gaps](#6-backend-gaps)
7. [Integration / Cross-Reference Mismatches](#7-integration--cross-reference-mismatches)
8. [Documentation Gaps](#8-documentation-gaps)
9. [Performance & Caching Gaps](#9-performance--caching-gaps)
10. [Priority Action Items](#10-priority-action-items)

---

## 1. Test Coverage Gaps

### 1.1 Frontend — Missing Component Tests

| Component | File Path | Status | Notes |
|-----------|-----------|--------|-------|
| `FocusModeBanner` | `components/Dashboard/AllTasks/FocusModeBanner.tsx` | ❌ No test | Animated banner with timer + task navigation |
| `FocusSessionCard` | `components/Dashboard/TaskDetails/FocusSessionCard.tsx` | ⚠️ Minimal test | Only renders heading/buttons — doesn't test timer, auto-complete, progress bar |
| `EnergySelector` | `components/Dashboard/WorkspaceNewTask/EnergySelector.tsx` | ✅ Has test | But bundled in a massive combined test file |
| `CapacityScheduleForm` | `components/Settings/CapacityScheduleForm.tsx` | ✅ Has test | `/tests/components/Settings/CapacityScheduleForm.test.tsx` exists |
| `WeeklyComparison` | `components/Dashboard/Calendar/WeeklyComparison.tsx` | ⚠️ Uncommitted | Test file is untracked — not yet committed to git |
| `ExportButton` | `components/Dashboard/Calendar/ExportButton.tsx` | ⚠️ Uncommitted | Test file is untracked — not yet committed to git |
| `WellnessRecommendations` | `components/Dashboard/WellnessRecommendations.tsx` | ❌ No dedicated test | Only tested indirectly |
| `CalendarInsightsBar` | `components/Dashboard/Calendar/CalendarInsightsBar.tsx` | ✅ Has test | - |

### 1.2 Frontend — Missing Hook Tests

| Hook | File Path | Status | Notes |
|------|-----------|--------|-------|
| `useBurnoutTrends` | `hooks/useBurnoutTrends.ts` | ✅ Has test | - |
| `useFocusSession` | `hooks/useFocusSession.ts` | ✅ Has test | Good coverage of mutations + rollback |
| `useEnergyLevel` | `hooks/useEnergyLevel.ts` | ✅ Has test | - |
| `useUserCapacity` | `hooks/useUserSettings.ts` | ❌ No dedicated test | Part of useUserSettings |
| `useUserSchedule` | `hooks/useUserSettings.ts` | ❌ No dedicated test | Part of useUserSettings |
| `useFocusSessionStats` | `hooks/useFocusSession.ts` | ✅ Has test | - |
| `useDailyTasks` | `hooks/useDailyTasks.ts` | ✅ Has test | - |
| `useRecommendations` | `hooks/useBurnoutTrends.ts` | ✅ Has test | - |

### 1.3 Backend — Missing Tests

| Module | Test Files Found | Status |
|--------|-----------------|--------|
| `focusSession` controller / mutation / query | None | ❌ No backend tests |
| `calendar` controller / aggregation / insights | None | ❌ No backend tests |
| `calendar` wellness cron / service | None | ❌ No backend tests |
| `dailyTask` module | None | ❌ No backend tests |

**Impact:** Core business logic for burnout detection, capacity calculation, energy logging, and focus session management is untested on the backend side.

---

## 2. AI Features Not Implemented

The [`AI_IMPLEMENTATION_GUIDE.md`](./AI_IMPLEMENTATION_GUIDE.md) describes **7 AI features** that remain **entirely unimplemented** across both frontend and backend:

| # | Feature | Frontend | Backend | Priority |
|---|---------|----------|---------|----------|
| 1 | **Smart Task Suggestions** — AI suggests priority, intent, energy while typing title | ❌ Missing | ❌ Missing | High |
| 2 | **AI Task Breakdown** — Generate subtasks from task title+description | ❌ Missing | ❌ Missing | Medium |
| 3 | **Daily AI Recommendations** — Morning suggestions based on energy, workload, deadlines | ❌ Missing | ❌ Missing | High |
| 4 | **Natural Language Search** — Search tasks with plain English queries | ❌ Missing | ❌ Missing | Low |
| 5 | **Task Description Generation** — Auto-generate structured descriptions with acceptance criteria | ❌ Missing | ❌ Missing | Medium |
| 6 | **AI Workload Analysis** — Burnout prediction with AI-powered pattern analysis | ❌ Missing | ❌ Missing | High |
| 7 | **Project Health Scoring** — AI-driven health score (0–100) for projects | ❌ Missing | ❌ Missing | Low |

### Required Infrastructure (all missing)

| Component | Purpose | Status |
|-----------|---------|--------|
| `lib/ai/openai.ts` | OpenAI client setup | ❌ Missing |
| `lib/ai/prompts.ts` | Centralized prompt templates | ❌ Missing |
| `lib/ai/context-builder.ts` | Fetch user/project/task context for prompts | ❌ Missing |
| `app/api/ai/*` routes | 7 API routes | ❌ Missing |
| `hooks/useAi*` hooks | 7 hook files | ❌ Missing |
| `components/AI/*` components | 7 component files | ❌ Missing |
| `OPENAI_API_KEY` env var | Required for all AI features | ❌ Not configured |

---

## 3. Error Handling Gaps

### 3.1 Silent Catch Blocks

Several hooks silently swallow errors with no user feedback:

| File | Line(s) | Code | Issue |
|------|---------|------|-------|
| `hooks/useBurnoutTrends.ts` | 21 | `catch { // silent }` | Fetch errors are invisible to the user |
| `hooks/useEnergyLevel.ts` | 24 | `catch { // silent }` | Fetch errors are invisible |
| `hooks/useEnergyLevel.ts` | 64 | `catch { // silent }` | History fetch errors invisible |
| `hooks/useFocusSession.ts` | 168 | `onError: () => { ... }` | Only invalidates query — no user-facing message |

### 3.2 Missing Error States in Components

| Component | Error State | Issue |
|-----------|-------------|-------|
| `BurnoutTrendsChart.tsx` | ❌ Missing | Returns `null` on error — no retry or error message |
| `CapacityChart.tsx` | ❌ Missing | Returns `null` if data is empty — no fallback |
| `DailyCapacityView.tsx` | ❌ Missing | Returns `null` if data is empty — no fallback |

### 3.3 Inconsistent Error Exposure

| Hook | Exposes `error` state? | Pattern |
|------|----------------------|---------|
| `useUserCapacity` | ✅ Yes | String `error` state |
| `useUserSchedule` | ✅ Yes | String `error` state |
| `useBurnoutTrends` | ❌ No | Silent, no error returned |
| `useEnergyLevel` | ❌ No | Silent, no error returned |
| `useEnergyHistory` | ❌ No | Silent, no error returned |
| `useFocusSession` | ✅ Yes | React Query error handling |

---

## 4. Type Safety & Casting Issues

| File | Line | Code | Issue |
|------|------|------|-------|
| `hooks/useEnergyLevel.ts` | 41 | `setData(result.data as any)` | Bypasses TypeScript safety — should cast to `EnergyLevel` |
| `hooks/useEnergyLevel.ts` | 62 | `const result: any = await api.get<EnergyLevel[]>(...)` | `any` type bypasses generic type check |
| `hooks/useEnergyLevel.ts` | 65 | `setData(result.data ?? [])` | Should properly type the API response |
| `hooks/useFocusSession.ts` | 168 | `onError: () => { qc.invalidateQueries(...) }` | Error parameter unused |

---

## 5. Missing UI Components

| Feature | What's Missing | Priority |
|---------|---------------|----------|
| **Energy Logging** | No UI to log today's energy from the dashboard or calendar view. Only available during task creation via `EnergySelector`. | 🔴 High |
| **Wellness Recommendations Display** | Backend generates recommendations via cron, but the `WellnessRecommendations` component usage is unclear — needs audit of where/how they're displayed on dashboard | 🟡 Medium |
| **Daily Energy Trend** | `useEnergyHistory` can fetch historical energy data but no chart/visualization exists to show energy patterns over time | 🟡 Medium |
| **Focus Stats Dashboard** | Backend analytics endpoint ready, but no dashboard widget showing focus stats (streak, weekly focus time, etc.) | 🟡 Medium |
| **Burnout Trends Auto-Expand** | Chart is collapsed by default — users may miss burnout warnings | 🟢 Low |

---

## 6. Backend Gaps

### 6.1 Database / Schema

| Issue | Details | Severity |
|-------|---------|----------|
| `EnergyLevel` model `@@unique([userId, date])` | Ensures one entry per user per day, but `date` uses `DateTime` with time component — may cause uniqueness issues if time offset differs | 🟡 Medium |
| `WellnessRecommendation.expiresAt` | Field exists but is never set by `wellness.service.ts` — recommendations never expire | 🟡 Medium |
| `BurnoutSignal` relation | Has `@@unique([userId, weekStart])` but no `updatedAt` — can't know when the signal was last updated | 🟢 Low |
| `UserWorkSchedule.workDays` | Uses `Json` type — Prisma JSON validation is loose, no schema enforcement for day values | 🟡 Medium |

### 6.2 Missing Backend Endpoints

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `GET /api/v1/calendar/energy` | ✅ Exists | - |
| `GET /api/v1/calendar/energy/history` | ✅ Exists | - |
| `POST /api/v1/calendar/energy` | ✅ Exists | - |
| `GET /api/v1/calendar/burnout-trends` | ✅ Exists | - |
| `GET /api/v1/calendar/recommendations` | ✅ Exists | - |
| `PATCH /api/v1/calendar/recommendations/:id/dismiss` | ✅ Exists | - |
| No endpoint for bulk energy history export | ❌ Missing | User can't export energy data |
| No endpoint for clearing/dismissing all recommendations | ❌ Missing | Only per-item dismiss |
| No endpoint for focus session daily summary | ❌ Missing | Frontend could show "today's focus summary" |

### 6.3 Backend Cron Jobs

| Cron | Status | Interval | Notes |
|------|--------|----------|-------|
| Wellness recommendations | ✅ Implemented | Daily at 6 AM | `wellness.cron.ts` — batch processes verified users |
| Calendar aggregate pre-computation | ❌ Not verified | - | `addPreComputeUserCalendarJob` referenced but actual cron not confirmed |
| Burnout signal generation | ❌ Not verified | - | No explicit cron found for computing BurnoutSignal from CalendarDayAggregate |

### 6.4 Backend Test Coverage

No backend test files exist for: focus session controller/mutation/query/analytics, calendar controller/aggregation/insights/mutation/wellness, dailyTask module, or energy module.

---

## 7. Integration / Cross-Reference Mismatches

### 7.1 API Endpoint Alignment

| Frontend Hook | Expected Backend Endpoint | Backend Route | Match? |
|---------------|--------------------------|---------------|--------|
| `useFocusSession` | `POST /api/v1/focus-sessions/start` | `POST /start` (mounted under focus-sessions) | ✅ |
| `useFocusSession` | `GET /api/v1/focus-sessions/active` | `GET /active` | ✅ |
| `useFocusSession` | `POST /:id/complete` | `POST /:id/complete` | ✅ |
| `useFocusSession` | `POST /:id/cancel` | `POST /:id/cancel` | ✅ |
| `useFocusSessionStats` | `GET /api/v1/focus-sessions/stats` | `GET /stats` | ✅ |
| `useBurnoutTrends` | `GET /api/v1/calendar/burnout-trends?weeks=12` | `GET /burnout-trends` (mounted under calendar) | ✅ |
| `useRecommendations` | `GET /api/v1/calendar/recommendations` | `GET /recommendations` | ✅ |
| `useRecommendations.dismiss` | `PATCH /api/v1/calendar/recommendations/:id/dismiss` | `PATCH /recommendations/:id/dismiss` | ✅ |
| `useEnergyLevel` | `GET /api/v1/calendar/energy?date=` | `GET /energy` | ✅ |
| `useEnergyLevel.logEnergy` | `POST /api/v1/calendar/energy` | `POST /energy` | ✅ |
| `useEnergyHistory` | `GET /api/v1/calendar/energy/history` | `GET /energy/history` | ✅ |
| `useUserCapacity` | `GET /api/v1/calendar/capacity` | `GET /capacity` | ✅ |
| `useUserSchedule` | `GET /api/v1/calendar/schedule` | `GET /schedule` | ✅ |

**All API endpoints are aligned.** ✅

### 7.2 Type Alignment

| Frontend Type | Backend Type | Match? | Notes |
|---------------|-------------|--------|-------|
| `CalendarInsights` | `CalendarInsights` | ✅ | Identical structure |
| `BurnoutTrend` | `BurnoutTrend` | ✅ | Identical structure |
| `UserCapacity` | `UserCapacityData` | ✅ | Same fields |
| `UserWorkSchedule` | `UserWorkScheduleData` | ✅ | Same fields |
| `EnergyLevel` | `EnergyLevel` (Prisma) | ✅ | Same fields |
| `WellnessRecommendation` | `WellnessRecommendation` (Prisma) | ✅ | Same fields |

**All types are aligned.** ✅

---

## 8. Documentation Gaps

| Document | Gaps | Severity |
|----------|------|----------|
| `AI_IMPLEMENTATION_GUIDE.md` | Excellent detail but all features are future — no timeline mentioned | 🟢 Low |
| `ARCHITECTURE.md` | Covers FocusSession and CalendarDayAggregate at high level but doesn't detail wellness/burnout system architecture | 🟢 Low |
| `README.md` | No mention of focus/burnout/capacity features | 🟡 Medium |
| Backend docs | No README sections on the wellness system, energy tracking, or burnout signals | 🟡 Medium |

---

## 9. Performance & Caching Gaps

| Area | Status | Details |
|------|--------|---------|
| Focus session active session cache | ✅ Implemented | Redis caching with TTL |
| Focus session stats cache | ✅ Implemented | Redis with TTL |
| Focus session streak cache | ✅ Implemented | Redis with TTL |
| Calendar aggregates cache | ✅ Implemented | Redis with stale-while-revalidate pattern |
| Calendar insights cache | ✅ Implemented | Redis |
| Energy level cache | ❌ Not found | No caching evident for energy level queries |
| Burnout trends cache | ❌ Not found | No caching on `GET /burnout-trends` |
| Frontend stale time | ✅ Set to 5 min for calendars | React Query stale time configured |
| Frontend polling | ✅ 30s for active session | Keeps focus session state in sync |

---

## 10. Priority Action Items

### 🔴 Critical

| # | Item | Area | Effort |
|---|------|------|--------|
| 1 | Add backend tests for focusSession and calendar modules | Backend | 2-3 days |
| 2 | Fix silent error handling in `useBurnoutTrends`, `useEnergyLevel`, `useEnergyHistory` | Frontend | 0.5 day |
| 3 | Fix `as any` type casts in `useEnergyLevel.ts` | Frontend | < 1 hour |
| 4 | Add UI for logging daily energy from dashboard/calendar | Frontend | 1 day |

### 🟡 Medium

| # | Item | Area | Effort |
|---|------|------|--------|
| 5 | Add error/empty state UIs for BurnoutTrendsChart, CapacityChart, DailyCapacityView | Frontend | 0.5 day |
| 6 | Add focus stats dashboard widget (streak, weekly minutes, by type) | Frontend | 1 day |
| 7 | Add energy trend chart using `useEnergyHistory` data | Frontend | 1 day |
| 8 | Add caching for energy level and burnout trends endpoints | Backend | 0.5 day |
| 9 | Add `expiresAt` logic for WellnessRecommendations | Backend | 0.5 day |

### 🟢 Low (Enhancements)

| # | Item | Area | Effort |
|---|------|------|--------|
| 10 | Add frontend tests for FocusModeBanner, WellnessRecommendations | Frontend | 1 day |
| 11 | Add backend test for wellness cron and service | Backend | 1 day |
| 12 | Add bulk dismiss endpoint for recommendations | Backend | 0.5 day |
| 13 | Implement AI features from AI_IMPLEMENTATION_GUIDE.md | Both | 2-3 weeks |
| 14 | Document focus/burnout features in README.md | Docs | 0.5 day |

---

## Summary Statistics

| Category | Count |
|----------|-------|
| 🔴 Critical issues | 4 |
| 🟡 Medium issues | 5 |
| 🟢 Low issues | 5 |
| ✅ Working endpoints (aligned FE/BE) | 12/12 |
| ✅ Working types (aligned FE/BE) | 6/6 |
| ❌ AI features not implemented | 7/7 |
| ❌ Backend tests missing | 4 modules |
| ⚠️ Frontend tests missing | 5+ components |
