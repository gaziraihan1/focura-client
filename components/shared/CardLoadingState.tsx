import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardLoadingStateProps {
  className?: string;
  message?: string;
}

export function CardLoadingState({ className, message }: CardLoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
