import {  initials } from "@/app/(dashboard-pages)/dashboard/workspaces/[workspaceSlug]/projects/[projectSlug]/announcements/page";
import { Announcement } from "@/types/announcement.types";

export function AuthorAvatar({
  author,
  size = "sm",
}: {
  author?: Announcement["createdBy"];
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${dim} rounded-full bg-primary/10 border border-border flex items-center justify-center font-bold text-foreground/70 shrink-0 overflow-hidden`}
    >
      {author?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.image}
          alt={author.name ?? ""}
          className="w-full h-full object-cover"
        />
      ) : (
        initials(author?.name)
      )}
    </div>
  );
}