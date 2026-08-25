"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import type { UserEngagementMetrics } from "@/types/workspace-usage.types";
import {
  ActiveUserCards,
  DailyActiveUsersChart,
  PeakHoursHeatmap,
  InactiveMembers,
  CollaborationLeaderboard,
} from "./EngagementSectionParts";

export interface ActiveUserStat {
  label: string;
  value: number;
  color: string;
}

interface EngagementSectionProps {
  userEngagement: UserEngagementMetrics;
}

export function EngagementSection({
  userEngagement,
}: EngagementSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ REAL DATA — dailyActiveUsers from Activity table (getDailyActiveUsers)
  const chartData = useMemo(() => {
    if (!userEngagement.dailyActiveUsers?.length) return [];

    return userEngagement.dailyActiveUsers.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
      }),
      users: day.count,
    }));
  }, [userEngagement.dailyActiveUsers]);

  const filteredLeaderboard = useMemo(
    () =>
      userEngagement.collaborationIndex.filter(
        (user) =>
          user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [userEngagement.collaborationIndex, searchQuery]
  );

  // Theme-aware chart tokens (defined in globals.css).
  const activeStats: ActiveUserStat[] = [
    {
      label: "Online Now",
      value: userEngagement.activeUsers.online,
      color: "text-chart-2",
    },
    {
      label: "This Week",
      value: userEngagement.activeUsers.thisWeek,
      color: "text-chart-1",
    },
    {
      label: "This Month",
      value: userEngagement.activeUsers.thisMonth,
      color: "text-chart-3",
    },
  ];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          User Engagement
        </h2>
        <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          Admin view
        </span>
      </div>

      {/* Active user summary cards */}
      <ActiveUserCards stats={activeStats} />

      {/* DAU chart + Peak Hours heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <DailyActiveUsersChart chartData={chartData} />
        <PeakHoursHeatmap data={userEngagement.peakHours ?? []} />
      </div>

      {/* Inactive members */}
      <InactiveMembers users={userEngagement.inactiveUsers} />

      {/* Collaboration leaderboard */}
      <CollaborationLeaderboard
        leaderboard={filteredLeaderboard}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </section>
  );
}
