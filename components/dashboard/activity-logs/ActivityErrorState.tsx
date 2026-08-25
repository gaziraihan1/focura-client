import { AlertCircle } from "lucide-react";

export function ActivityErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm font-medium text-destructive">
        Failed to load activities. Please try again.
      </p>
    </div>
  );
}