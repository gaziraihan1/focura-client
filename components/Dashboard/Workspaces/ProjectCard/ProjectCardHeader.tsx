import { MoreVertical } from "lucide-react";

interface ProjectCardHeaderProps {
  name: string;
  color: string;
  icon?: string | null;
  status: string;
  priority: string;
}

const statusColors: Record<string, string> = {
  PLANNING: "bg-gray-500/10 text-gray-500",
  ACTIVE: "bg-green-500/10 text-green-500",
  ON_HOLD: "bg-yellow-500/10 text-yellow-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
  ARCHIVED: "bg-gray-500/10 text-gray-500",
};

const priorityColors: Record<string, string> = {
  URGENT: "text-red-500",
  HIGH: "text-orange-500",
  MEDIUM: "text-yellow-500",
  LOW: "text-green-500",
};

export function ProjectCardHeader({
  name,
  color,
  icon,
  status,
  priority,
}: ProjectCardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {icon || name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition truncate">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                statusColors[status] || statusColors.PLANNING
              }`}
            >
              {status.replace("_", " ")}
            </span>
            <span className={`text-xs font-medium ${priorityColors[priority]}`}>
              {priority}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          // Add menu logic here
        }}
        className="p-1.5 rounded-lg hover:bg-accent transition shrink-0"
      >
        <MoreVertical size={16} className="text-muted-foreground" />
      </button>
    </div>
  );
}