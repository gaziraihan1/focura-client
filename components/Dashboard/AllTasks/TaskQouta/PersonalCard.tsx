import { AlertTriangle, Clock, User, Zap } from "lucide-react";
import { formatResetTime, getPlanBadgeBg } from "../TaskQoutaDetails";
import { StatPill } from "./StartPill";
import { ProgressRing } from "./ProgressRing";
import { PersonalQuotaInfo } from "@/hooks/useTask";

export function PersonalCard({ q }: { q: PersonalQuotaInfo }) {
  const pct       = q.dailyLimit > 0 ? Math.min(q.usedToday / q.dailyLimit, 1) : 0;
  const isWarning = pct >= 0.9;
  const isNear    = pct >= 0.7 && !isWarning;

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">Personal Quota</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your daily task creation limit</p>
          </div>
        </div>

        <span className={`text-[11px] font-semibold px-2 py-1 rounded-md border ${getPlanBadgeBg(q.plan)}`}>
          {q.plan === "PRO" ? "⚡ Pro" : "Free"}
        </span>
      </div>

      {/* Ring + stats row */}
      <div className="flex items-center gap-4">
        {/* Progress ring */}
        <div className="relative shrink-0">
          <ProgressRing used={q.usedToday} limit={q.dailyLimit} size={64} strokeWidth={6} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-foreground tabular-nums leading-none">
              {Math.round(pct * 100)}%
            </span>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2">
          <StatPill label="Used" value={q.usedToday} sub="today" />
          <StatPill label="Remaining" value={q.remaining} sub="tasks" />
          <StatPill label="Daily limit" value={q.dailyLimit} />
        </div>
      </div>

      {/* Inline bar */}
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isWarning ? "bg-destructive" : isNear ? "bg-chart-5" : "bg-primary"
            }`}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        {isWarning && (
          <div className="flex items-center gap-1.5 text-destructive">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-medium">Limit almost reached</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">Resets in {formatResetTime(q.resetAt)}</span>
        </div>
        {q.perMinuteLimit !== null && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs">{q.perMinuteLimit}/min rate limit</span>
          </div>
        )}
      </div>
    </div>
  );
}