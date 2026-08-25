"use client";

import Link from "next/link";
import type { Task } from "@/hooks/useTask";

/** Basic card — original source: components/Tasks/TaskCard.tsx */
export function SimpleTaskCard({
  task,
  cardHref,
  showProject = true,
  className = "",
}: {
  task: Task;
  cardHref: string;
  showProject?: boolean;
  className?: string;
}) {
  return (
    <div className={`border rounded-xl p-4 shadow hover:shadow-md transition ${className}`}>
      <p className="text-xs font-medium text-gray-500">{task.status}</p>
      <h3 className="text-lg font-semibold mt-1">{task.title}</h3>
      {task.project && showProject && (
        <span
          className="inline-block text-xs px-2 py-1 rounded mt-2"
          style={{ backgroundColor: task.project.color + "20" }}
        >
          {task.project.name}
        </span>
      )}
      <p className="text-xs mt-3">
        Priority: <b>{task.priority}</b>
      </p>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs">
          Due:{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </p>
        <Link
          href={cardHref}
          className="text-blue-600 text-sm font-medium"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
