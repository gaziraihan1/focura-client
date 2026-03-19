"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Lock, X, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskComment } from "@/types/task.types";
import MentionTextarea, {
} from "./MentionTextarea";
import Image from "next/image";
import { MentionTextareaHandle, MentionUser } from "@/types/comment.types";

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
  mentionableUsers = [],
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
    <div className="space-y-2">
      {/* Reply context banner */}
      {replyingTo && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "flex items-center justify-between gap-2",
            "px-3 py-2 rounded-lg bg-primary/5 border border-primary/20"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <CornerDownRight className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground">
              Replying to{" "}
              <span className="font-semibold text-foreground">
                {replyingTo.user.name}
              </span>
            </span>
            <span className="text-xs text-muted-foreground/60 truncate max-w-40 hidden sm:block">
              — {replyingTo.content.slice(0, 60)}
              {replyingTo.content.length > 60 ? "…" : ""}
            </span>
          </div>
          <button
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
          className="w-8 h-8 rounded-full shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
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
                : "Add a comment… (@ to mention)"
            }
            mentionableUsers={mentionableUsers}
            disabled={loading}
            autoFocus={autoFocus}
            minRows={replyingTo ? 2 : 3}
          />

          <div className="flex items-center justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSubmit}
              disabled={!value.trim() || loading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-all duration-150",
                "disabled:opacity-40 disabled:cursor-not-allowed",
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
  );
};