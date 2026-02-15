// components/Tasks/CreateTaskModal/TaskAssigneePicker.tsx
import { ProjectMember } from "@/types/taskForm.types";
import { Users } from "lucide-react";
import Image from "next/image";

interface TaskAssigneePickerProps {
  projectMembers: ProjectMember[];
  selectedUserIds: string[];
  onToggle: (userId: string) => void;
}

export function TaskAssigneePicker({
  projectMembers,
  selectedUserIds,
  onToggle,
}: TaskAssigneePickerProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        <Users size={16} className="inline mr-1" />
        Assign Members
      </label>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {projectMembers.map((member) => {
          const isSelected = selectedUserIds.includes(member.userId);

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onToggle(member.userId)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                isSelected
                  ? "bg-primary/10 border-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              {member.user.image ? (
                <Image
                  src={member.user.image}
                  alt={member.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left flex-1">
                <p className="text-sm font-medium">{member.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-primary-foreground"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}