import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

// Fixed date within the fake "current week": July 15, 2026 (Wednesday)
const mockAggregates = [
  {
    id: "agg-1",
    userId: "user-1",
    date: "2026-07-15T12:00:00.000Z",
    totalTasks: 5,
    dueTasks: 2,
    criticalTasks: 0,
    milestoneCount: 0,
    plannedHours: 7,
    actualHours: 6.5,
    focusMinutes: 90,
    workloadScore: 65,
    overCapacity: false,
    hasPrimaryFocus: true,
    isReviewDay: false,
    updatedAt: "2026-07-15T12:00:00.000Z",
  },
];

const mockUseCalendarAggregates = vi.fn(() => ({
  data: mockAggregates,
  isLoading: false,
}));

vi.mock("@/hooks/useCalendar", () => ({
  useCalendarAggregates: (...args: any[]) => mockUseCalendarAggregates(...args),
}));

vi.mock("@/hooks/useUserSettings", () => ({
  useUserCapacity: () => ({
    data: { weeklyHours: 40, dailyCapacityHours: 8, deepWorkHours: 4 },
    loading: false,
  }),
  useUserSchedule: () => ({
    data: {
      workDays: ["MON", "TUE", "WED", "THU", "FRI"],
      workStartHour: 9,
      workEndHour: 17,
    },
    loading: false,
  }),
}));

import { useDailyCapacityView } from "@/hooks/useDailyCapacityView";

describe("useDailyCapacityView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-assert the default so mockReturnValue overrides don't leak between tests
    mockUseCalendarAggregates.mockReturnValue({
      data: mockAggregates,
      isLoading: false,
    });
    // Fix the date so tests are deterministic
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z")); // Wednesday
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("data state", () => {
    it("exposes loading while aggregates are loading", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: true,
      });

      const { result } = renderHook(() => useDailyCapacityView());
      expect(result.current.loading).toBe(true);
    });

    it("marks empty when no aggregates exist", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { result } = renderHook(() => useDailyCapacityView());
      expect(result.current.isEmpty).toBe(true);
      expect(result.current.dailyData).toHaveLength(7);
    });

    it("produces 7 days of data", () => {
      const { result } = renderHook(() => useDailyCapacityView());
      expect(result.current.isEmpty).toBe(false);
      expect(result.current.dailyData).toHaveLength(7);
    });

    it("builds the current week range around the fixed date", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      // July 15, 2026 is Wednesday -> week starts Mon July 13
      const dayNames = result.current.dailyData.map((d) => d.dayName);
      expect(dayNames).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
      expect(result.current.weekStart.getDate()).toBe(13);
      expect(result.current.weekEnd.getDate()).toBe(19);
    });

    it("maps planned hours from aggregates onto the matching day", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      // 7h planned on Wednesday July 15
      const wed = result.current.dailyData[2];
      expect(wed.dayName).toBe("Wed");
      expect(wed.plannedHours).toBeCloseTo(7, 1);
    });

    it("flags workdays with capacity and weekend without", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      // Mon-Fri are workdays (8h), Sat/Sun have 0 capacity
      expect(result.current.dailyData[0].capacityHours).toBe(8); // Mon
      expect(result.current.dailyData[4].capacityHours).toBe(8); // Fri
      expect(result.current.dailyData[5].capacityHours).toBe(0); // Sat
      expect(result.current.dailyData[6].capacityHours).toBe(0); // Sun
    });

    it("marks today correctly", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      expect(result.current.dailyData[2].isToday).toBe(true); // Wed
      expect(result.current.dailyData[0].isToday).toBe(false); // Mon
    });

    it("totals planned and capacity across the week", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      // 7h planned total; capacity = 8h x 5 workdays = 40h
      expect(result.current.totalPlanned).toBeCloseTo(7, 1);
      expect(result.current.totalCapacity).toBe(40);
    });

    it("counts over-capacity days", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      // 7h planned vs 8h capacity -> not over
      expect(result.current.overDays).toBe(0);
    });

    it("exposes dailyCapacity and maxHours for rendering", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      expect(result.current.dailyCapacity).toBe(8);
      expect(result.current.maxHours).toBeGreaterThan(0);
    });
  });

  describe("expand state", () => {
    it("starts collapsed", () => {
      const { result } = renderHook(() => useDailyCapacityView());
      expect(result.current.expanded).toBe(false);
    });

    it("expands and collapses via setExpanded", () => {
      const { result } = renderHook(() => useDailyCapacityView());

      act(() => result.current.setExpanded(true));
      expect(result.current.expanded).toBe(true);

      act(() => result.current.setExpanded(false));
      expect(result.current.expanded).toBe(false);
    });

    it("provides a stable chartContentRef", () => {
      const { result } = renderHook(() => useDailyCapacityView());
      expect(result.current.chartContentRef).toBeDefined();
      expect(result.current.chartContentRef.current).toBeNull();
    });
  });
});
