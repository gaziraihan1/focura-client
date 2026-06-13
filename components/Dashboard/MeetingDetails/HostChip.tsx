import type { MeetingUser } from "@/types/meeting.types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { avatarColor, getInitials } from "@/utils/meetingDetails.utils";

export function HostChip({ user }: { user: MeetingUser }) {
  console.log("Rendering HostChip for user:", user);
  const initials = getInitials(user.name, user.email);
  const colorClass = avatarColor(user.id);

  return (
    <div className="flex items-center gap-2">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name ?? user.email}
          className="size-7 rounded-full object-cover"
          width={28}
          height={28}
        />
      ) : (
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            colorClass
          )}
        >
          {initials}
        </div>
      )}
      <span className="text-sm font-medium text-foreground">
        {user.name ?? user.email}
      </span>
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        Host
      </span>
    </div>
  );
}