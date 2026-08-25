import { Zap } from "lucide-react";

export function FocusModeBar() {
  return (
    <div className="border-b border-border bg-muted/50 px-3 sm:px-4 lg:px-6 py-2">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Zap className="w-4 h-4 text-primary" />
        <span>Focus Mode: Showing only high-priority in-progress tasks</span>
      </div>
    </div>
  );
}