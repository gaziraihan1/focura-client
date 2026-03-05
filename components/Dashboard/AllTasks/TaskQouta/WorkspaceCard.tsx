import { AlertTriangle, Building2, Clock, TrendingUp, Zap, Infinity, Crown } from "lucide-react";
import { MemberRow } from "./MemberRow";
import { formatResetTime, getPlanBadgeBg } from "../TaskQoutaDetails";
import { WorkspaceQuotaInfo } from "@/hooks/useTask";
import { ProgressRing } from "./ProgressRing";
import { StatPill } from "./StartPill";
import React from "react";

export function WorkspaceCard({ q }: { q: WorkspaceQuotaInfo }) {
  const [showMembers, setShowMembers] = React.useState(false);

  const wsUsed      = q.workspaceUsedToday;
  const wsLimit     = q.dailyWorkspaceLimit;
  const wsPct       = q.isUnlimited || !wsLimit ? 0 : Math.min(wsUsed / wsLimit, 1);
  const isWarning   = !q.isUnlimited && wsPct >= 0.9;
  const isNear      = !q.isUnlimited && wsPct >= 0.7 && !isWarning;
  const hasMembers  = q.members && q.members.length > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">Workspace Quota</p>
            <p className="text-xs text-muted-foreground mt-0.5">Shared team task creation limit</p>
          </div>
        </div>

        <span className={`text-[11px] font-semibold px-2 py-1 rounded-md border ${getPlanBadgeBg(q.plan)}`}>
          {q.plan === "ENTERPRISE" ? (
            <span className="flex items-center gap-1"><Crown className="w-3 h-3" />Enterprise</span>
          ) : q.plan === "BUSINESS" ? "Business"
          : q.plan === "PRO" ? "⚡ Pro"
          : "Free"}
        </span>
      </div>

      {/* Unlimited badge OR ring + stats */}
      {q.isUnlimited ? (
        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-chart-2/8 border border-chart-2/20">
          <Infinity className="w-5 h-5 text-chart-2 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-chart-2">Unlimited tasks</p>
            <p className="text-xs text-muted-foreground">No daily or rate limits on this plan</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ProgressRing used={wsUsed} limit={wsLimit} size={64} strokeWidth={6} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-foreground tabular-nums leading-none">
                {Math.round(wsPct * 100)}%
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatPill label="Used" value={wsUsed} sub="today" />
            <StatPill label="Remaining" value={q.workspaceRemaining ?? "∞"} sub="tasks" />
            {wsLimit && <StatPill label="Daily limit" value={wsLimit} />}
            {q.dailyPerMemberLimit && <StatPill label="Per member" value={q.dailyPerMemberLimit} />}
          </div>
        </div>
      )}

      {/* Bar */}
      {!q.isUnlimited && (
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isWarning ? "bg-destructive" : isNear ? "bg-chart-5" : "bg-primary"
              }`}
              style={{ width: `${wsPct * 100}%` }}
            />
          </div>
          {isWarning && (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs font-medium">Workspace limit almost reached</span>
            </div>
          )}
        </div>
      )}

      {/* Member breakdown toggle (admin/owner only) */}
      {hasMembers && (
        <div className="border-t border-border pt-3 space-y-2">
          <button
            onClick={() => setShowMembers((v) => !v)}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Member breakdown</span>
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full ml-1">{q.members.length}</span>
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {showMembers ? "Hide ↑" : "Show ↓"}
            </span>
          </button>

          {showMembers && (
            <div className="divide-y divide-border -mx-1 px-1">
              {q.members.map((m, i) => (
                <MemberRow key={m.userId} member={m} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">Resets in {formatResetTime(q.resetAt)}</span>
        </div>
        {q.perMinuteLimit !== null && !q.isUnlimited && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs">{q.perMinuteLimit}/min rate limit</span>
          </div>
        )}
        {q.isUnlimited && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs">No rate limit</span>
          </div>
        )}
      </div>
    </div>
  );
}
