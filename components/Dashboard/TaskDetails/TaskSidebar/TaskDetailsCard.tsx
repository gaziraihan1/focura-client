import { Clock, Calendar, User, Folder, Link2, Unlink2, MessageSquare, Sprout, Flag, Repeat, Pencil, Check } from "lucide-react";
import { Task } from "@/types/task.types";
import { Avatar } from "@/components/Shared/Avatar";
import Link from "next/link";
import { GitHubPrStatus } from "./GitHubPrStatus";
import { GitHubIssueLink } from "./GitHubIssueLink";
import { GitHubBranchLink } from "./GitHubBranchLink";
import { GitHubCommitLink } from "./GitHubCommitLink";
import { GitHubActionsStatus } from "./GitHubActionsStatus";
import { GitHubReleaseLink } from "./GitHubReleaseLink";
import { GitHubMilestoneLink } from "./GitHubMilestoneLink";
import { GitHubProjectLink } from "./GitHubProjectLink";
import { GitHubDiscussionLink } from "./GitHubDiscussionLink";
import { GitHubLabels } from "./GitHubLabels";
import { SlackMessageLink } from "./SlackMessageLink";

function pluralizeInterval(pattern: string, interval: number) {
  switch (pattern) {
    case "DAILY":   return interval === 1 ? "day" : "days";
    case "WEEKLY":  return interval === 1 ? "week" : "weeks";
    case "MONTHLY": return interval === 1 ? "month" : "months";
    default:        return "occurrences";
  }
}

interface TaskDetailsCardProps {
  task: Task;
  hasGitHubLink: boolean;
  hasSlackLink: boolean;
  unlinking: boolean;
  onTaskUpdated?: () => void;
  onUnlink: () => void;
  onOpenGitHubModal: () => void;
  onOpenSlackModal: () => void;
}

export function TaskDetailsCard({
  task,
  hasGitHubLink,
  hasSlackLink,
  unlinking,
  onTaskUpdated,
  onUnlink,
  onOpenGitHubModal,
  onOpenSlackModal,
}: TaskDetailsCardProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4">
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
        {task.editedBy && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
            <Pencil size={14} />
            Last edited by {task.editedBy.name} · {new Date(task.updatedAt).toLocaleDateString("en-US", { timeZone: "UTC" })}
          </div>
        )}
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
            onClick={onUnlink}
            disabled={unlinking}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Remove GitHub link"
          >
            <Unlink2 size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenGitHubModal}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Link2 size={14} />
          Link GitHub
        </button>
      )}

      {/* Slack Link Button */}
      {!hasSlackLink && (
        <button
          onClick={onOpenSlackModal}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#4A154B]/30 dark:border-[#E01E5A]/30 text-sm text-[#4A154B] dark:text-[#E01E5A] hover:bg-[#4A154B]/5 dark:hover:bg-[#E01E5A]/5 transition-colors"
        >
          <MessageSquare size={14} />
          Link Slack Message
        </button>
      )}
    </div>
  );
}
