import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLUMNS } from "@/hooks/useKanbanBoard";

interface MobileColumnNavigatorProps {
  currentColumnIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function MobileColumnNavigator({
  currentColumnIndex,
  onPrevious,
  onNext,
}: MobileColumnNavigatorProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <button
        onClick={onPrevious}
        disabled={currentColumnIndex === 0}
        className="p-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm font-medium">
        {COLUMNS[currentColumnIndex].title}
      </span>
      <button
        onClick={onNext}
        disabled={currentColumnIndex === COLUMNS.length - 1}
        className="p-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}