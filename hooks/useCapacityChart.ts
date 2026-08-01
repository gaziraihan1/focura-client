import { useMemo, useState, useRef } from "react";
import { subWeeks, format } from "date-fns";
import { useCalendarAggregates } from "@/hooks/useCalendar";
import { useUserCapacity, useUserSchedule } from "@/hooks/useUserSettings";
import type { CalendarDayAggregate } from "@/types/calendar.types";
import { getMonday } from "@/utils/calendar.utils";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatWeekLabel(weekStart: Date): string {
  const mon = format(weekStart, "MMM d");
  const sun = new Date(weekStart);
  sun.setDate(sun.getDate() + 6);
  return `${mon} - ${format(sun, "MMM d")}`;
}

export interface WeekData {
  weekStart: string; // ISO date string of Monday
  label: string;
  totalPlanned: number;
  totalCapacity: number;
  plannedDays: number;
}

function groupByWeek(
  aggregates: CalendarDayAggregate[],
  weeks: Date[],
  dailyCapacity: number,
  workDaysCount: number
): WeekData[] {
  const weekMap = new Map<string, CalendarDayAggregate[]>();

  for (const agg of aggregates) {
    const date = new Date(agg.date);
    const weekKey = getMonday(date).toISOString();
    const existing = weekMap.get(weekKey) || [];
    existing.push(agg);
    weekMap.set(weekKey, existing);
  }

  return weeks.map((weekStart) => {
    const key = getMonday(weekStart).toISOString();
    const dayAggs = weekMap.get(key) || [];
    const totalPlanned = dayAggs.reduce((sum, d) => sum + d.plannedHours, 0);
    const plannedDays = dayAggs.filter((d) => d.plannedHours > 0).length;
    // If we have actual data, compute real days; otherwise use configured work days
    const activeDays = plannedDays > 0 ? Math.max(plannedDays, 1) : workDaysCount;
    const totalCapacity = dailyCapacity * activeDays;

    return {
      weekStart: key,
      label: formatWeekLabel(weekStart),
      totalPlanned: Math.round(totalPlanned * 10) / 10,
      totalCapacity,
      plannedDays,
    };
  });
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useCapacityChart() {
  const [expanded, setExpanded] = useState(false);
  const chartContentRef = useRef<HTMLDivElement>(null);

  // Fetch aggregates for the last 8 weeks
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = subWeeks(end, 7);
    return { startDate: start, endDate: end };
  }, []);

  const { data: aggregates = [], isLoading: aggLoading } =
    useCalendarAggregates({
      workspaceId: undefined,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

  const { data: capacity, loading: capLoading } = useUserCapacity();
  const { data: schedule, loading: schedLoading } = useUserSchedule();

  const weeks = useMemo(() => {
    const result: Date[] = [];
    const end = new Date();
    for (let i = 7; i >= 0; i--) {
      result.push(subWeeks(end, i));
    }
    return result;
  }, []);

  const dailyCapacity = capacity?.dailyCapacityHours ?? 8;
  const workDaysCount = schedule?.workDays?.length ?? 5;

  const weeklyData = useMemo(
    () => groupByWeek(aggregates, weeks, dailyCapacity, workDaysCount),
    [aggregates, weeks, dailyCapacity, workDaysCount]
  );

  const totalPlannedAll = useMemo(
    () => weeklyData.reduce((s, w) => s + w.totalPlanned, 0),
    [weeklyData]
  );
  const totalCapacityAll = useMemo(
    () => weeklyData.reduce((s, w) => s + w.totalCapacity, 0),
    [weeklyData]
  );
  const overCapacityWeeks = useMemo(
    () => weeklyData.filter((w) => w.totalPlanned > w.totalCapacity).length,
    [weeklyData]
  );

  const maxValue = useMemo(
    () =>
      Math.max(
        ...weeklyData.map((w) => Math.max(w.totalPlanned, w.totalCapacity)),
        1
      ),
    [weeklyData]
  );

  const loading = aggLoading || capLoading || schedLoading;
  const isEmpty = aggregates.length === 0;

  return {
    expanded,
    setExpanded,
    chartContentRef,
    loading,
    isEmpty,
    weeklyData,
    totalPlannedAll,
    totalCapacityAll,
    overCapacityWeeks,
    maxValue,
  };
}
