# 🕳️ Focura — Focus & Burnout Feature Gap Analysis

> **Generated:** July 30, 2026  ·  **Last reviewed / updated:** August 9, 2026
> **Scope:** Frontend (`Focura-client/focura`) & Backend (`Focura-backend`)
> **Focus areas:** Focus Sessions, Burnout Detection, Capacity Management, Energy Levels, AI Features, Daily Tasks

**Status summary (2026-08-09):** All previously-identified gaps remain implemented, tested, and documented. Since the last review, **all five milestones in `FEATURE_PLANS.md` shipped end-to-end** — **Custom Workflows**, **Recurring Tasks**, **Automation Rules**, **Workspace Templates**, and now the **M5 public template gallery** (ratings, featured strip, author credits). The only remaining item is the **AI feature suite**, which is **deferred by decision** (requires an external paid API — OpenAI — and the implementation guide estimates 2–3 weeks of work).

---

## Table of Contents

1. [Test Coverage Gaps](#1-test-coverage-gaps)
2. [AI Features Not Implemented](#2-ai-features-not-implemented--deferred-by-decision)
3. [Error Handling Gaps](#3-error-handling-gaps--resolved)
4. [Type Safety & Casting Issues](#4-type-safety--casting-issues--resolved)
5. [Missing UI Components](#5-missing-ui-components--resolved)
6. [Backend Gaps](#6-backend-gaps)
7. [Integration / Cross-Reference Mismatches](#7-integration--cross-reference-mismatches)
8. [Documentation Gaps](#8-documentation-gaps--resolved)
9. [Performance & Caching Gaps](#9-performance--caching-gaps)
10. [Priority Action Items](#10-priority-action-items)

---

## 1. Test Coverage Gaps

### 1.1 Frontend — Component Tests (status 2026-08-02)

| Component | File Path | Status | Notes |
|-----------|-----------|--------|-------|
| `FocusModeBanner` | `components/Dashboard/AllTasks/FocusModeBanner.tsx` | ✅ Covered | `tests/components/Dashboard/AllTasks/FocusModeBanner.test.tsx` |
| `FocusSessionCard` | `components/Dashboard/TaskDetails/FocusSessionCard.tsx` | ✅ Deep coverage | **2026-08-02:** added timer (countdown), progress bar width, auto-complete on expiry, complete/cancel actions, disabled states, other-task warning (17 tests) |
| `EnergySelector` | `components/Dashboard/WorkspaceNewTask/EnergySelector.tsx` | ✅ Covered | Bundled in a combined test file |
| `CapacityScheduleForm` | `components/Settings/CapacityScheduleForm.tsx` | ✅ Covered | `/tests/components/Settings/CapacityScheduleForm.test.tsx` |
| `WeeklyComparison` | `components/Dashboard/Calendar/WeeklyComparison.tsx` | ✅ Covered | `tests/components/Dashboard/Calendar/WeeklyComparison.test.tsx` (committed) |
| `ExportButton` | `components/Dashboard/Calendar/ExportButton.tsx` | ✅ Covered | `tests/components/Dashboard/Calendar/ExportButton.test.tsx` (committed) |
| `WellnessRecommendations` | `components/Dashboard/WellnessRecommendations.tsx` | ✅ Covered | Dedicated test incl. dismiss-all button |
| `CalendarInsightsBar` | `components/Dashboard/Calendar/CalendarInsightsBar.tsx` | ✅ Covered | - |
| `BurnoutTrendsChart` | `components/Dashboard/Calendar/BurnoutTrendsChart.tsx` | ✅ Covered | **2026-08-02:** new test file — data/loading/error/empty + auto-expand on HIGH/CRITICAL |
| `EnergyTrendChart` | `components/Dashboard/Calendar/EnergyTrendChart.tsx` | ✅ Covered | **2026-08-02:** new component + test (data/loading/error/empty/expand) |
| `CapacityChart` | `components/Dashboard/Calendar/CapacityChart.tsx` | ✅ Covered | Error-state + retry tests added |
| `DailyCapacityView` | `components/Dashboard/Calendar/DailyCapacityView.tsx` | ✅ Covered | Error-state + retry tests added |
| `FocusDailySummary` | `components/Dashboard/FocusDailySummary.tsx` | ✅ Covered | Dedicated test |

### 1.2 Frontend — Hook Tests

| Hook | File Path | Status | Notes |
|------|-----------|--------|-------|
| `useBurnoutTrends` | `hooks/useBurnoutTrends.ts` | ✅ Covered | incl. `dismissAll` |
| `useFocusSession` | `hooks/useFocusSession.ts` | ✅ Covered | incl. `useFocusSessionDailySummary` |
| `useEnergyLevel` | `hooks/useEnergyLevel.ts` | ✅ Covered | incl. `exportEnergyHistory` + CSV download |
| `useUserCapacity` | `hooks/useUserSettings.ts` | ✅ Covered | Part of `useUserSettings.test.ts` |
| `useUserSchedule` | `hooks/useUserSettings.ts` | ✅ Covered | Part of `useUserSettings.test.ts` |
| `useFocusSessionStats` | `hooks/useFocusSession.ts` | ✅ Covered | - |
| `useDailyTasks` | `hooks/useDailyTasks.ts` | ✅ Covered | - |
| `useRecommendations` | `hooks/useBurnoutTrends.ts` | ✅ Covered | - |

### 1.3 Backend — Tests (status 2026-08-02)

| Module | Test Files | Status |
|--------|-----------|--------|
| `focusSession` (analytics, mutation, controller, routes) | `tests/unit/focusSession/*` | ✅ Covered |
| `calendar` (query, aggregation, insights, mutation, controller, routes, service) | `tests/unit/calendar/*` | ✅ Covered |
| `calendar` wellness cron + service | `wellness.cron.test.ts`, `wellness.service.test.ts` | ✅ Covered |
| `burnoutSignal` cron | `burnoutSignal.cron.test.ts` (new, 2026-08-02) | ✅ Covered |
| `dailyTask` module | `tests/unit/dailyTask/*` | ✅ Covered |
| energy export / dismiss-all / daily summary | added to calendar + focusSession test suites | ✅ Covered |

**Full backend suite:** 3,866+ tests passing (incl. 157 calendar/focusSession unit tests).

---

## 2. AI Features Not Implemented — Deferred by Decision

The [`AI_IMPLEMENTATION_GUIDE.md`](./AI_IMPLEMENTATION_GUIDE.md) describes **7 AI features** that remain **entirely unimplemented**. **Decision (2026-08-02):** these are **deferred** — they require an external paid API (OpenAI), and the guide estimates 2–3 weeks of work. No code was started.

| # | Feature | Status | Priority |
|---|---------|--------|----------|
| 1 | **Smart Task Suggestions** — AI suggests priority, intent, energy while typing title | ⏸️ Deferred | High |
| 2 | **AI Task Breakdown** — Generate subtasks from task title+description | ⏸️ Deferred | Medium |
| 3 | **Daily AI Recommendations** — Morning suggestions based on energy, workload, deadlines | ⏸️ Deferred | High |
| 4 | **Natural Language Search** — Search tasks with plain English queries | ⏸️ Deferred | Low |
| 5 | **Task Description Generation** — Auto-generate structured descriptions with acceptance criteria | ⏸️ Deferred | Medium |
| 6 | **AI Workload Analysis** — Burnout prediction with AI-powered pattern analysis | ⏸️ Deferred | High |
| 7 | **Project Health Scoring** — AI-driven health score (0–100) for projects | ⏸️ Deferred | Low |

**Required infrastructure (none created):** `lib/ai/openai.ts`, `lib/ai/prompts.ts`, `lib/ai/context-builder.ts`, `app/api/ai/*` routes, `hooks/useAi*`, `components/AI/*`, `OPENAI_API_KEY`.

> Note: Non-AI burnout/workload analysis is fully implemented (rule-based `BurnoutSignal` computation — see §6.3).

---

## 3. Error Handling Gaps — ✅ Resolved

### 3.1 Silent Catch Blocks — Resolved

| File | Status | Notes |
|------|--------|-------|
| `hooks/useBurnoutTrends.ts` | ✅ | Exposes `error` string state; `dismissAll` returns 0 on failure |
| `hooks/useEnergyLevel.ts` | ✅ | Exposes `error` string state |
| `hooks/useEnergyHistory` | ✅ | Exposes `error` string state |
| `hooks/useFocusSession.ts` | ✅ | React Query `onError` handling |

### 3.2 Missing Error States in Components — Resolved

| Component | Status | Notes |
|-----------|--------|-------|
| `BurnoutTrendsChart.tsx` | ✅ | Error message + Retry button |
| `CapacityChart.tsx` | ✅ | **2026-08-02:** error message + Retry button |
| `DailyCapacityView.tsx` | ✅ | **2026-08-02:** error message + Retry button |
| `EnergyTrendChart.tsx` | ✅ | **2026-08-02:** error message + Retry button (new component) |

### 3.3 Inconsistent Error Exposure — Resolved

All hooks (`useUserCapacity`, `useUserSchedule`, `useBurnoutTrends`, `useEnergyLevel`, `useEnergyHistory`, `useFocusSession`) now expose error state.

---

## 4. Type Safety & Casting Issues — ✅ Resolved

| File | Status | Notes |
|------|--------|-------|
| `hooks/useEnergyLevel.ts` | ✅ | Proper `EnergyLevel` / `EnergyLevel[]` generics; no `any` casts remain |
| `hooks/useFocusSession.ts` | ✅ | Error parameter handled properly |

---

## 5. Missing UI Components — ✅ Resolved

| Feature | Status | Implementation |
|---------|--------|----------------|
| **Energy Logging** | ✅ | `EnergyQuickLog` floating widget on wellness + calendar views (daily check-in via `POST /calendar/energy`) |
| **Wellness Recommendations Display** | ✅ | `WellnessRecommendations` on wellness page + calendar insights; dismiss + dismiss-all |
| **Daily Energy Trend** | ✅ | **2026-08-02:** new `EnergyTrendChart` (last 30 days, hover tooltips, legend) wired into wellness page |
| **Focus Stats Dashboard** | ✅ | `FocusStreakBadge` + `FocusDailySummary` widgets on wellness page |
| **Burnout Trends Auto-Expand** | ✅ | **2026-08-02:** `BurnoutTrendsChart` auto-expands when latest risk is HIGH/CRITICAL; respects manual collapse |

---

## 6. Backend Gaps

### 6.1 Database / Schema — ✅ Resolved / Documented

| Issue | Status | Notes |
|-------|--------|-------|
| `EnergyLevel` `@@unique([userId, date])` date-time offset | ✅ Mitigated | All writes/lookups normalize dates to midnight (UTC) before DB calls (`setHours(0,0,0,0)`) |
| `WellnessRecommendation.expiresAt` never set | ✅ Resolved | `wellness.service.ts` sets `expiresAt` (2–7 days depending on type); expired recs excluded from queries |
| `BurnoutSignal` no `updatedAt` | ✅ Resolved | **2026-08-02:** added `updatedAt @updatedAt`; migration `20260802082211_add_burnout_signal_updated_at` applied (with row backfill); Prisma client regenerated on both FE and BE |
| `UserWorkSchedule.workDays` loose `Json` type | ✅ Documented | Day values are strictly validated at the API boundary (`calendar.validators.ts` — Zod enum MON–SUN); DB-level enforcement would require a migration to `String[]` and is intentionally deferred |

### 6.2 Backend Endpoints — ✅ All Present

| Endpoint | Status |
|----------|--------|
| `GET /api/v1/calendar/energy` | ✅ |
| `GET /api/v1/calendar/energy/history` | ✅ |
| `GET /api/v1/calendar/energy/export` | ✅ Implemented 2026-08-02 |
| `POST /api/v1/calendar/energy` | ✅ |
| `GET /api/v1/calendar/burnout-trends` | ✅ |
| `GET /api/v1/calendar/recommendations` | ✅ |
| `PATCH /api/v1/calendar/recommendations/:id/dismiss` | ✅ |
| `POST /api/v1/calendar/recommendations/dismiss-all` | ✅ Implemented 2026-08-02 |
| `GET /api/v1/focus-sessions/daily-summary` | ✅ Implemented 2026-08-02 |
| All other calendar / focus-session endpoints | ✅ |

**All endpoints aligned FE ↔ BE (15/15).**

### 6.3 Backend Cron Jobs — ✅ Resolved

| Cron | Status | Schedule | Notes |
|------|--------|----------|-------|
| Wellness recommendations | ✅ | Daily 6 AM | `wellness.cron.ts` — batch processes verified users |
| Burnout signal generation | ✅ **2026-08-02** | Weekly Monday 7 AM | New `burnoutSignal.cron.ts` — batch pre-computes `BurnoutSignal` via `CalendarInsightsService.calculateBurnoutRisk` for all verified users (paginated, `Promise.allSettled`) |
| Calendar aggregate pre-computation | ✅ Documented | On-demand | `addPreComputeUserCalendarJob` enqueues aggregate computation via BullMQ `calendar.worker.ts` whenever aggregates are computed — queue-based, no standalone cron required |

### 6.4 Backend Test Coverage — ✅ Resolved

Backend tests now exist for focus session controller/mutation/query/analytics, calendar controller/aggregation/insights/mutation/wellness, the wellness cron, the new burnout signal cron, dailyTask, and energy modules. **3,866+ tests passing.**

---

## 7. Integration / Cross-Reference Mismatches

### 7.1 API Endpoint Alignment — ✅ All aligned

| Frontend Hook | Backend Endpoint | Match |
|---------------|------------------|-------|
| `useFocusSession` (start/active/complete/cancel) | `/focus-sessions/*` | ✅ |
| `useFocusSessionStats` | `GET /focus-sessions/stats` | ✅ |
| `useFocusSessionDailySummary` | `GET /focus-sessions/daily-summary` | ✅ |
| `useBurnoutTrends` | `GET /calendar/burnout-trends?weeks=` | ✅ |
| `useRecommendations` (+dismiss/dismissAll) | `GET /calendar/recommendations`, `PATCH /:id/dismiss`, `POST /dismiss-all` | ✅ |
| `useEnergyLevel` / `useEnergyHistory` / `exportEnergyHistory` | `GET+POST /calendar/energy`, `GET /history`, `GET /export` | ✅ |
| `useUserCapacity` / `useUserSchedule` | `GET /calendar/capacity`, `GET /calendar/schedule` | ✅ |

### 7.2 Type Alignment — ✅ All aligned

`CalendarInsights`, `BurnoutTrend`, `UserCapacity`/`UserCapacityData`, `UserWorkSchedule`/`UserWorkScheduleData`, `EnergyLevel`, `WellnessRecommendation`, `FocusDailySummary` — identical structures FE/BE.

---

## 8. Documentation Gaps — ✅ Resolved (2026-08-02)

| Document | Status | Notes |
|----------|--------|-------|
| `ARCHITECTURE.md` | ✅ | New **"Focus, Energy & Burnout Architecture"** section — data model, data flow, widgets, design notes |
| `README.md` (frontend) | ✅ | New **"Focus & Wellness System"** feature section — widget table + endpoints |
| Backend `README.md` | ✅ | Calendar/Wellness endpoints updated to 19 (added energy export + dismiss-all), Focus Sessions to 7 (added daily-summary), Cron Jobs table updated (burnout signals weekly, wellness daily) |
| `GAPS.md` | ✅ | This file — refreshed status |

---

## 9. Performance & Caching Gaps — ✅ Resolved

| Area | Status | Details |
|------|--------|---------|
| Focus session active/stats/streak cache | ✅ | Redis with TTL |
| Focus daily summary cache | ✅ | `focusSessionDailySummary` key; invalidated on session complete/cancel |
| Calendar aggregates / insights cache | ✅ | Redis with stale-while-revalidate |
| **Energy level cache** | ✅ | `calendarEnergyLevel` + `calendarEnergyHistory` + `calendarEnergyExport` keys; `CalendarCache.invalidateEnergy` covers all three |
| **Burnout trends cache** | ✅ | `calendarBurnoutTrends` key; `invalidateBurnoutTrends` on changes |
| Frontend stale time | ✅ | 5 min for calendars |
| Frontend polling | ✅ | 30s for active session |

---

## 10. Priority Action Items

### Status: 🟢 All items completed except AI (deferred by decision)

| # | Item | Area | Status |
|---|------|------|--------|
| 1 | Backend tests for focusSession and calendar modules | Backend | ✅ Done |
| 2 | Silent error handling in `useBurnoutTrends`, `useEnergyLevel`, `useEnergyHistory` | Frontend | ✅ Done |
| 3 | `as any` type casts in `useEnergyLevel.ts` | Frontend | ✅ Done |
| 4 | UI for logging daily energy from dashboard/calendar | Frontend | ✅ Done (`EnergyQuickLog`) |
| 5 | Error/empty state UIs for BurnoutTrendsChart, CapacityChart, DailyCapacityView | Frontend | ✅ Done (+ `EnergyTrendChart`) |
| 6 | Focus stats dashboard widget (streak, weekly minutes, by type) | Frontend | ✅ Done (`FocusStreakBadge` + `FocusDailySummary`) |
| 7 | Energy trend chart using `useEnergyHistory` | Frontend | ✅ Done (`EnergyTrendChart`) |
| 8 | Caching for energy level and burnout trends endpoints | Backend | ✅ Done |
| 9 | `expiresAt` logic for WellnessRecommendations | Backend | ✅ Done |
| 10 | Frontend tests for FocusModeBanner, WellnessRecommendations, etc. | Frontend | ✅ Done |
| 11 | Backend test for wellness cron and service (+ burnout cron) | Backend | ✅ Done |
| 12 | Bulk dismiss endpoint for recommendations | Backend | ✅ Done |
| 13 | Implement AI features from AI_IMPLEMENTATION_GUIDE.md | Both | ⏸️ **Deferred by decision (needs paid OpenAI API, ~2–3 weeks)** |
| 14 | Document focus/burnout features in README/ARCHITECTURE/backend README | Docs | ✅ Done |

---

## Summary Statistics

| Category | Count |
|----------|-------|
| ✅ Resolved gaps | **13/14** |
| ⏸️ Deferred (AI features, requires external paid API) | **1** (7 sub-features) |
| ✅ Working endpoints (aligned FE/BE) | **15/15** |
| ✅ Working types (aligned FE/BE) | **6/6** |
| ✅ Backend test suites passing | **3,866+** |
| ✅ Frontend component/hook suites | Passing (incl. 65 chart/card tests added 2026-08-02) |
| ✅ Schema migrations applied | 44 (added `BurnoutSignal.updatedAt`) |
