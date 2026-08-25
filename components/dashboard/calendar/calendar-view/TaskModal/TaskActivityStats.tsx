import { MessageSquare } from "lucide-react";

interface TaskActivityStatsProps {
  commentsCount: number;
  subtasksCount: number;
  filesCount: number;
}

export function TaskActivityStats({
  commentsCount,
  subtasksCount,
  filesCount,
}: TaskActivityStatsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Activity</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 pl-6">
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-foreground">
            {commentsCount}
          </div>
          <div className="text-xs text-muted-foreground">Comments</div>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-foreground">
            {subtasksCount}
          </div>
          <div className="text-xs text-muted-foreground">Subtasks</div>
        </div>
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-foreground">
            {filesCount}
          </div>
          <div className="text-xs text-muted-foreground">Files</div>
        </div>
      </div>
    </div>
  );
}