import { Tag } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Member {
  id: string;
  name: string;
}

interface FilterPanelProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  selectedAssignee: string;
  onAssigneeChange: (assignee: string) => void;
  selectedLabels: string[];
  onToggleLabel: (labelId: string) => void;
  projects: Project[];
  labels: Label[];
  members: Member[];
}

export function FilterPanel({
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedProject,
  onProjectChange,
  selectedAssignee,
  onAssigneeChange,
  selectedLabels,
  onToggleLabel,
  projects,
  labels,
  members,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="all">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="BLOCKED">Blocked</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Priority
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="all">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => onProjectChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Assignee
          </label>
          <select
            value={selectedAssignee}
            onChange={(e) => onAssigneeChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="all">All Assignees</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Labels Filter */}
      {labels.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Tag size={16} className="inline mr-2" />
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <button
                key={label.id}
                onClick={() => onToggleLabel(label.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedLabels.includes(label.id)
                    ? "opacity-100 ring-2 ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                  border: `1px solid ${label.color}40`,
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}