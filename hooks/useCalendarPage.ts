// hooks/useCalendarPage.ts
import { useState, useMemo, useCallback } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
} from "date-fns";
import { useParams } from "next/navigation";
import { Task, useTasks } from "@/hooks/useTask";
import {  Workspace, workspaceKeys } from "@/hooks/useWorkspace";

type CalendarView = "month" | "week" | "day";

export function useCalendarPage() {
  const params    = useParams();
  const slug      = params?.workspaceSlug as string | undefined;
  const queryClient = useQueryClient();
  const workspace   = queryClient.getQueryData<Workspace>(
    workspaceKeys.detail(slug ?? "")
  );
  const workspaceId = workspace?.id;

  const { data: tasksResponse, isLoading: tasksLoading } = useTasks(
    workspaceId ? { workspaceId } : undefined,
    1,
    100,
    { sortBy: "dueDate", sortOrder: "asc" },
  );

  // Resolve workspaceId from slug

  const [currentDate,       setCurrentDate]       = useState(new Date());
  const [view,              setView]              = useState<CalendarView>("month");
  const [selectedTask,      setSelectedTask]      = useState<Task | null>(null);
  const [showOnlyTimeBound, setShowOnlyTimeBound] = useState(true);


  const tasks = useMemo(
    () => tasksResponse?.data ?? [],
    [tasksResponse?.data],
  );

  const filteredTasks = useMemo(() => {
    if (!showOnlyTimeBound) return tasks;
    return tasks.filter((t) => t.dueDate || t.startDate);
  }, [tasks, showOnlyTimeBound]);

  const dateRange = useMemo(() => ({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }),
    end:   endOfWeek(endOfMonth(currentDate),     { weekStartsOn: 0 }),
  }), [currentDate]);

  const handlePrevious = useCallback(() => {
    setCurrentDate((prev) =>
      view === "month" ? subMonths(prev, 1)
      : view === "week" ? subWeeks(prev, 1)
      : subDays(prev, 1)
    );
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) =>
      view === "month" ? addMonths(prev, 1)
      : view === "week" ? addWeeks(prev, 1)
      : addDays(prev, 1)
    );
  }, [view]);

  const handleToday        = useCallback(() => setCurrentDate(new Date()), []);
  const handleTaskClick    = useCallback((task: Task) => setSelectedTask(task), []);
  const handleCloseTaskModal = useCallback(() => setSelectedTask(null), []);

  return {
    currentDate,
    view,
    setView,
    selectedTask,
    showOnlyTimeBound,
    setShowOnlyTimeBound,
    filteredTasks,
    dateRange,
    isLoading: tasksLoading, // show loading until workspace resolves
    handlePrevious,
    handleNext,
    handleToday,
    handleTaskClick,
    handleCloseTaskModal,
  };
}

// hooks/useCalendarPage.ts - Updated with getEventsForDate
import {
  useCalendarAggregates,
  useCalendarInsights,
  useGoalCheckpoints,
  useSystemEvents,
} from '@/hooks/useCalendar';
import type { 
  CalendarDayAggregate, 
  GoalCheckpoint, 
  SystemCalendarEvent 
} from '@/types/calendar.types';
import type { CalendarFilters } from '@/types/calendar.types';
import { useQueryClient } from "@tanstack/react-query";

// ✅ Local date formatting (no UTC conversion)
function formatLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useMainCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calculate month boundaries
  const monthStart = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }, [currentDate]);

  const monthEnd = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }, [currentDate]);

  // Calendar filters
  const calendarFilters: CalendarFilters = useMemo(
    () => ({
      workspaceId: selectedWorkspace,
      startDate: monthStart,
      endDate: monthEnd,
    }),
    [selectedWorkspace, monthStart, monthEnd]
  );

  // Fetch data
  const { data: aggregates = [], loading: aggregatesLoading } =
    useCalendarAggregates(calendarFilters);
  const { data: insights, loading: insightsLoading } =
    useCalendarInsights(calendarFilters);
  const { data: goals = [], loading: goalsLoading } =
    useGoalCheckpoints(calendarFilters);
  const { data: systemEvents = [] } = useSystemEvents(calendarFilters);

  // ✅ Create lookup Maps for O(1) performance
  const aggregateMap = useMemo(() => {
    const map = new Map<string, CalendarDayAggregate>();
    aggregates.forEach((agg) => {
      const date = new Date(agg.date);
      const dateKey = formatLocalDateKey(date);
      map.set(dateKey, agg);
    });
    return map;
  }, [aggregates]);

  const goalsMap = useMemo(() => {
    const map = new Map<string, GoalCheckpoint[]>();
    goals.forEach((goal) => {
      const date = new Date(goal.targetDate);
      const dateKey = formatLocalDateKey(date);
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, goal]);
    });
    return map;
  }, [goals]);

  // ✅ NEW: Events lookup map
  const eventsMap = useMemo(() => {
    const map = new Map<string, SystemCalendarEvent[]>();
    systemEvents.forEach((event) => {
      const date = new Date(event.date);
      const dateKey = formatLocalDateKey(date);
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, event]);
    });
    return map;
  }, [systemEvents]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const startDay = monthStart.getDay();

    // Add previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const day = new Date(monthStart);
      day.setDate(day.getDate() - i - 1);
      days.push(day);
    }

    // Add current month days
    for (let i = 1; i <= monthEnd.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    // Add next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(monthEnd);
      day.setDate(monthEnd.getDate() + i);
      days.push(day);
    }

    return days;
  }, [monthStart, monthEnd, currentDate]);

  // ✅ Use functional updates for safer state management
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => 
      new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => 
      new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // ✅ O(1) lookup with local date formatting
  const getAggregateForDate = useCallback(
    (date: Date): CalendarDayAggregate | undefined => {
      const dateKey = formatLocalDateKey(date);
      return aggregateMap.get(dateKey);
    },
    [aggregateMap]
  );

  const getGoalsForDate = useCallback(
    (date: Date): GoalCheckpoint[] => {
      const dateKey = formatLocalDateKey(date);
      return goalsMap.get(dateKey) || [];
    },
    [goalsMap]
  );

  // ✅ NEW: Get events for date
  const getEventsForDate = useCallback(
    (date: Date): SystemCalendarEvent[] => {
      const dateKey = formatLocalDateKey(date);
      return eventsMap.get(dateKey) || [];
    },
    [eventsMap]
  );

  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const isCurrentMonth = useCallback(
    (date: Date): boolean => {
      return date.getMonth() === currentDate.getMonth();
    },
    [currentDate]
  );

  return {
    // State
    currentDate,
    selectedWorkspace,
    selectedDate,
    setSelectedWorkspace,
    setSelectedDate,

    // Data
    aggregates,
    insights,
    goals,
    systemEvents,

    // Loading states
    loading: aggregatesLoading || insightsLoading,
    aggregatesLoading,
    insightsLoading,
    goalsLoading,

    // Computed
    monthStart,
    monthEnd,
    calendarDays,

    // Handlers
    goToPreviousMonth,
    goToNextMonth,
    goToToday,

    // Helpers
    getAggregateForDate,
    getGoalsForDate,
    getEventsForDate, // ✅ NEW
    isToday,
    isCurrentMonth,
  };
}