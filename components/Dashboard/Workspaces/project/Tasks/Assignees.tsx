import { Task } from "@/hooks/useTask";
import Image from "next/image";
import { memo } from "react";

export const Assignees = memo(function Assignees({ assignees }: { assignees: Task['assignees'] }) {
  if (!assignees?.length) return <div className="size-6 rounded-full bg-muted border border-dashed border-border" />;
  return (
    <div className="flex -space-x-1.5">
      {assignees.slice(0, 3).map(({ user }) =>
        user.image ? (
          <Image key={user.id} src={user.image} alt={user.name} width={24} height={24}
            className="size-6 rounded-full object-cover ring-2 ring-background" />
        ) : (
          <span key={user.id}
            className="size-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center ring-2 ring-background">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )
      )}
      {assignees.length > 3 && (
        <span className="size-6 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold flex items-center justify-center ring-2 ring-background">
          +{assignees.length - 3}
        </span>
      )}
    </div>
  );
});
