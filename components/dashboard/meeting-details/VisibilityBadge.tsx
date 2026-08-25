import { Globe, Lock } from "lucide-react";
import type { Meeting } from "@/types/meeting.types";


export function VisibilityBadge({ visibility }: { visibility: Meeting["visibility"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
      {visibility === "PUBLIC" ? (
        <Globe className="size-3.5" />
      ) : (
        <Lock className="size-3.5" />
      )}
      {visibility === "PUBLIC" ? "Public" : "Private"}
    </span>
  );
}