import { WorkspaceQuotaInfo } from "@/hooks/useTask";
import Image from "next/image";

export function MemberRow({ member }: { member: WorkspaceQuotaInfo["members"][number]; index: number }) {
  const pct = member.memberLimit && member.memberLimit > 0
    ? Math.min(member.usedToday / member.memberLimit, 1)
    : 0;

  const barColor =
    pct >= 0.9 ? "bg-destructive"
    : pct >= 0.7 ? "bg-chart-5"
    : "bg-primary";

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Avatar placeholder */}
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-semibold text-muted-foreground border border-border">
        {
            member.image ?
            <Image src={member.image} width={28} height={28} alt="Member" className="rounded-full" />
            :
            
        member.name ?? member.email[0].toUpperCase()
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <span className="text-xs font-medium text-foreground truncate">
            {member.name ?? member.email}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground shrink-0">
            {member.usedToday}
            {member.memberLimit !== null ? ` / ${member.memberLimit}` : ""}
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-500`}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
      </div>

      <div className="shrink-0 w-14 text-right">
        <span className={`text-xs font-medium tabular-nums ${pct >= 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
          {member.remaining !== null ? `${member.remaining} left` : "∞"}
        </span>
      </div>
    </div>
  );
}