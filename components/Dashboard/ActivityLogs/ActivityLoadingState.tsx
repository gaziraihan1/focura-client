import { Loader2 } from "lucide-react";

export function ActivityLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading activities...</p>
    </div>
  );
}