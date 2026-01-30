import React, { useState } from 'react';
import { X, Menu, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/hooks/useTask';
import { CalendarSidebar } from './CalendarSidebar';

interface ResponsiveSidebarProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function ResponsiveSidebar({
  currentDate,
  tasks,
  onTaskClick,
}: ResponsiveSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-0 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'bg-card border-l border-border overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:w-80',
          'fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm z-50',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="lg:hidden sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Time Overview</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CalendarSidebar
          currentDate={currentDate}
          tasks={tasks}
          onTaskClick={(task) => {
            onTaskClick(task);
            setIsOpen(false); // Close sidebar on mobile after clicking task
          }}
        />
      </aside>
    </>
  );
}