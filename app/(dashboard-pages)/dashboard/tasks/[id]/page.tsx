"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useTaskDetailsController } from "@/hooks/useTaskDetailsController";
import TaskEmpty from "@/components/Dashboard/TaskDetails/TaskEmpty";
import TaskDetailsPermission from "@/components/Dashboard/TaskDetails/TaskDetailsPermission";
import TaskDetailsView from "@/components/Dashboard/TaskDetails/TaskDetailsView";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const controller = useTaskDetailsController(id as string);

  if (controller.taskQuery.isLoading || controller.permissions.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!controller.task) return <TaskEmpty />;
  if (!controller.permissions.canView) return <TaskDetailsPermission />;

  return <TaskDetailsView {...controller} task={controller.task} id={id as string} />;
}
