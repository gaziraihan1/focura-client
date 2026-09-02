import { Activity, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ActivityPageHeaderProps {
  onRefresh: () => void;
  onClearAll: () => void;
}

export function ActivityPageHeader({
  onRefresh,
  onClearAll,
}: ActivityPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Activity Feed
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track all activities across your workspace
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>

        <Button
          variant="outline"
          onClick={onClearAll}
          className="gap-2 rounded-lg border border-destructive/30 bg-background px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>
    </div>
  );
}
