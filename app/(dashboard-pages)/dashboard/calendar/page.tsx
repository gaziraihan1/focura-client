// app/calendar/page.tsx
'use client';

import { CalendarHeader } from '@/components/Dashboard/Calendar/CalendarHeader';
import { CalendarInsightsBar } from '@/components/Dashboard/Calendar/CalendarInsightsBar';
import { CalendarGrid } from '@/components/Dashboard/Calendar/CalendarGrid';
import { CalendarLegend } from '@/components/Dashboard/Calendar/CalendarLegend';
import { LoadingState } from '@/components/Dashboard/Calendar/LoadingStateCalendar';
import { DayDetailsPanel } from '@/components/Dashboard/Calendar/DayDetailsPanel';
import { useMainCalendarPage } from '@/hooks/useCalendarPage';

export default function CalendarPage() {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {/* Insights Bar */}
      <CalendarInsightsBar insights={insights} />

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Calendar Grid */}
      {!loading && (
        <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-8">
          <CalendarGrid
            calendarDays={calendarDays}
            getAggregateForDate={getAggregateForDate}
            getGoalsForDate={getGoalsForDate}
            isToday={isToday}
            isCurrentMonth={isCurrentMonth}
            onDateClick={setSelectedDate}
          />

          {/* Legend */}
          <CalendarLegend />
        </div>
      )}

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