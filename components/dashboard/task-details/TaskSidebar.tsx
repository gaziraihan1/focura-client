import { useRef, useState } from "react";
import { Task } from "@/types/task.types";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { GitHubLinkModal } from "./GitHubLinkModal";
import { SlackLinkModal } from "./SlackLinkModal";
import { StatusPriorityCard } from "./TaskSidebar/StatusPriorityCard";
import { TaskDetailsCard } from "./TaskSidebar/TaskDetailsCard";

interface TaskSidebarProps {
  task: Task;
  isPersonalTask: boolean;
  isUpdatingStatus: boolean;
  onStatusChange: (status: Task["status"]) => void;
  canChangeStatus?: boolean;
  onTaskUpdated?: () => void;
}

export const TaskSidebar = ({
  task,
  isPersonalTask,
  isUpdatingStatus,
  onStatusChange,
  canChangeStatus = true,
  onTaskUpdated,
}: TaskSidebarProps) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSlackLinkModal, setShowSlackLinkModal] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const unlinkingRef = useRef(false);

  // Check if any GitHub entity is linked
  const hasGitHubLink =
    task.githubPrUrl ||
    task.githubIssueUrl ||
    task.githubBranchName ||
    task.githubCommitSha;

  // Check if Slack message is linked
  const hasSlackLink = !!(task.slackChannelId && task.slackMessageTs);

  const handleUnlink = async () => {
    if (unlinkingRef.current) return;
    unlinkingRef.current = true;
    setUnlinking(true);
    try {
      await api.put(`/api/v1/tasks/${task.id}/github-unlink`);
      toast.success("GitHub link removed");
      onTaskUpdated?.();
    } catch {
      toast.error("Failed to remove GitHub link");
    } finally {
      unlinkingRef.current = false;
      setUnlinking(false);
    }
  };

  return (
    <div className="space-y-6">
      <StatusPriorityCard
        task={task}
        isPersonalTask={isPersonalTask}
        isUpdatingStatus={isUpdatingStatus}
        onStatusChange={onStatusChange}
        canChangeStatus={canChangeStatus}
      />

      <TaskDetailsCard
        task={task}
        hasGitHubLink={!!hasGitHubLink}
        hasSlackLink={hasSlackLink}
        unlinking={unlinking}
        onTaskUpdated={onTaskUpdated}
        onUnlink={handleUnlink}
        onOpenGitHubModal={() => setShowLinkModal(true)}
        onOpenSlackModal={() => setShowSlackLinkModal(true)}
      />

      {/* GitHub Link Modal */}
      {showLinkModal && (
        <GitHubLinkModal
          taskId={task.id}
          onClose={() => setShowLinkModal(false)}
          onLinked={() => {
            setShowLinkModal(false);
            onTaskUpdated?.();
          }}
        />
      )}

      {/* Slack Link Modal */}
      {showSlackLinkModal && (
        <SlackLinkModal
          taskId={task.id}
          onClose={() => setShowSlackLinkModal(false)}
          onLinked={() => {
            setShowSlackLinkModal(false);
            onTaskUpdated?.();
          }}
        />
      )}
    </div>
  );
};
