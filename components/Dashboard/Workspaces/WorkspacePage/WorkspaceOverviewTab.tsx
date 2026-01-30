import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { TaskActivityList } from "@/components/Dashboard/TaskDetails/TaskActivityList";
import { useWorkspaceActivities } from "@/hooks/useActivity";

interface WorkspaceOverviewTabProps {
  workspaceId: string;
  owner: {
    name: string | null;
    email?: string;
  };
  createdAt: string;
  isPublic: boolean;
  maxStorage: number;
}

export function WorkspaceOverviewTab({
  workspaceId,
  owner,
  createdAt,
  isPublic,
  maxStorage,
}: WorkspaceOverviewTabProps) {
  const { data: activities = [], isLoading: activitiesLoading } = useWorkspaceActivities(
    workspaceId,
    { limit: 10 }
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Recent Activity
        </h3>
        
        {activitiesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <TaskActivityList activities={activities} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Information
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Owner</span>
              <span className="text-xs sm:text-sm text-foreground font-medium truncate max-w-[60%] text-right">
                {owner.name || owner.email}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Created</span>
              <span className="text-xs sm:text-sm text-foreground font-medium">
                {format(new Date(createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground">Visibility</span>
              <span className="text-xs sm:text-sm text-foreground font-medium">
                {isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-card border border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Storage
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Used Storage</span>
                <span className="text-xs sm:text-sm text-foreground font-medium">
                  0 MB / {maxStorage} MB
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}