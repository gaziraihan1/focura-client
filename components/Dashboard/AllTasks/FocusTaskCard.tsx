"use client";

// Migrated to use UnifiedTaskCard for consistency
// TODO: Eventually remove this file and update imports to use UnifiedTaskCard directly
import { UnifiedTaskCard } from "@/components/Tasks/UnifiedTaskCard";
import { FocusTaskCardProps } from "@/types/focusTask.types";
import { useFocusTimeRemaining } from "@/hooks/useFocusTimeRemaining";

export function FocusTaskCard({ task, timeRemaining: timeRemainingProp }: FocusTaskCardProps) {
  const liveTimeRemaining = useFocusTimeRemaining();
  const timeRemaining = timeRemainingProp ?? liveTimeRemaining;
  
  return (
    <UnifiedTaskCard 
      task={task} 
      variant="focus"
      timeRemaining={timeRemaining}
      enableAnimation={true}
    />
  );
}