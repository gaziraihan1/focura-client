import { formatFullDate, timeAgo } from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/page";
import { Globe, Loader2, Lock, Pin, Trash2, User } from "lucide-react";
import { AuthorAvatar } from "./AuthorAvatar";
import { Announcement } from "@/types/announcement.types";

export function AnnouncementCard({
  announcement: a,
  canManage,
  pinningId,
  deletingId,
  onTogglePin,
  onDelete,
  onOpen,
  isArchived
}: {
  announcement: Announcement;
  canManage: boolean;
  pinningId: string | null;
  deletingId: string | null;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen: (a: Announcement) => void;
  isArchived: boolean
}) {
  
  return (
    <article onClick={() => onOpen(a)} className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-border/70 hover:shadow-md transition-all duration-200">
      {/*Top meta bar */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <AuthorAvatar author={a.createdBy} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">
              {a.createdBy?.name ?? "Unknown"}
            </p>
            <p
              className="text-[10px] text-muted-foreground"
              title={formatFullDate(a.createdAt)}
            >
              {timeAgo(a.createdAt)}
            </p>
          </div>
        </div>
 
        {/* Badges + actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Visibility badge */}
          <span
            className={[
              "hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
              a.visibility === "PUBLIC"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {a.visibility === "PUBLIC" ? (
              <><Globe size={9} /> Public</>
            ) : (
              <><Lock size={9} /> Private</>
            )}
          </span>
 
          {canManage && !isArchived && (
            // On mobile: always visible. On desktop: hidden until group-hover.
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onTogglePin(a.id); }}
                disabled={pinningId === a.id}
                title={a.isPinned ? "Unpin" : "Pin"}
                className={[
                  "p-1.5 rounded-lg transition-all",
                  a.isPinned
                    ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30"
                    // mobile: always visible (opacity-100); desktop: hidden until hover
                    : "text-muted-foreground/60 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
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
                title="Delete"
                // mobile: always visible; desktop: hidden until hover
                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
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
      </div>
 
      {/* Content — preview only, full content shown in modal */}
      <div className="px-5 pt-3 pb-4">
        <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
          {a.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-line">
          {a.content}
        </p>
        {a.content.length > 200 && (
          <p className="mt-1.5 text-xs font-semibold text-primary/70">
            Click to read more →
          </p>
        )}
      </div>

      {/* Footer — recipients */}
      {a.targets && a.targets.length > 0 && (
        <div className="px-5 py-2.5 border-t border-border/60 bg-muted/20 flex items-center gap-2">
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
    </article>
  );
}
