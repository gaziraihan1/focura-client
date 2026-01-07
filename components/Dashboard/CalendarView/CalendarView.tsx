"use client";

import { useState, useMemo } from "react";
import { Task } from "@/hooks/useTask";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Grid3x3,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDateClick?: (date: Date) => void;
  onCreateTask?: (date: Date) => void;
}

type ViewMode = "month" | "agenda";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STATUS_COLORS = {
  TODO: "bg-gray-500/20 border-gray-500/40 text-gray-700 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300",
  IN_REVIEW: "bg-purple-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300",
  BLOCKED: "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300",
  COMPLETED: "bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-300",
  CANCELLED: "bg-gray-500/20 border-gray-500/40 text-gray-700 dark:text-gray-300",
};

const PRIORITY_INDICATORS = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-blue-500",
  LOW: "bg-green-500",
};

export function CalendarView({
  tasks,
  onTaskClick,
  onDateClick,
  onCreateTask,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get calendar data
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, Task[]>();

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      const date = new Date(task.dueDate);
      const dateKey = date.toISOString().split("T")[0];

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(task);
    });

    grouped.forEach((tasks) => {
      tasks.sort((a, b) => {
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });

    return grouped;
  }, [tasks]);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    const dateKey = date.toISOString().split("T")[0];
    return tasksByDate.get(dateKey) || [];
  };

  // Agenda view - next 7 days with tasks
  const agendaTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const agenda: { date: Date; tasks: Task[] }[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayTasks = getTasksForDate(date);
      agenda.push({ date, tasks: dayTasks });
    }

    return agenda;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksByDate]);

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const handleCreateTask = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateTask?.(date);
  };

  return (
    <div className="space-y-4">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Title and Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-foreground">
            <span className="hidden sm:inline">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <span className="sm:hidden">
              {MONTHS_SHORT[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </h2>
        </div>

        {/* Controls - Responsive */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground transition text-xs sm:text-sm font-medium"
          >
            Today
          </button>

          {/* View Mode Toggle - Responsive */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
            <button
              onClick={() => setViewMode("month")}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === "month"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Month view"
            >
              <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === "agenda"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Agenda view"
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Agenda View for Mobile */}
      {viewMode === "agenda" && (
        <div className="space-y-3">
          {agendaTasks.map(({ date, tasks: dayTasks }) => (
            <div
              key={date.toISOString()}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                  {isToday(date) && (
                    <span className="text-xs text-primary font-medium">Today</span>
                  )}
                </div>
                <button
                  onClick={(e) => handleCreateTask(date, e)}
                  className="p-1.5 rounded-lg hover:bg-accent transition"
                  aria-label="Add task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {dayTasks.length > 0 ? (
                <div className="space-y-2">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className={`p-3 rounded-lg border cursor-pointer transition hover:shadow-sm ${
                        STATUS_COLORS[task.status]
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-1 h-full rounded ${
                            PRIORITY_INDICATORS[task.priority]
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="capitalize">
                              {task.status.replace("_", " ").toLowerCase()}
                            </span>
                            <span>•</span>
                            <span>{task.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks scheduled
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Calendar Grid - Month View */}
      {viewMode === "month" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Day Headers - Responsive */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/50">
            {DAYS.map((day, index) => (
              <div
                key={day}
                className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-muted-foreground"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{DAYS_SHORT[index]}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days - Responsive */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const isCurrentDay = isToday(date);
              const isInMonth = isCurrentMonth(date);
              const isDateSelected = isSelected(date);
              const taskCount = dayTasks.length;

              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.005 }}
                  onClick={() => handleDateClick(date)}
                  className={`min-h-[60px] sm:min-h-[100px] lg:min-h-[120px] p-1 sm:p-2 border-b border-r border-border cursor-pointer transition hover:bg-accent/5 ${
                    !isInMonth ? "bg-muted/20" : ""
                  } ${isDateSelected ? "bg-primary/5 ring-2 ring-primary/20" : ""}`}
                >
                  {/* Date Number - Responsive */}
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span
                      className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-medium transition ${
                        isCurrentDay
                          ? "bg-primary text-primary-foreground"
                          : isInMonth
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    {/* Task Count Badge - Mobile */}
                    {taskCount > 0 && (
                      <span className="sm:hidden flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {taskCount}
                      </span>
                    )}

                    {/* Add Task Button - Desktop Only */}
                    {isInMonth && (
                      <button
                        onClick={(e) => handleCreateTask(date, e)}
                        className="hidden sm:block opacity-0 hover:opacity-100 transition p-1 rounded hover:bg-accent"
                        aria-label="Add task"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Tasks - Desktop Only */}
                  <div className="hidden sm:block space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick?.(task);
                        }}
                        className={`group relative px-2 py-1 rounded border text-xs font-medium cursor-pointer hover:shadow-sm transition ${
                          STATUS_COLORS[task.status]
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l ${
                            PRIORITY_INDICATORS[task.priority]
                          }`}
                        />
                        <div className="flex items-center gap-1 pl-2">
                          <span className="truncate flex-1">{task.title}</span>
                        </div>
                      </motion.div>
                    ))}

                    {dayTasks.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDateClick(date);
                        }}
                        className="w-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition"
                      >
                        +{dayTasks.length - 2} more
                      </button>
                    )}
                  </div>

                  {/* Task Dots - Mobile Only */}
                  <div className="sm:hidden flex gap-1 flex-wrap">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          PRIORITY_INDICATORS[task.priority]
                        }`}
                        title={task.title}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Date Panel - Responsive */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-xl border border-border bg-card p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                <span className="hidden sm:inline">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="sm:hidden">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-muted-foreground hover:text-foreground transition p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {getTasksForDate(selectedDate).length > 0 ? (
                getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className="p-3 rounded-lg border border-border hover:bg-accent/5 cursor-pointer transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[task.status]
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          PRIORITY_INDICATORS[task.priority]
                        }`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No tasks scheduled for this day
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}