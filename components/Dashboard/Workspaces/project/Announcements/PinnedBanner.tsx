import {  timeAgo } from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/page";
import { Loader2, Pin, PinOff, Trash2 } from "lucide-react";
import { AuthorAvatar } from "./AuthorAvatar";
import { Announcement } from "@/types/announcement.types";

export function PinnedBanner({
  announcements,
  canManage,
  pinningId,
  deletingId,
  onTogglePin,
  onDelete,
  isArchived
}: {
  announcements: Announcement[];
  canManage: boolean;
  pinningId: string | null;
  deletingId: string | null;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  isArchived: boolean
}) {
  const pinned = announcements.filter((a) => a.isPinned);
  if (pinned.length === 0) return null;
 
  return (
    <div className="space-y-2">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <Pin size={12} className="text-amber-500 fill-amber-500" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Pinned
        </span>
      </div>
 
      {pinned.map((a) => (
        <div
          key={a.id}
          className="group relative rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 px-4 py-3.5 flex items-start gap-3"
        >
          {/* Left accent line */}
          <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-amber-400" />
 
          <AuthorAvatar author={a.createdBy} size="sm" />
 
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-foreground leading-tight truncate">
                {a.title}
              </p>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 shrink-0 font-medium">
                {timeAgo(a.createdAt)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
              {a.content}
            </p>
          </div>
 
          {canManage && !isArchived && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => onTogglePin(a.id)}
                disabled={pinningId === a.id}
                title="Unpin"
                className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-amber-600"
              >
                {pinningId === a.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <PinOff size={13} />
                )}
              </button>
              <button
                onClick={() => onDelete(a.id)}
                disabled={deletingId === a.id}
                title="Delete"
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors"
              >
                {deletingId === a.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}