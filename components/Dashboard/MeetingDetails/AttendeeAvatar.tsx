import { avatarColor, formatTime, getInitials } from "@/utils/meetingDetails.utils";
import Image from "next/image";
import { memo } from "react";
import type { MeetingUser } from "@/types/meeting.types";
import { cn } from "@/lib/utils";


export const AttendeeAvatar = memo(function AttendeeAvatar({
  user,
  joinedAt,
}: {
  user: MeetingUser;
  joinedAt: string;
}) {
  const initials = getInitials(user.name, user.email);
  const colorClass = avatarColor(user.id);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/40">
      {/* Avatar */}
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name ?? user.email}
          className="size-9 rounded-full object-cover ring-2 ring-border"
          width={36}
          height={36}
        />
      ) : (
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-border",
            colorClass
          )}
        >
          {initials}
        </div>
      )}

      {/* Name + email */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {user.name ?? "Unknown"}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>

      {/* Joined time */}
      <p className="shrink-0 text-xs text-muted-foreground">
        Joined {formatTime(joinedAt)}
      </p>
    </div>
  );
});