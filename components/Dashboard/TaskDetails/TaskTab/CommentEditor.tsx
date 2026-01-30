import { Send, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { Task } from "@/types/task.types";

interface CommentEditorProps {
  task: Task;
  canComment: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  userImage?: string | null;
}

export const CommentEditor = ({
  task,
  canComment,
  value,
  onChange,
  onSubmit,
  loading,
  userImage,
}: CommentEditorProps) => {
  if (!canComment) {
    return (
      <div className="rounded-lg bg-muted/50 border border-border p-4 flex items-center gap-3">
        <Lock size={16} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to comment on this task
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
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

      <div className="flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border resize-none focus:ring-2 ring-primary outline-none"
        />

        <button
          onClick={onSubmit}
          disabled={!value.trim() || loading}
          className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Comment
        </button>
      </div>
    </div>
  );
};
