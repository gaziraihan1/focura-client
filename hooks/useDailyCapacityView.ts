import { useMemo, useState, useRef } from "react";
import { useCalendarAggregates } from "@/hooks/useCalendar";
import { useUserCapacity, useUserSchedule } from "@/hooks/useUserSettings";
import { getMonday } from "@/utils/calendar.utils";

// ─── Constants ─────────────────────────────────────────────────────────────

const DAY_NAMES_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_CODES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DayData {
  dayName: string;
  dateKey: string; // YYYY-MM-DD
  plannedHours: number;
  capacityHours: number;
  isToday: boolean;
  isWorkDay: boolean;
  overCapacity: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getCurrentWeekDates(): Date[] {
  const monday = getMonday(new Date());
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push(day);
  }
  return days;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useDailyCapacityView() {
  const [expanded, setExpanded] = useState(false);
  const chartContentRef = useRef<HTMLDivElement>(null);

  // Current week date range
  const { weekStart, weekEnd, weekDates } = useMemo(() => {
    const days = getCurrentWeekDates();
    return {
      weekStart: days[0],
      weekEnd: days[6],
      weekDates: days,
    };
  }, []);

  // Fetch aggregates for current week
  const { data: aggregates = [], isLoading: aggLoading } =
    useCalendarAggregates({
      workspaceId: undefined,
      startDate: weekStart,
      endDate: weekEnd,
    });

  const { data: capacity, loading: capLoading } = useUserCapacity();
  const { data: schedule, loading: schedLoading } = useUserSchedule();

  const dailyCapacity = capacity?.dailyCapacityHours ?? 8;
  const workDays = schedule?.workDays ?? [];

  // Build aggregate lookup map
  const aggMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const agg of aggregates) {
      const key = formatDateKey(new Date(agg.date));
      map.set(key, agg.plannedHours);
    }
    return map;
  }, [aggregates]);

  // Build day-by-day data
  const dailyData: DayData[] = useMemo(() => {
    return weekDates.map((date, i) => {
      const dateKey = formatDateKey(date);
      const plannedHours = aggMap.get(dateKey) ?? 0;
      const isWork = workDays.includes(DAY_CODES[i]);
      return {
        dayName: DAY_NAMES_SHORT[i],
        dateKey,
        plannedHours: Math.round(plannedHours * 10) / 10,
        capacityHours: isWork ? dailyCapacity : 0,
        isToday: isToday(date),
        isWorkDay: isWork,
        overCapacity: plannedHours > (isWork ? dailyCapacity : 0),
      };
    });
  }, [weekDates, aggMap, workDays, dailyCapacity]);

  const totalPlanned = useMemo(
    () => dailyData.reduce((s, d) => s + d.plannedHours, 0),
    [dailyData]
  );
  const totalCapacity = useMemo(
    () => dailyData.reduce((s, d) => s + d.capacityHours, 0),
    [dailyData]
  );
  const overDays = useMemo(
    () => dailyData.filter((d) => d.overCapacity).length,
    [dailyData]
  );

  const maxHours = useMemo(
    () =>
      Math.max(
        ...dailyData.map((d) => Math.max(d.plannedHours, d.capacityHours)),
        1
      ),
    [dailyData]
  );

  const loading = aggLoading || capLoading || schedLoading;
  const isEmpty = aggregates.length === 0;

  return {
    expanded,
    setExpanded,
    chartContentRef,
    loading,
    isEmpty,
    weekStart,
    weekEnd,
    dailyCapacity,
    dailyData,
    totalPlanned,
    totalCapacity,
    overDays,
    maxHours,
  };
}
