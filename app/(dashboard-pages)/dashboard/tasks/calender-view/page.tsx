"use client";

import { CalendarHeader } from "@/components/Dashboard/CalendarView/CalendarHeader";
import { CalendarContent } from "@/components/Dashboard/CalendarView/CalendarContent";
import { TaskDetailsModal } from "@/components/Dashboard/CalendarView/TaskDetailsModal";
import { useCalendarPage } from "@/hooks/useCalendarPage";

export default function CalendarPage() {
  const {
    currentDate,
    view,
    setView,
    selectedTask,
    showOnlyTimeBound,
    setShowOnlyTimeBound,
    filteredTasks,
    dateRange,
    isLoading,
    handlePrevious,
    handleNext,
    handleToday,
    handleTaskClick,
    handleCloseTaskModal,
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