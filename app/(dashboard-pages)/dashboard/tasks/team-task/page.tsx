"use client";
import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import {
  TeamTaskFiltersBar,
  TeamTaskScope,
} from "@/components/Dashboard/TeamTask/TeamTaskFiltersBar";
import { Section } from "@/components/Dashboard/TeamTask/Section";
import { Stat } from "@/components/Dashboard/TeamTask/Stat";
import { TaskList } from "@/components/Dashboard/TeamTask/TaskList";
import { useTasks, useTaskStats } from "@/hooks/useTask";
import { useUserId } from "@/hooks/useUser";
import { getTaskTimeInfo } from "@/lib/task/time";

export default function TeamTasksPage({
  workspaceId,
}: {
  workspaceId?: string;
}) {
  // Get current user ID
  const userId = useUserId();
  
  // Fetch team/assigned tasks
  const { data: tasks = [], isLoading } = useTasks({
    type: "assigned",
    workspaceId,
  });
  
  // Get stats for assigned tasks only
  const { data: stats } = useTaskStats(workspaceId, "assigned");
  
  console.log("Team tasks:", tasks);
  console.log("Team stats:", stats);
  console.log("Current user ID:", userId);

  const [scope, setScope] = useState<TeamTaskScope>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);

  const filteredTasks = useMemo(() => {
    // If user not loaded yet, return all tasks
    if (!userId) return tasks;

    return tasks.filter((task) => {
      // Scope filtering
      if (scope === "assigned_to_me") {
        // Check if current user is in assignees
        if (!task.assignees.some((a) => a.user.id === userId)) return false;
      }
      
      if (scope === "i_assigned") {
        // Check if current user created the task
        if (task.createdBy.id !== userId) return false;
      }
      
      if (scope === "collaborative") {
        // Tasks with more than one assignee
        if (task.assignees.length <= 1) return false;
      }

      // Search filter
      if (
        search &&
        !task.title.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (status !== "all" && task.status !== status) {
        return false;
      }

      // Priority filter
      if (priority !== "all" && task.priority !== priority) {
        return false;
      }

      // Needs Attention filter
      if (attentionOnly) {
        const { isOverdue, isDueToday } = getTaskTimeInfo(task);
        if (
          !(
            task.status === "BLOCKED" ||
            isOverdue ||
            isDueToday
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, scope, search, status, priority, attentionOnly, userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          Team Tasks
        </h1>
        <p className="text-sm text-muted-foreground">
          {workspaceId 
            ? "Tasks assigned in this workspace" 
            : "Work that requires coordination and shared accountability"}
        </p>
      </div>

      {/* Stats - showing only assigned task stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Assigned" value={stats?.assigned ?? 0} />
        <Stat label="Overdue" value={stats?.overdue ?? 0} danger />
        <Stat label="Due Today" value={stats?.dueToday ?? 0} />
        <Stat label="In Progress" value={stats?.inProgress ?? 0} />
      </div>

      {/* Filters */}
      <TeamTaskFiltersBar
        scope={scope}
        onScopeChange={setScope}
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        attentionOnly={attentionOnly}
        onAttentionToggle={() => setAttentionOnly((v) => !v)}
      />

      {/* Results */}
      <Section
        title={
          scope === "assigned_to_me"
            ? "Assigned to Me"
            : scope === "i_assigned"
            ? "I Assigned"
            : scope === "collaborative"
            ? "Collaborative Tasks"
            : "All Team Tasks"
        }
        highlight={attentionOnly}
      >
        <TaskList 
          tasks={filteredTasks} 
          isLoading={isLoading || !userId} // Show loading if user not loaded
        />
      </Section>
    </div>
  );
}