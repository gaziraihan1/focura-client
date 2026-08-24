"use client";

import { useState } from "react";
import { CalendarHeader } from "@/components/Dashboard/Calendar/CalendarHeader";
import { CalendarInsightsBar } from "@/components/Dashboard/Calendar/CalendarInsightsBar";
import { CalendarGrid } from "@/components/Dashboard/Calendar/CalendarGrid";
import { CalendarLegend } from "@/components/Dashboard/Calendar/CalendarLegend";
import { CalendarSkeleton } from "@/components/Dashboard/Calendar/CalendarSkeleton";
import { DayDetailsPanel } from "@/components/Dashboard/Calendar/DayDetailsPanel";
import dynamic from "next/dynamic";
import { BurnoutTrendsChart } from "@/components/Dashboard/Calendar/BurnoutTrendsChart";
import { DailyCapacityView } from "@/components/Dashboard/Calendar/DailyCapacityView";
import { WeeklyComparison } from "@/components/Dashboard/Calendar/WeeklyComparison";

const CapacityChart = dynamic(
  () => import("@/components/Dashboard/Calendar/CapacityChart").then((m) => m.CapacityChart),
  { ssr: false }
);
import { EnergyQuickLog } from "@/components/Dashboard/Calendar/EnergyQuickLog";
import { useMainCalendarPage } from "@/hooks/useCalendarPage";

type CalendarViewType = "month" | "week" | "day";

export function CalendarPageContent() {
  const [view, setView] = useState<CalendarViewType>("month");

  const {
    currentDate,
    insights,
    loading,
    calendarDays,
    selectedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getAggregateForDate,
    getGoalsForDate,
    getEventsForDate,
    isToday,
    isCurrentMonth,
    setSelectedDate,
  } = useMainCalendarPage();

  const handlePrevious = () => {
    if (view === "month") goToPreviousMonth();
    else if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      goToPreviousMonth();
    } else {
      goToPreviousMonth();
    }
  };

  const handleNext = () => {
    if (view === "month") goToNextMonth();
    else if (view === "week") {
      goToNextMonth();
    } else {
      goToNextMonth();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <main className="min-h-screen 2xl:max-w-7xl mx-auto" aria-label="Calendar">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={goToToday}
        onViewChange={setView}
      />

      <CalendarInsightsBar insights={insights ?? null} />

      <div className="max-w-400 mx-auto px-2 sm:px-6 lg:px-8 mt-4 space-y-4">
        <WeeklyComparison />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DailyCapacityView />
          <CapacityChart />
        </div>
        <BurnoutTrendsChart />
      </div>

      <div className="px-2 sm:px-6 lg:px-8 py-8">
        <CalendarGrid
          calendarDays={calendarDays}
          getAggregateForDate={getAggregateForDate}
          getGoalsForDate={getGoalsForDate}
          isToday={isToday}
          isCurrentMonth={isCurrentMonth}
          onDateClick={setSelectedDate}
          onDateSelect={setSelectedDate}
        />

        <CalendarLegend />
      </div>

      {selectedDate && (
        <DayDetailsPanel
          date={selectedDate}
          aggregate={getAggregateForDate(selectedDate)}
          goals={getGoalsForDate(selectedDate)}
          events={getEventsForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}

      <EnergyQuickLog />
    </main>
  );
}
