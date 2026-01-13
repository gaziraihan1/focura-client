interface TaskStatusPrioritySectionProps {
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "IN_REVIEW" | "BLOCKED" | "CANCELLED";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  onStatusChange: (status: "TODO" | "IN_PROGRESS" | "COMPLETED") => void;
  onPriorityChange: (priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW") => void;
}

export function TaskStatusPrioritySection({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: TaskStatusPrioritySectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={status}
          onChange={(e) =>
            onStatusChange(
              e.target.value as "TODO" | "IN_PROGRESS" | "COMPLETED"
            )
          }
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 ring-primary"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium mb-2">Priority</label>
        <div className="grid grid-cols-2 gap-2">
          {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onPriorityChange(level)}
              className={`px-3 py-2 rounded-lg border text-sm transition ${
                priority === level
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}