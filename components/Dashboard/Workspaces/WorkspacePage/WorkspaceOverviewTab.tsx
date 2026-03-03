import { Loader2 } from "lucide-react";
import { TaskActivityList } from "@/components/Dashboard/TaskDetails/TaskActivityList";
import { useWorkspaceActivities } from "@/hooks/useActivity";
import WorkspaceInformation from "./WorkspaceInformation";
import WorkspaceStorageInfo from "./WorkspaceStorageInfo";
import { useState } from "react";

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
  const [limit, setLimit] = useState(3);
  const { data: activities = [], isLoading: activitiesLoading } = useWorkspaceActivities(
    workspaceId,
    { limit: limit + 1 }
  );
 const hasMore = activities.length > limit;
const visibleActivities = activities.slice(0, limit);

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
          <TaskActivityList activities={visibleActivities} />
        )}
        <div className="flex gap-4 justify-center pt-5 font-medium underline text-blue-500 opacity-80 text-sm">
          <button
  onClick={() => setLimit((prev) => prev + 9)}
  disabled={!hasMore}
  className={`p-2 ${!hasMore ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
>
  see more
</button>
        {
limit > 9 &&
        <button className="p-2 cursor-pointer" 
        onClick={() => setLimit(limit - 9)}
        >
          see less
        </button>
        }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <WorkspaceInformation name={owner.name} email={owner.email} createdAt={createdAt} isPublic={isPublic}  />

        <WorkspaceStorageInfo maxStorage={maxStorage} />
      </div>
    </div>
  );
}