"use client";

import { useState } from "react";
import { CalendarHeader } from "@/components/Dashboard/Calendar/CalendarHeader";
import { CalendarInsightsBar } from "@/components/Dashboard/Calendar/CalendarInsightsBar";
import { CalendarGrid } from "@/components/Dashboard/Calendar/CalendarGrid";
import { CalendarLegend } from "@/components/Dashboard/Calendar/CalendarLegend";
import { CalendarSkeleton } from "@/components/Dashboard/Calendar/CalendarSkeleton";
import { DayDetailsPanel } from "@/components/Dashboard/Calendar/DayDetailsPanel";
import { BurnoutTrendsChart } from "@/components/Dashboard/Calendar/BurnoutTrendsChart";
import { useMainCalendarPage } from "@/hooks/useCalendarPage";

type CalendarViewType = "month" | "week" | "day";

export default function CalendarPage() {
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
      // Navigate by week
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      // This would need to be connected to the hook's state
      goToPreviousMonth(); // Placeholder - in production, use a dedicated week navigation
    } else {
      goToPreviousMonth(); // Placeholder for day navigation
    }
  };

  const handleNext = () => {
    if (view === "month") goToNextMonth();
    else if (view === "week") {
      goToNextMonth(); // Placeholder for week navigation
    } else {
      goToNextMonth(); // Placeholder for day navigation
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
    <div className="min-h-screen bg-background" role="main" aria-label="Calendar">
      {/* Header with View Switcher */}
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={goToToday}
        onViewChange={setView}
      />

      {/* Insights Bar */}
      <CalendarInsightsBar insights={insights ?? null} />

      {/* Burnout Trends */}
      <div className="max-w-400 mx-auto px-2 sm:px-6 lg:px-8 mt-4">
        <BurnoutTrendsChart />
      </div>

      {/* Calendar Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <CalendarGrid
          calendarDays={calendarDays}
          getAggregateForDate={getAggregateForDate}
          getGoalsForDate={getGoalsForDate}
          isToday={isToday}
          isCurrentMonth={isCurrentMonth}
          onDateClick={setSelectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Legend */}
        <CalendarLegend />
      </div>

      {/* Day Details Panel - Shows when date is clicked */}
      {selectedDate && (
        <DayDetailsPanel
          date={selectedDate}
          aggregate={getAggregateForDate(selectedDate)}
          goals={getGoalsForDate(selectedDate)}
          events={getEventsForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
