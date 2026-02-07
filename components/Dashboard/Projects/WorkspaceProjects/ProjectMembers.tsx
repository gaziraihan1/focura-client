import { ProjectMember } from "@/hooks/useProjects";
import { Crown } from "lucide-react";
import React from "react";

interface ProjectMemberProps {
  members: ProjectMember[];
}

export default function ProjectMembers({ members }: ProjectMemberProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {members.slice(0, 3).map((member) => (
        <span
          key={member.user?.id || member.userId}
          className="px-2 py-1 rounded-full bg-muted text-foreground flex items-center gap-1 text-xs"
        >
          {member.role === "MANAGER" && (
            <Crown size={12} className="text-yellow-500" />
          )}
          {member.user?.name || "Unknown"}
        </span>
      ))}
      {members.length > 3 && (
        <span className="px-2 py-1 rounded-full bg-muted text-foreground text-xs">
          +{members.length - 3} more
        </span>
      )}
    </div>
  );
}
