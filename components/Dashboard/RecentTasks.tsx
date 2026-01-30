import { RecentTask } from "@/types/dashboard";
import { FolderOpen, Calendar } from "lucide-react";

interface RecentTasksProps {
  tasks: RecentTask[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <div className="lg:col-span-2 bg-card border rounded-xl p-6">
      <header className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Recent Tasks</h2>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </header>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 border rounded-lg hover:bg-accent/50"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex gap-1 items-center">
                    <FolderOpen size={14} /> {task.project}
                  </span>
                  <span className="flex gap-1 items-center">
                    <Calendar size={14} /> {task.dueDate}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <PriorityBadge priority={task.priority} />
                <p className="text-xs text-muted-foreground mt-1">
                  {task.assignee}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: RecentTask["priority"] }) {
  const styles = {
    High: "bg-red-500/10 text-red-500",
    Medium: "bg-orange-500/10 text-orange-500",
    Low: "bg-green-500/10 text-green-500",
  }[priority];

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles}`}>
      {priority}
    </span>
  );
}
