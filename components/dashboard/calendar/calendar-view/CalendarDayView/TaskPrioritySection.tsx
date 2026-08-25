import { Task } from "@/hooks/useTask";
import { AlertCircle, Flag } from "lucide-react";
import DetailedTaskCard from "../DetailedTaskCard";

type Priority = "overdue" | "urgent" | "high" | "medium" | "low";

interface TaskPrioritySectionProps {
  priority: Priority;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const priorityConfig = {
  overdue: {
    title: "Overdue",
    color: "text-destructive",
    icon: AlertCircle,
  },
  urgent: {
    title: "Urgent",
    color: "text-red-600",
    icon: Flag,
  },
  high: {
    title: "High Priority",
    color: "text-orange-600",
    icon: null,
  },
  medium: {
    title: "Medium Priority",
    color: "text-blue-600",
    icon: null,
  },
  low: {
    title: "Low Priority",
    color: "text-gray-600",
    icon: null,
  },
};

export function TaskPrioritySection({
  priority,
  tasks,
  onTaskClick,
}: TaskPrioritySectionProps) {
  if (tasks.length === 0) return null;

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div className="mb-6">
      <h3
        className={`text-lg font-semibold mb-3 flex items-center gap-2 ${config.color}`}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {config.title} ({tasks.length})
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <DetailedTaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            variant={priority}
          />
        ))}
      </div>
    </div>
  );
}
