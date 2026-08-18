"use client";

import { useRef } from "react";
import { m as motion } from "framer-motion";
import { Send, Loader2, Lock, X, CornerDownRight, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskComment } from "@/types/task.types";
import MentionTextarea from "./MentionTextarea";
import Image from "next/image";
import { MentionTextareaHandle, MentionUser } from "@/types/comment.types";
import { AiCommentAssist } from "@/components/AI/AiCommentAssist";

// Module-scope default so prop comparisons stay stable across renders.
const NO_MENTIONABLE_USERS: MentionUser[] = [];

interface CommentEditorProps {
  task: Task;
  canComment: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  userImage?: string | null;
  currentUserName?: string;
  mentionableUsers?: MentionUser[];
  // Reply context
  replyingTo?: TaskComment | null;
  onCancelReply?: () => void;
  autoFocus?: boolean;
}

export const CommentEditor = ({
  task,
  canComment,
  value,
  onChange,
  onSubmit,
  loading,
  userImage,
  mentionableUsers = NO_MENTIONABLE_USERS,
  replyingTo,
  onCancelReply,
  autoFocus,
}: CommentEditorProps) => {
  const textareaRef = useRef<MentionTextareaHandle>(null);

  if (!canComment) {
    return (
      <div className="rounded-xl bg-muted/40 border border-border/60 p-4 flex items-center gap-3">
        <Lock size={15} className="text-muted-foreground shrink-0" />
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to comment on this task
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* Reply context banner — shows quoted preview */}
      {replyingTo && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "flex items-start justify-between gap-2",
            "px-3.5 py-2.5 rounded-lg bg-primary/5 border border-primary/20"
          )}
        >
          <div className="flex items-start gap-2 min-w-0">
            <CornerDownRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground">
                Replying to{" "}
                <span className="font-semibold text-foreground">
                  {replyingTo.user.name}
                </span>
              </span>
              {/* Quote preview of original comment */}
              <div className="mt-1 pl-2.5 border-l-2 border-primary/20 text-xs text-muted-foreground/70 line-clamp-2">
                {replyingTo.content.slice(0, 120)}
                {replyingTo.content.length > 120 ? "…" : ""}
              </div>
            </div>
          </div>
          <button
            aria-label="Cancel reply"
            onClick={onCancelReply}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Editor row */}
      <div className="flex gap-3 items-start">
        {userImage ? (
          <Image
            src={userImage}
            alt="User avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full shrink-0 ring-2 ring-background"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0 ring-2 ring-background">
            {task.createdBy.name.charAt(0)}
          </div>
        )}

        <div className="flex-1 space-y-2">
          <MentionTextarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo.user.name}…`
                : "Write a comment… (@ to mention)"
            }
            mentionableUsers={mentionableUsers}
            disabled={loading}
            autoFocus={autoFocus}
            minRows={replyingTo ? 2 : 3}
          />

          <div className="flex items-center justify-between gap-2">
            <AiCommentAssist
              text={value}
              workspaceId={task.project?.workspace?.id ?? null}
              onAssist={onChange}
            />
            <div className="flex items-center gap-2">
              {/* Keyboard shortcut hint */}
              <span className="text-[10px] text-muted-foreground/40 select-none hidden sm:inline">
                <kbd className="px-1 py-0.5 rounded bg-muted/80 text-[9px] font-mono">⌘</kbd>
                {" + "}
                <kbd className="px-1 py-0.5 rounded bg-muted/80 text-[9px] font-mono">↵</kbd>
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onSubmit}
                disabled={!value.trim() || loading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 active:bg-primary/80 transition-all duration-150",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary",
                  "shadow-sm shadow-primary/20"
                )}
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {replyingTo ? "Reply" : "Comment"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
