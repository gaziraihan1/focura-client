"use client";

import dynamic from "next/dynamic";
import { CalendarHeader } from "@/components/Dashboard/CalendarView/CalendarHeader";
import { useCalendarPage } from "@/hooks/useCalendarPage";

const CalendarContent = dynamic(
  () => import("@/components/Dashboard/CalendarView/CalendarContent").then((m) => m.CalendarContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

const TaskDetailsModal = dynamic(
  () => import("@/components/Dashboard/CalendarView/TaskDetailsModal").then((m) => m.TaskDetailsModal),
  { ssr: false }
);

export default function CalendarPage() {
  const {
    currentDate, view, setView, selectedTask, showOnlyTimeBound,
    setShowOnlyTimeBound, filteredTasks, dateRange, isLoading,
    handlePrevious, handleNext, handleToday, handleTaskClick, handleCloseTaskModal,
  } = useCalendarPage();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        showOnlyTimeBound={showOnlyTimeBound}
        onToggleTimeBound={setShowOnlyTimeBound}
      />

      <CalendarContent
        currentDate={currentDate}
        view={view}
        tasks={filteredTasks}
        dateRange={dateRange}
        isLoading={isLoading}
        onTaskClick={handleTaskClick}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={handleCloseTaskModal}
        />
      )}
    </div>
  );
}
