import { motion } from "framer-motion";
import { Task } from "@/hooks/useTask";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  workspaceSlug: string;
}

export function TaskList({ tasks, workspaceSlug }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
        >
          <TaskCard task={task} workspaceSlug={workspaceSlug} />
        </motion.div>
      ))}
    </div>
  );
}