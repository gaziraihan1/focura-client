"use client";

import React, { useState, useMemo } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays
} from 'date-fns';
import { Task, useTasks } from '@/hooks/useTask';
import { CalendarHeader } from '@/components/Dashboard/CalendarView/CalendarHeader';
import { CalendarGrid } from '@/components/Dashboard/CalendarView/CalendarGrid';
import { ResponsiveSidebar } from '@/components/Dashboard/CalendarView/ResponsiveSidebar';
import { TaskDetailsModal } from '@/components/Dashboard/CalendarView/TaskDetailsModal';

type CalendarView = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showOnlyTimeBound, setShowOnlyTimeBound] = useState(true);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useTasks();

  // Filter tasks to only show time-bound ones if enabled
  const filteredTasks = useMemo(() => {
    if (!showOnlyTimeBound) return tasks;
    return tasks.filter(task => task.dueDate || task.startDate);
  }, [tasks, showOnlyTimeBound]);

  // Calculate date range based on view
  const dateRange = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return { start, end };
  }, [currentDate]);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            tasks={filteredTasks}
            dateRange={dateRange}
            onTaskClick={setSelectedTask}
            isLoading={isLoading}
          />
        </div>

        {/* Responsive Sidebar */}
        <ResponsiveSidebar
          currentDate={currentDate}
          tasks={filteredTasks}
          onTaskClick={setSelectedTask}
        />
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}