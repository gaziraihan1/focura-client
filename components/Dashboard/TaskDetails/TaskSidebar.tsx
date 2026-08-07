import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, User, Folder, Check, Lock, Link2, Unlink2, MessageSquare, Sprout, Flag, Repeat } from "lucide-react";
import { Task } from "@/types/task.types";
import { getStatusColor, getPriorityColor } from "@/utils/task.utils";
import { Avatar } from "@/components/Shared/Avatar";
import Link from "next/link";
import { GitHubPrStatus } from "./TaskSidebar/GitHubPrStatus";
import { GitHubIssueLink } from "./TaskSidebar/GitHubIssueLink";
import { GitHubBranchLink } from "./TaskSidebar/GitHubBranchLink";
import { GitHubCommitLink } from "./TaskSidebar/GitHubCommitLink";
import { GitHubActionsStatus } from "./TaskSidebar/GitHubActionsStatus";
import { GitHubReleaseLink } from "./TaskSidebar/GitHubReleaseLink";
import { GitHubMilestoneLink } from "./TaskSidebar/GitHubMilestoneLink";
import { GitHubProjectLink } from "./TaskSidebar/GitHubProjectLink";
import { GitHubDiscussionLink } from "./TaskSidebar/GitHubDiscussionLink";
import { GitHubLabels } from "./TaskSidebar/GitHubLabels";
import { GitHubLinkModal } from "./GitHubLinkModal";
import { SlackMessageLink } from "./TaskSidebar/SlackMessageLink";
import { SlackLinkModal } from "./SlackLinkModal";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

interface TaskSidebarProps {
  task: Task;
  isPersonalTask: boolean;
  isUpdatingStatus: boolean;
  onStatusChange: (status: Task["status"]) => void;
  canChangeStatus?: boolean;
  onTaskUpdated?: () => void;
}

function pluralizeInterval(pattern: string, interval: number) {
  switch (pattern) {
    case "DAILY":   return interval === 1 ? "day" : "days";
    case "WEEKLY":  return interval === 1 ? "week" : "weeks";
    case "MONTHLY": return interval === 1 ? "month" : "months";
    default:        return "occurrences";
  }
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-card border border-border p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          
          {!canChangeStatus ? (
            <div>
              <div
                className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(
                  task.status
                )} font-medium text-center opacity-60 cursor-not-allowed`}
              >
                {task.status === "TODO" && "To Do"}
                {task.status === "IN_PROGRESS" && "In Progress"}
                {task.status === "IN_REVIEW" && "In Review"}
                {task.status === "BLOCKED" && "Blocked"}
                {task.status === "COMPLETED" && "Completed"}
                {task.status === "CANCELLED" && "Cancelled"}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock size={12} />
                <span>You don&apos;t have permission to change the status</span>
              </div>
            </div>
          ) : (
            <div>
              <select
                value={task.status}
                onChange={(e) =>
                  onStatusChange(e.target.value as Task["status"])
                }
                disabled={isUpdatingStatus}
                className={`w-full px-4 py-2 rounded-lg border ${getStatusColor(
                  task.status
                )} font-medium focus:ring-2 ring-primary outline-none disabled:opacity-50`}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                {!isPersonalTask && <option value="IN_REVIEW">In Review</option>}
                {!isPersonalTask && <option value="BLOCKED">Blocked</option>}
                <option value="COMPLETED">Completed</option>
                {!isPersonalTask && <option value="CANCELLED">Cancelled</option>}
              </select>
              {isPersonalTask && (
                <p className="text-xs text-muted-foreground mt-2">
                  Personal tasks support: To Do, In Progress, Completed
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Priority
          </label>
          <div
            className={`px-4 py-2 rounded-lg border ${getPriorityColor(
              task.priority
            )} font-medium text-center`}
          >
            {task.priority}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl bg-card border border-border p-6 space-y-4"
      >
        <h3 className="font-semibold text-foreground mb-4">Details</h3>

        {task.project && (
          <div className="flex items-center gap-3">
            <Folder size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Project</p>
              <Link className="font-medium" style={{color: task.project.color}} href={`/dashboard/workspaces/${task.project.workspace?.slug}/projects/${task.project.slug}`}>
              {task.project.name}
              </Link>
            </div>
          </div>
        )}

        {task.sprint && (
          <div className="flex items-center gap-3">
            <Sprout size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Sprint</p>
              <p className="text-sm font-medium text-foreground">{task.sprint.name}</p>
            </div>
          </div>
        )}

        {task.milestone && (
          <div className="flex items-center gap-3">
            <Flag size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Milestone</p>
              <p className="text-sm font-medium text-foreground">{task.milestone.title}</p>
            </div>
          </div>
        )}

        {task.recurrence && (
          <div className="flex items-center gap-3">
            <Repeat size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Repeats</p>
              <p className="text-sm font-medium text-foreground">
                {task.recurrence.pattern.charAt(0) +
                  task.recurrence.pattern.slice(1).toLowerCase()}
                {task.recurrence.interval > 1 &&
                  ` · every ${task.recurrence.interval} ${pluralizeInterval(
                    task.recurrence.pattern,
                    task.recurrence.interval,
                  )}`}
                {task.recurrence.endsAt &&
                  ` · until ${new Date(task.recurrence.endsAt).toLocaleDateString("en-US", { timeZone: "UTC" })}`}
              </p>
            </div>
          </div>
        )}

        {/* GitHub Links */}
        {task.githubPrUrl && task.githubPrNumber && task.githubPrStatus && (
          <GitHubPrStatus
            prUrl={task.githubPrUrl}
            prNumber={task.githubPrNumber}
            prStatus={task.githubPrStatus}
            prChecks={task.githubPrChecks}
          />
        )}

        {task.githubIssueUrl && task.githubIssueNumber && task.githubIssueState && (
          <GitHubIssueLink
            issueUrl={task.githubIssueUrl}
            issueNumber={task.githubIssueNumber}
            issueState={task.githubIssueState}
          />
        )}

        {task.githubBranchName && task.githubBranchUrl && (
          <GitHubBranchLink
            branchName={task.githubBranchName}
            branchUrl={task.githubBranchUrl}
            isProtected={task.githubBranchProtected ?? false}
          />
        )}

        {task.githubCommitSha && task.githubCommitUrl && (
          <GitHubCommitLink
            commitSha={task.githubCommitSha}
            commitUrl={task.githubCommitUrl}
            commitMessage={task.githubCommitMessage ?? undefined}
            commitAuthor={task.githubCommitAuthor ?? undefined}
          />
        )}

        {task.githubWorkflowStatus && task.githubWorkflowName && task.githubWorkflowUrl && (
          <GitHubActionsStatus
            workflowStatus={task.githubWorkflowStatus}
            workflowName={task.githubWorkflowName}
            workflowUrl={task.githubWorkflowUrl}
            workflowRunId={task.githubWorkflowRunId ?? undefined}
          />
        )}

        {task.githubReleaseName && task.githubReleaseUrl && (
          <GitHubReleaseLink
            releaseName={task.githubReleaseName}
            releaseUrl={task.githubReleaseUrl}
            releaseTagName={task.githubReleaseTagName ?? undefined}
          />
        )}

        {task.githubMilestoneTitle && task.githubMilestoneUrl && task.githubMilestoneState && (
          <GitHubMilestoneLink
            milestoneTitle={task.githubMilestoneTitle}
            milestoneUrl={task.githubMilestoneUrl}
            milestoneState={task.githubMilestoneState}
          />
        )}

        {task.githubProjectNumber && task.githubProjectUrl && task.githubProjectTitle && (
          <GitHubProjectLink
            projectNumber={task.githubProjectNumber}
            projectUrl={task.githubProjectUrl}
            projectTitle={task.githubProjectTitle}
          />
        )}

        {task.githubDiscussionNumber && task.githubDiscussionUrl && (
          <GitHubDiscussionLink
            discussionNumber={task.githubDiscussionNumber}
            discussionUrl={task.githubDiscussionUrl}
            discussionCategory={task.githubDiscussionCategory ?? undefined}
          />
        )}

        {task.githubLabels && task.githubLabels.length > 0 && (
          <GitHubLabels labels={task.githubLabels} />
        )}

        {task.estimatedHours && (
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Estimated Hours</p>
              <p className="text-sm font-medium text-foreground">
                {task.estimatedHours}h
              </p>
            </div>
          </div>
        )}

        {task.startDate && (
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(task.startDate).toLocaleDateString("en-US", { timeZone: "UTC" })}
              </p>
            </div>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(task.dueDate).toLocaleDateString("en-US", { timeZone: "UTC" })}
              </p>
            </div>
          </div>
        )}
          <div className="flex gap-2">
        {
          task.labels.map((l) => (
              <p key={l.id}>
{l.label.name}
              </p>
          ))
        }
        </div>
        <div className="flex items-center gap-3">
          <User size={16} className="text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Created By</p>
            <p className="text-sm font-medium text-foreground">
              {task.createdBy.name}
            </p>
          </div>
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-start gap-3">
            <User size={16} className="text-muted-foreground mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Assignees</p>
              <div className="space-y-2">
                {task.assignees.map((assignee) => (
                  <div
                    key={assignee.user.id}
                    className="flex items-center gap-2"
                  >
                    <Avatar name={assignee.user.name} image={assignee.user.image} size="sm" />
                    <span className="text-sm text-foreground">
                      {assignee.user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Clock size={14} />
            Created {new Date(task.createdAt).toLocaleDateString("en-US", { timeZone: "UTC" })}
          </div>
          {task.completedAt && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
              <Check size={14} />
              Completed {new Date(task.completedAt).toLocaleDateString("en-US", { timeZone: "UTC" })}
            </div>
          )}
        </div>

        {/* Slack Message Link */}
        {hasSlackLink && (
          <SlackMessageLink
            taskId={task.id}
            channelId={task.slackChannelId ?? null}
            messageTs={task.slackMessageTs ?? null}
            messageUrl={task.slackMessageUrl ?? null}
            userDisplayName={task.slackUserDisplayName ?? null}
            onUnlinked={onTaskUpdated}
          />
        )}

        {/* GitHub Link Button */}
        {hasGitHubLink ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/5 text-sm text-green-600 dark:text-green-400">
              <Link2 size={14} />
              GitHub Linked
            </div>
            <button
              onClick={handleUnlink}
              disabled={unlinking}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Remove GitHub link"
            >
              <Unlink2 size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLinkModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Link2 size={14} />
            Link GitHub
          </button>
        )}

        {/* Slack Link Button */}
        {!hasSlackLink && (
          <button
            onClick={() => setShowSlackLinkModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#4A154B]/30 dark:border-[#E01E5A]/30 text-sm text-[#4A154B] dark:text-[#E01E5A] hover:bg-[#4A154B]/5 dark:hover:bg-[#E01E5A]/5 transition-colors"
          >
            <MessageSquare size={14} />
            Link Slack Message
          </button>
        )}
      </motion.div>

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