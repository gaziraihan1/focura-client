import { FolderKanban, Users } from 'lucide-react';
import React from 'react'

interface ProjectStatsCountProps {
    taskCount: number;
    memberCount: number;
}

export default function ProjectStatsCount({taskCount, memberCount}: ProjectStatsCountProps) {
  return (
    <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <FolderKanban size={16} />
            <span className="font-medium text-foreground">{taskCount}</span>
            <span className="text-muted-foreground">
              {taskCount === 1 ? "task" : "tasks"}
            </span>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Users size={16} />
            <span className="font-medium text-foreground">{memberCount}</span>
            <span className="text-muted-foreground">
              {memberCount === 1 ? "member" : "members"}
            </span>
          </span>
        </div>
  )
}
