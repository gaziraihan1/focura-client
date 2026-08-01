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
    totalTasks: 8,
    dueTasks: 3,
    criticalTasks: 1,
    milestoneCount: 0,
    plannedHours: 6,
    actualHours: 5.5,
    focusMinutes: 90,
    workloadScore: 72,
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

import { useWeeklyComparison } from "@/hooks/useWeeklyComparison";

describe("useWeeklyComparison", () => {
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

      const { result } = renderHook(() => useWeeklyComparison());
      expect(result.current.loading).toBe(true);
    });

    it("marks empty when no aggregates exist", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { result } = renderHook(() => useWeeklyComparison());
      expect(result.current.isEmpty).toBe(true);
    });

    it("builds 9 weeks of ratios (8 previous + current)", () => {
      const { result } = renderHook(() => useWeeklyComparison());
      expect(result.current.isEmpty).toBe(false);
      expect(result.current.ratios).toHaveLength(9);
    });

    it("identifies the current week", () => {
      const { result } = renderHook(() => useWeeklyComparison());

      const current = result.current.currentWeek;
      expect(current).toBeDefined();
      expect(current?.isCurrent).toBe(true);
    });

    it("computes the current week ratio from planned vs capacity", () => {
      const { result } = renderHook(() => useWeeklyComparison());

      // 6h planned on Wednesday; 1 planned day -> capacity = 8h -> ratio 0.75
      expect(result.current.currentRatio).toBeCloseTo(0.75, 2);
    });

    it("computes the 8-week average ratio", () => {
      const { result } = renderHook(() => useWeeklyComparison());

      // Only the current week has data; previous 8 weeks are all 0
      expect(result.current.avgRatio).toBe(0);
    });

    it("computes the difference between current and average", () => {
      const { result } = renderHook(() => useWeeklyComparison());

      expect(result.current.difference).toBeCloseTo(0.75, 2);
    });

    it("counts weeks over capacity", () => {
      const { result } = renderHook(() => useWeeklyComparison());

      // 6h planned vs 8h capacity -> not over capacity
      expect(result.current.totalOver).toBe(0);
    });

    it("flags over-capacity weeks in ratios", () => {
      const { result } = renderHook(() => useWeeklyComparison());

      // No week exceeds capacity with the mock data
      expect(result.current.ratios.every((r) => !r.overCapacity)).toBe(true);
    });
  });

  describe("expand state", () => {
    it("starts collapsed", () => {
      const { result } = renderHook(() => useWeeklyComparison());
      expect(result.current.expanded).toBe(false);
    });

    it("expands and collapses via setExpanded", () => {
      const { result } = renderHook(() => useWeeklyComparison());

      act(() => result.current.setExpanded(true));
      expect(result.current.expanded).toBe(true);

      act(() => result.current.setExpanded(false));
      expect(result.current.expanded).toBe(false);
    });

    it("provides a stable chartContentRef", () => {
      const { result } = renderHook(() => useWeeklyComparison());
      expect(result.current.chartContentRef).toBeDefined();
      expect(result.current.chartContentRef.current).toBeNull();
    });
  });
});
