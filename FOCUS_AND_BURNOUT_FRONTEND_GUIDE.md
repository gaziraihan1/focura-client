# 🎨 Focura Focus & Burnout Detection System - Frontend Guide

## Table of Contents
- [Overview](#overview)
- [How It Works from User Perspective](#how-it-works-from-user-perspective)
- [Focus Session UI](#focus-session-ui)
- [Calendar Intelligence Display](#calendar-intelligence-display)
- [Wellness Dashboard](#wellness-dashboard)
- [Energy Level Tracking](#energy-level-tracking)
- [Frontend Hooks & Integration](#frontend-hooks--integration)
- [Real-World User Journeys](#real-world-user-journeys)
- [Best Practices](#best-practices)

---

## Overview

Focura's frontend brings the backend's powerful focus and burnout system to life through:

1. **Focus Session Timer** - Intuitive pomodoro/deep work interface
2. **Calendar Visualization** - Visual workload heatmap
3. **Wellness Recommendations** - Contextual, actionable alerts
4. **Energy Tracking** - Daily 1-10 energy logging
5. **Real-Time Sync** - SSE updates across tabs/devices

**User Value**: _See your burnout risk in real-time, get personalized recommendations, and develop healthy focus habits._

---

## How It Works from User Perspective

### The User Journey

```
┌─ Monday 9 AM ─────────────────────────────────────────────┐
│ 1. User logs in                                            │
│    → Calendar loads with workload visualization            │
│    → "Burnout Risk: MODERATE" alert appears              │
│    → 2 recommendations: "Reduce load", "Focus on priority" │
│                                                            │
├─ Monday 10 AM ─────────────────────────────────────────────┤
│ 2. User starts focus session (Design task)                │
│    → "Pomodoro (25 min)" button → timer starts            │
│    → Task linked automatically                            │
│    → Focus icon appears on calendar                       │
│                                                            │
├─ Monday 10:25 AM ──────────────────────────────────────────┤
│ 3. User completes focus session                           │
│    → Toast: "🎉 Focus session completed!"               │
│    → Calendar updates (focusMinutes += 25)                │
│    → Stats refresh (streak counter increments)            │
│                                                            │
├─ Monday 6 PM ──────────────────────────────────────────────┤
│ 4. User logs energy level                                 │
│    → Quick-log: "Today's energy: 6/10"                   │
│    → Saves to database                                    │
│    → Contributes to evening insights                      │
│                                                            │
└─ Tuesday 6 AM ─────────────────────────────────────────────┘
   Wellness cron runs → New recommendations generated
   Calendar shows updated burnout risk
```

---

## Focus Session UI

### The Focus Session Card Component

**Location**: Task detail view (`components/Dashboard/TaskDetails/FocusSessionCard.tsx`)

**Visual States**:

#### 1. No Active Session
```
┌─────────────────────────────────────┐
│ 🔥 Focus Session                    │
│ Deep work mode for this task        │
│                                     │
│ [🍅 Pomodoro (25m)] [⚡ Deep Work (90m)] │
│                                     │
│ Completed today: 0                  │
│ Focus streak: 5 days               │
└─────────────────────────────────────┘
```

#### 2. Active Session Running
```
┌─────────────────────────────────────┐
│ 🔥 Focus Session                    │
│ Deep work mode for this task        │
│                                     │
│ ⏱️  23:45                          │
│ Progress: ████░░░░░░░░░░░░░░  95%   │
│                                     │
│ [✓ Complete] [✗ Cancel]            │
└─────────────────────────────────────┘
```

### Key Features

| Feature | Purpose | Implementation |
|---------|---------|----------------|
| **Session Type Selector** | Choose focus duration | Radio buttons: Pomodoro, Deep Work, Custom |
| **Live Timer** | Countdown display | Updates every 1 second, auto-completes |
| **Progress Bar** | Visual feedback | CSS width animation |
| **Auto-Complete** | Prevent manual action fatigue | Fires on timer === 0 |
| **Task Link** | Context preservation | Shows task title + description |
| **Streak Display** | Gamification | Consecutive days counter |

### Hook: `useFocusSession()`

```typescript
export function useFocusSession() {
  const qc = useQueryClient();

  // Query: Active session (polls every 30s)
  const { data: activeSession } = useQuery({
    queryKey: focusSessionKeys.active(),
    queryFn: fetchActiveSession,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  // Mutation: Start session
  const { mutate: startSession, isPending: isStarting } = useMutation({
    mutationFn: async ({ taskId, duration, type }) => {
      return await api.post('/api/v1/focus-sessions/start', 
        { taskId, type, duration }
      );
    },
    onSuccess: (newSession) => {
      qc.setQueryData(focusSessionKeys.active(), newSession);
      toast.success('✨ Focus session started!');
    },
  });

  // Mutation: Complete session
  const { mutate: completeSession, isPending: isCompleting } = useMutation({
    mutationFn: async () => {
      await api.post(
        `/api/v1/focus-sessions/${activeSession.id}/complete`,
        {}
      );
    },
    onMutate: async () => {
      // Optimistic update
      qc.setQueryData(focusSessionKeys.active(), null);
    },
    onSuccess: () => {
      toast.success('🎉 Focus session completed!');
      qc.invalidateQueries({ queryKey: focusSessionKeys.stats() });
    },
  });

  return {
    activeSession,
    isLoading: isLoadingActive,
    startSession,
    completeSession,
    cancelSession,
  };
}
```

### Usage in Components

```typescript
function TaskDetailsPanel({ taskId }: { taskId: string }) {
  const { activeSession, startSession, completeSession } = useFocusSession();
  const isActive = activeSession?.taskId === taskId;

  return (
    <div>
      {isActive ? (
        <TimerDisplay
          duration={activeSession.duration}
          onComplete={() => completeSession()}
        />
      ) : (
        <button onClick={() => startSession({ taskId, type: 'POMODORO', duration: 25 })}>
          Start Pomodoro
        </button>
      )}
    </div>
  );
}
```

---

## Calendar Intelligence Display

### Calendar Grid Visualization

**Location**: `components/Dashboard/Calendar/`

**Visual Hierarchy**:

```
┌─ Calendar Header ──────────────────────────────────────┐
│ Time Intelligence        [Month] [Week] [Day] [Today]  │
│ Strategic overview of your time and capacity          │
└────────────────────────────────────────────────────────┘

┌─ Insights Bar ─────────────────────────────────────────┐
│  📈 Commitment Gap    🔥 Burnout Risk  ⚡ Focus Days │
│  +12h (30% over)      HIGH              4 days       │
│                                                       │
│  ⚠️ You're overbooked. Consider delegating tasks.    │
└────────────────────────────────────────────────────────┘

┌─ Calendar Grid ────────────────────────────────────────┐
│                                                        │
│ Sun  Mon  Tue  Wed  Thu  Fri  Sat                      │
│                     [1] [2] [3] [4]                   │
│  🔴   🟠   🟠   🟡   🟢   🟢   ⚪                     │
│  RED  ORG  ORG  YEL  GRN  GRN  GRY                    │
│  2.1  1.9  2.0  1.1  0.8  0.7  0.0                    │
│  10h  9h   10h  4h   3h   2h   0h                     │
│                                                        │
│ [5] [6] [7] [8] [9] [10][11]                          │
│  🟡   🟡   🔴   🟠   🟠   🟡   🟡                    │
│  YEL  YEL  RED  ORG  ORG  YEL  YEL                    │
│  1.2  1.1  2.3  1.8  1.7  1.0  1.1                    │
│  5h   5h   12h  9h   8h   4h   5h                     │
│                                                        │
└────────────────────────────────────────────────────────┘

Legend:
🔴 RED:  Overloaded (score > 2.0)
🟠 ORANGE: High load (1.5–2.0)
🟡 YELLOW: Moderate (1.0–1.5)
🟢 GREEN: Healthy (0.5–1.0)
⚪ GREY: Off-day (no tasks)
🔥 Primary focus set
```

### Calendar Cell Component

```typescript
interface CalendarDayCellProps {
  date: Date;
  aggregate?: CalendarDayAggregate;
  workloadColor: string;
}

export function CalendarDayCell({
  date,
  aggregate,
  workloadColor,
}: CalendarDayCellProps) {
  return (
    <div className={cn(
      'p-3 border-r border-b',
      workloadColor, // bg-red-500/10, bg-yellow-500/10, etc.
      'hover:bg-accent/50 cursor-pointer'
    )}>
      {/* Date Number */}
      <span className="text-sm font-medium">
        {date.getDate()}
      </span>

      {/* Primary Focus Indicator */}
      {aggregate?.hasPrimaryFocus && (
        <Zap className="w-3.5 h-3.5 text-purple-600" />
      )}

      {/* Task Stats */}
      {aggregate && (
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>{aggregate.totalTasks} tasks</div>
          <div>{aggregate.plannedHours.toFixed(1)}h planned</div>
          {aggregate.criticalTasks > 0 && (
            <div className="text-red-600 font-medium">
              {aggregate.criticalTasks} critical
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Insights Bar Component

```typescript
interface CalendarInsightsBarProps {
  insights: CalendarInsights | null;
}

export function CalendarInsightsBar({ insights }: CalendarInsightsBarProps) {
  if (!insights) return null;

  return (
    <div className="bg-card border-b border-border p-6">
      <div className="grid grid-cols-4 gap-4">
        {/* Commitment Gap */}
        <InsightCard
          icon={<TrendingUp />}
          label="Commitment Gap"
          value={`${insights.commitmentGap > 0 ? '+' : ''}${insights.commitmentGap.toFixed(1)}h`}
          subtitle={`${insights.totalPlannedHours.toFixed(0)}h / ${insights.totalCapacityHours.toFixed(0)}h`}
          color={insights.commitmentGap > 0 ? 'text-red-600' : 'text-green-600'}
        />

        {/* Burnout Risk */}
        <InsightCard
          icon={<Flame />}
          label="Burnout Risk"
          value={insights.burnoutRisk.toLowerCase()}
          subtitle={`${insights.overloadedDays} overloaded days`}
          color={getBurnoutColor(insights.burnoutRisk)}
        />

        {/* Focus Days */}
        <InsightCard
          icon={<Zap />}
          label="Focus Days"
          value={insights.focusDays}
          subtitle="Deep work scheduled"
        />

        {/* Deep Work % */}
        {insights.timeAllocation && (
          <InsightCard
            icon={<BarChart3 />}
            label="Deep Work"
            value={`${insights.timeAllocation.deepWork}%`}
            progressBar={insights.timeAllocation.deepWork}
          />
        )}
      </div>

      {/* Alert Messages */}
      {insights.commitmentGap > 10 && (
        <Alert className="mt-4 bg-red-50 border-red-200">
          <AlertTriangle className="text-red-600" />
          <AlertTitle>Over capacity this week</AlertTitle>
          <AlertDescription>
            You've planned {insights.commitmentGap.toFixed(0)}h more than capacity.
            Consider delegating or rescheduling tasks.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

---

## Wellness Dashboard

### Recommendations Panel

**Location**: `app/(dashboard-pages)/dashboard/wellness/` (future)

**Mock Design**:

```
┌─ Wellness Recommendations ─────────────────────────────┐
│ 3 active • Last updated: 6 AM today                    │
│                                                        │
│ [🔴 CRITICAL] Your burnout risk is critical           │
│  Consider taking a day off or reducing workload       │
│  Priority: 100  Expires: Jan 18, 2026                 │
│  [✓ Dismiss]                                          │
│                                                        │
│ [🟠 HIGH] Burnout risk increased from MODERATE→HIGH  │
│  Review your task load. Delegate or reschedule.      │
│  Priority: 90  Expires: Jan 18, 2026                  │
│  [✓ Dismiss]                                          │
│                                                        │
│ [🟡 MODERATE] You've had 3 overloaded days           │
│  Keep planned hours within your {8h} daily capacity.  │
│  Priority: 80  Expires: Jan 17, 2026                  │
│  [✓ Dismiss]                                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Hook: `useWellnessRecommendations()`

```typescript
export function useWellnessRecommendations() {
  const qc = useQueryClient();

  // Query recommendations
  const { data: recommendations = [] } = useQuery({
    queryKey: ['wellness', 'recommendations'],
    queryFn: async () => {
      const result = await api.get('/api/v1/calendar/recommendations');
      return result?.success ? result.data : [];
    },
    refetchInterval: 60_000, // Refresh every minute
  });

  // Mutation: Dismiss recommendation
  const { mutate: dismissRecommendation } = useMutation({
    mutationFn: async (recId: string) => {
      await api.patch(
        `/api/v1/calendar/recommendations/${recId}/dismiss`,
        {}
      );
    },
    onSuccess: (_, recId) => {
      // Remove from cache
      qc.setQueryData(
        ['wellness', 'recommendations'],
        (prev: any[]) => prev.filter(r => r.id !== recId)
      );
      toast.success('Recommendation dismissed');
    },
  });

  // Filter by priority
  const urgent = recommendations.filter(r => r.priority >= 80);
  const normal = recommendations.filter(r => r.priority < 80);

  return { recommendations, urgent, normal, dismissRecommendation };
}
```

---

## Energy Level Tracking

### Energy Quick-Log Widget

**Location**: `components/Dashboard/Calendar/EnergyQuickLog.tsx` (future)

**Visual**:

```
┌─ How's your energy today? ─────────────────────┐
│                                                │
│  1  2  3  4  5  6  7  8  9  10                 │
│  😴                              🔥            │
│  ●  ○  ○  ○  ○  ○  ○  ○  ○  ○   (default: 5) │
│                                                │
│  Optional note:                               │
│  [_Good sleep, ready to focus_________________] │
│                                                │
│  [Save]                                       │
└────────────────────────────────────────────────┘
```

### Hook: `useEnergyLevel()`

```typescript
export function useEnergyLevel(date: Date) {
  const [data, setData] = useState<EnergyLevel | null>(null);
  const [loading, setLoading] = useState(true);

  const dateStr = date.toISOString().split('T')[0];

  // Fetch energy for date
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get<EnergyLevel>(
          `/api/v1/calendar/energy?date=${dateStr}`,
          { showErrorToast: false }
        );
        if (result?.success) setData(result.data ?? null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateStr]);

  // Log energy
  const logEnergy = async (energyLevel: number, note?: string) => {
    const result = await api.post<EnergyLevel>(
      '/api/v1/calendar/energy',
      { date: new Date(dateStr), energyLevel, note },
      { showSuccessToast: true }
    );
    if (result?.success) setData(result.data as any);
    return !!result?.success;
  };

  return { data, loading, logEnergy };
}
```

---

## Frontend Hooks & Integration

### Hook Ecosystem

| Hook | Purpose | Usage |
|------|---------|-------|
| `useFocusSession()` | Start/complete/track sessions | FocusSessionCard |
| `useFocusSessionStats()` | Get session statistics | Dashboard stats card |
| `useEnergyLevel()` | Get/log daily energy (1-10) | Energy widget |
| `useEnergyHistory()` | Fetch energy trends | Energy history chart |
| `useCalendarAggregates()` | Fetch daily workload data | Calendar grid |
| `useCalendarInsights()` | Get weekly insights | Insights bar |
| `useWellnessRecommendations()` | Fetch wellness alerts | Recommendations panel |

### Integration Points

**Task Detail View**:
```typescript
function TaskDetails({ taskId }: { taskId: string }) {
  const { data: task } = useTask(taskId);
  const { activeSession, startSession, completeSession } = useFocusSession();

  return (
    <div>
      <h1>{task?.title}</h1>
      {/* ... */}
      <FocusSessionCard
        taskId={taskId}
        onStart={startSession}
        onComplete={completeSession}
      />
    </div>
  );
}
```

**Dashboard Overview**:
```typescript
function DashboardPage() {
  const { data: aggregates } = useCalendarAggregates();
  const { data: insights } = useCalendarInsights();
  const { recommendations } = useWellnessRecommendations();

  return (
    <div>
      <CalendarHeader />
      <CalendarInsightsBar insights={insights} />
      <CalendarGrid aggregates={aggregates} />
      <RecommendationsPanel recommendations={recommendations} />
    </div>
  );
}
```

---

## Real-World User Journeys

### Journey 1: Recovering from Burnout

```
Monday AM (Risk: CRITICAL)
├─ Calendar shows all red cells
├─ Insights bar flashing: "🔴 CRITICAL BURNOUT RISK"
├─ Recommendation: "Consider taking a day off"
└─ User dismisses 1 task → risk drops to HIGH

Tuesday AM (Risk: HIGH)
├─ Calendar still mostly orange
├─ Recommendation: "Burnout risk still high, prioritize rest"
└─ User takes 2-hour break

Wednesday AM (Risk: MODERATE)
├─ Calendar shows mix of orange/yellow
├─ Recommendation: "You're improving. Keep reduced load."
└─ User starts 3 focus sessions (builds confidence)

Friday AM (Risk: LOW)
├─ Calendar mostly green
├─ Insights bar: "✅ Healthy balance"
├─ Recommendation: "Great week! You're back on track."
└─ User has 5 focus sessions (streak: 5 days)
```

### Journey 2: Building Focus Habits

```
Week 1:
├─ 1 focus session (Pomodoro)
├─ Recommendation: "Only 1 session this week. Aim for 3-5."
└─ Streak: 1 day

Week 2:
├─ 3 focus sessions (Pomodoro × 2, Deep Work × 1)
├─ Recommendation: "Good progress! Keep it up."
└─ Streak: 3 days

Week 3:
├─ 5 focus sessions (Pomodoro × 3, Deep Work × 2)
├─ No focus recommendation (on track)
├─ Energy level: 7-8/10 consistently
└─ Streak: 7 days 🔥
```

---

## Best Practices

### For Users

1. **Set Realistic Capacity**
   - Edit daily capacity in settings
   - Adjust based on role/season

2. **Link Tasks to Focus Sessions**
   - Helps burnout algorithm understand effort
   - Builds task analytics

3. **Log Energy Daily**
   - Even if just a quick 1-10 rating
   - Correlates with burnout predictions

4. **Review Calendar Weekly**
   - Friday is a good day to review
   - Plan adjustments for next week

5. **Act on Recommendations**
   - Don't just dismiss—delegate or rescope
   - Early action prevents escalation

### For Developers

1. **Optimize Query Keys**
   - Use TanStack Query factory functions
   - Enables fine-grained cache invalidation

2. **Implement Optimistic Updates**
   - Complete session before server confirms
   - Dismiss recommendation immediately

3. **Handle Offline Gracefully**
   - Queue focus sessions in IndexedDB
   - Sync on reconnect

4. **Monitor Cache Invalidation**
   - Log when caches clear
   - Alert if stale data persists

5. **Test Focus Session Timer**
   - Edge case: auto-complete at 0 seconds
   - Test across multiple tabs

---

## FAQ

**Q: Why does my focus streak reset?**
- A: Streak requires ≥1 completed session per day (UTC). Incomplete sessions don't count.

**Q: Can I log a focus session retroactively?**
- A: Not yet. Focus sessions must be created + completed on the same day.

**Q: What if I complete a session early?**
- A: That's fine. The `endedAt` timestamp records actual completion, not planned duration.

**Q: How does energy level affect burnout detection?**
- A: Low energy + high workload → recommendation. Doesn't change risk calculation directly.

**Q: Can I set multiple focus sessions per day?**
- A: Yes! Stack them back-to-back (e.g., 3 × Pomodoro = 75 min). Only one active at a time.

---

_Last Updated: January 2026_
_Focura Frontend Team_