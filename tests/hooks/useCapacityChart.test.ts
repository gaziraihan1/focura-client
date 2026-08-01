import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockAggregates = [
  {
    id: "agg-1",
    userId: "user-1",
    date: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    updatedAt: new Date().toISOString(),
  },
  {
    id: "agg-2",
    userId: "user-1",
    date: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalTasks: 15,
    dueTasks: 8,
    criticalTasks: 4,
    milestoneCount: 1,
    plannedHours: 12,
    actualHours: 10,
    focusMinutes: 30,
    workloadScore: 98,
    overCapacity: true,
    hasPrimaryFocus: false,
    isReviewDay: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "agg-3",
    userId: "user-1",
    date: new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalTasks: 5,
    dueTasks: 1,
    criticalTasks: 0,
    milestoneCount: 0,
    plannedHours: 4,
    actualHours: 4,
    focusMinutes: 120,
    workloadScore: 50,
    overCapacity: false,
    hasPrimaryFocus: true,
    isReviewDay: false,
    updatedAt: new Date().toISOString(),
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

import { useCapacityChart } from "@/hooks/useCapacityChart";

describe("useCapacityChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-assert the default so mockReturnValue overrides don't leak between tests
    mockUseCalendarAggregates.mockReturnValue({
      data: mockAggregates,
      isLoading: false,
    });
  });

  describe("data state", () => {
    it("exposes loading while aggregates are loading", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: true,
      });

      const { result } = renderHook(() => useCapacityChart());
      expect(result.current.loading).toBe(true);
    });

    it("marks empty when no aggregates exist", () => {
      mockUseCalendarAggregates.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { result } = renderHook(() => useCapacityChart());
      expect(result.current.isEmpty).toBe(true);
      expect(result.current.weeklyData).toHaveLength(8);
    });

    it("produces 8 weeks of data from aggregates", () => {
      const { result } = renderHook(() => useCapacityChart());
      expect(result.current.isEmpty).toBe(false);
      expect(result.current.weeklyData).toHaveLength(8);
    });

    it("sums total planned hours across weeks", () => {
      const { result } = renderHook(() => useCapacityChart());

      // 6 + 12 + 4 = 22h planned across the 3 weeks with data
      expect(result.current.totalPlannedAll).toBeCloseTo(22, 1);
    });

    it("computes total capacity from daily capacity x active days", () => {
      const { result } = renderHook(() => useCapacityChart());

      // 8h/day x workDays. Weeks without data use configured 5 work days.
      const capacityAll = result.current.totalCapacityAll;
      expect(capacityAll).toBeGreaterThan(0);
      expect(capacityAll % 8).toBe(0);
    });

    it("counts over-capacity weeks", () => {
      const { result } = renderHook(() => useCapacityChart());

      // Week with 12h planned vs 8h x 1 active day = 8h capacity → over
      expect(result.current.overCapacityWeeks).toBeGreaterThan(0);
    });

    it("exposes a positive maxValue for the chart domain", () => {
      const { result } = renderHook(() => useCapacityChart());
      expect(result.current.maxValue).toBeGreaterThan(0);
    });
  });

  describe("expand state", () => {
    it("starts collapsed", () => {
      const { result } = renderHook(() => useCapacityChart());
      expect(result.current.expanded).toBe(false);
    });

    it("expands when setExpanded(true) is called", () => {
      const { result } = renderHook(() => useCapacityChart());
      act(() => result.current.setExpanded(true));
      expect(result.current.expanded).toBe(true);
    });

    it("collapses when setExpanded(false) is called", () => {
      const { result } = renderHook(() => useCapacityChart());
      act(() => result.current.setExpanded(true));
      act(() => result.current.setExpanded(false));
      expect(result.current.expanded).toBe(false);
    });

    it("provides a stable chartContentRef", () => {
      const { result } = renderHook(() => useCapacityChart());
      expect(result.current.chartContentRef).toBeDefined();
      expect(result.current.chartContentRef.current).toBeNull();
    });
  });
});
