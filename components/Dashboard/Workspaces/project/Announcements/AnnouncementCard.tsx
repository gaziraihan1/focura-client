import { formatFullDate, timeAgo } from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/page";
import { Globe, Loader2, Lock, Pin, Pencil, Trash2, User, Megaphone, ArrowRight } from "lucide-react";
import { AuthorAvatar } from "./AuthorAvatar";
import { stripTokens } from "@/utils/announcement.utils";
import { Announcement } from "@/types/announcement.types";

export function AnnouncementCard({
  announcement: a,
  canManage,
  pinningId,
  deletingId,
  onTogglePin,
  onDelete,
  onOpen,
  onEdit,
  isArchived
}: {
  announcement: Announcement;
  canManage: boolean;
  pinningId: string | null;
  deletingId: string | null;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen: (a: Announcement) => void;
  onEdit?: () => void;
  isArchived: boolean
}) {

  const isEdited =
    new Date(a.updatedAt).getTime() - new Date(a.createdAt).getTime() > 1000;
  const preview = stripTokens(a.content);

  return (
    <div
      role="group"
      tabIndex={0}
      onClick={() => onOpen(a)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(a); } }}
      aria-label={`Open announcement: ${a.title}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 overflow-hidden hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
    >
      {/* Pinned left accent bar */}
      {a.isPinned && (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-linear-to-b from-amber-500 to-amber-400/30" />
      )}

      {/* Header — icon block + title | visibility badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={[
              "shrink-0 flex h-8 w-8 items-center justify-center rounded-lg",
              a.isPinned ? "bg-amber-500/15 text-amber-500" : "bg-primary/10 text-primary",
            ].join(" ")}
          >
            <Megaphone size={14} />
          </span>
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {a.title}
          </h3>
        </div>

        {/* Visibility badge */}
        <span
          className={[
            "shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
            a.visibility === "PUBLIC"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-primary/10 text-primary border-primary/20",
          ].join(" ")}
        >
          {a.visibility === "PUBLIC" ? (
            <><Globe size={9} /> Public</>
          ) : (
            <><Lock size={9} /> Private</>
          )}
        </span>
      </div>

      {/* Content — preview only, full content shown in modal */}
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-line">
          {preview}
        </p>
        {preview.length > 200 && (
          <p className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-semibold text-primary/70">
            Click to read more <ArrowRight size={12} />
          </p>
        )}
      </div>

      {/* Footer — author + time | actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 min-w-0">
          <AuthorAvatar author={a.createdBy} size="sm" />
          <span className="text-[11px] text-muted-foreground truncate">
            {a.createdBy?.name ?? "Unknown"}
          </span>
          <span className="text-muted-foreground/40 text-[11px]">·</span>
          <span
            className="text-[11px] text-muted-foreground/70 shrink-0 inline-flex items-center gap-1"
            title={formatFullDate(a.createdAt)}
          >
            {timeAgo(a.createdAt)}
            {isEdited && (
              <span
                title={formatFullDate(a.updatedAt)}
                className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                Edited
              </span>
            )}
          </span>
        </div>

        {canManage && !isArchived && (
          // On mobile: always visible. On desktop: hidden until group-hover.
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                aria-label={`Edit announcement: ${a.title}`}
                title="Edit"
                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <Pencil size={13} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(a.id); }}
              disabled={pinningId === a.id}
              aria-label={a.isPinned ? `Unpin announcement: ${a.title}` : `Pin announcement: ${a.title}`}
              className={[
                "p-1.5 rounded-lg transition-colors transition-opacity",
                a.isPinned
                  ? "text-amber-500 bg-amber-500/10"
                  // mobile: always visible (opacity-100); desktop: hidden until hover
                  : "text-muted-foreground/60 hover:text-amber-500 hover:bg-amber-500/10 opacity-100 md:opacity-0 md:group-hover:opacity-100",
              ].join(" ")}
            >
              {pinningId === a.id ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Pin size={13} className={a.isPinned ? "fill-amber-500" : ""} />
              )}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(a.id); }}
              disabled={deletingId === a.id}
              aria-label={`Delete announcement: ${a.title}`}
              className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
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

      {/* Recipients for private announcements */}
      {a.targets && a.targets.length > 0 && (
        <div className="flex items-center gap-2 pt-2.5 border-t border-border/60">
          <User size={10} className="text-muted-foreground/50 shrink-0" />
          <div className="flex items-center gap-1 flex-wrap">
            {a.targets.slice(0, 4).map((r) => (
              <span
                key={r.userId}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground"
              >
                {r.user?.name ?? "Member"}
              </span>
            ))}
            {a.targets.length > 4 && (
              <span className="text-[10px] text-muted-foreground/60">
                +{a.targets.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
