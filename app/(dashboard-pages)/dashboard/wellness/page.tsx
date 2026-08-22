import { Brain, HeartPulse, Sparkles } from "lucide-react";
import { FocusStreakBadge } from "@/components/Dashboard/FocusStreakBadge";
import { FocusDailySummary } from "@/components/Dashboard/FocusDailySummary";
import { WellnessRecommendations } from "@/components/Dashboard/WellnessRecommendations";
import { BurnoutTrendsChart } from "@/components/Dashboard/Calendar/BurnoutTrendsChart";
import { EnergyTrendChart } from "@/components/Dashboard/Calendar/EnergyTrendChart";
import { WeeklyStrainBreakdown } from "@/components/Dashboard/Wellness/WeeklyStrainBreakdown";
import { EnergyQuickLog } from "@/components/Dashboard/Calendar/EnergyQuickLog";
import { AiGoalBreakdown } from "@/components/AI/AiGoalBreakdown";
import { AiWeeklyInsights } from "@/components/AI/AiWeeklyInsights";

export default function WellnessPage() {
  return (
    <div className="space-y-5 py-2">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <HeartPulse className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
              Wellness Overview
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Your focus habits, energy levels, burnout trends, and personalized
            wellness insights — all in one place.
          </p>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
          <Sparkles className="w-3 h-3" />
          Daily check-in
        </span>
      </div>

      {/* Top row: streak + daily summary + recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <FocusStreakBadge />
        <FocusDailySummary />
        <div className="lg:col-span-1">
          <WellnessRecommendations />
        </div>
      </div>

      {/* Burnout trends + energy trend */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Trends</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BurnoutTrendsChart />
          <EnergyTrendChart />
        </div>
        <div className="mt-5">
          <WeeklyStrainBreakdown />
        </div>
      </div>

      {/* AI planning — cognitive breakdown of goals into energy-matched tasks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">AI Planning</h2>
        </div>
        <AiGoalBreakdown />
      </div>

      {/* AI insights — weekly productivity summary + burnout warnings (Business) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">AI Insights</h2>
        </div>
        <AiWeeklyInsights />
      </div>

      {/* Floating energy quick-log (fixed bottom-right) */}
      <EnergyQuickLog />
    </div>
  );
}
