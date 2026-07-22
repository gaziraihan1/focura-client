import { Calendar as CalendarIcon } from "lucide-react";
import { EmptyState as SharedEmptyState } from '@/components/Shared/EmptyState';

export function DayViewEmptyState() {
  return (
    <SharedEmptyState
      icon={CalendarIcon}
      title="No tasks scheduled"
      description="You have a free day! Enjoy your time or add some tasks."
    />
  );
}
