import { useMemo, useState, useRef } from "react";
import { useCalendarAggregates } from "@/hooks/useCalendar";
import { useUserCapacity, useUserSchedule } from "@/hooks/useUserSettings";
import type { CalendarDayAggregate } from "@/types/calendar.types";
import { subWeeks, format } from "date-fns";
import { getMonday } from "@/utils/calendar.utils";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface WeekRatio {
  weekStart: string;
  label: string;
  ratio: number; // planned / capacity (0–1+)
  isCurrent: boolean;
  overCapacity: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatShortWeek(weekStart: Date): string {
  const mon = format(weekStart, "MMM d");
  const sun = new Date(weekStart);
  sun.setDate(sun.getDate() + 6);
  return `${format(sun, "MMM d")}`;
}

function computeRatios(
  aggregates: CalendarDayAggregate[],
  weeks: Date[],
  dailyCapacity: number,
  workDaysCount: number
): WeekRatio[] {
  const weekMap = new Map<string, CalendarDayAggregate[]>();
  for (const agg of aggregates) {
    const date = new Date(agg.date);
    const weekKey = getMonday(date).toISOString();
    const existing = weekMap.get(weekKey) || [];
    existing.push(agg);
    weekMap.set(weekKey, existing);
  }

  const now = getMonday(new Date());

  return weeks.map((weekStart) => {
    const monday = getMonday(weekStart);
    const key = monday.toISOString();
    const isCurrent = monday.getTime() === now.getTime();
    const dayAggs = weekMap.get(key) || [];
    const totalPlanned = dayAggs.reduce((sum, d) => sum + d.plannedHours, 0);
    const plannedDays = dayAggs.filter((d) => d.plannedHours > 0).length;
    const activeDays = plannedDays > 0 ? Math.max(plannedDays, 1) : workDaysCount;
    const totalCapacity = dailyCapacity * activeDays;
    const ratio = totalCapacity > 0 ? totalPlanned / totalCapacity : 0;

    return {
      weekStart: key,
      label: formatShortWeek(monday),
      ratio: Math.round(ratio * 100) / 100,
      isCurrent,
      overCapacity: totalPlanned > totalCapacity,
    };
  });
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useWeeklyComparison() {
  const [expanded, setExpanded] = useState(false);
  const chartContentRef = useRef<HTMLDivElement>(null);

  // Fetch 8 weeks + current week (9 total, but we use 8 previous + current)
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = subWeeks(end, 8);
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

  // 8 previous weeks + current week = 9 total
  const weeks = useMemo(() => {
    const result: Date[] = [];
    for (let i = 8; i >= 0; i--) {
      result.push(subWeeks(new Date(), i));
    }
    return result;
  }, []);

  const dailyCapacity = capacity?.dailyCapacityHours ?? 8;
  const workDaysCount = schedule?.workDays?.length ?? 5;

  const ratios = useMemo(
    () => computeRatios(aggregates, weeks, dailyCapacity, workDaysCount),
    [aggregates, weeks, dailyCapacity, workDaysCount]
  );

  const currentWeek = useMemo(
    () => ratios.find((r) => r.isCurrent),
    [ratios]
  );

  const previousWeeks = useMemo(
    () => ratios.filter((r) => !r.isCurrent),
    [ratios]
  );

  const avgRatio = useMemo(
    () =>
      previousWeeks.length > 0
        ? previousWeeks.reduce((s, r) => s + r.ratio, 0) / previousWeeks.length
        : 0,
    [previousWeeks]
  );

  const currentRatio = currentWeek?.ratio ?? 0;
  const difference = currentRatio - avgRatio;
  const overCount = previousWeeks.filter((r) => r.overCapacity).length;
  const totalOver = currentWeek?.overCapacity ? overCount + 1 : overCount;

  const loading = aggLoading || capLoading || schedLoading;
  const isEmpty = aggregates.length === 0;

  return {
    expanded,
    setExpanded,
    chartContentRef,
    loading,
    isEmpty,
    ratios,
    currentWeek,
    currentRatio,
    avgRatio,
    difference,
    totalOver,
  };
}
