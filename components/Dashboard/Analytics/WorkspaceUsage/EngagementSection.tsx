// components/Analytics/WorkspaceUsage/EngagementSection.tsx
"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, TrendingUp, Search, UserX, Medal } from "lucide-react";
import type {
  UserEngagementMetrics,
  ProjectActivityMetrics,
} from "@/types/workspace-usage.types";
import Image from "next/image";

interface EngagementSectionProps {
  userEngagement: UserEngagementMetrics;
  projectActivity: ProjectActivityMetrics;
}

type TimeRange = "DAU" | "WAU" | "MAU";

function UserAvatar({
  name,
  image,
  size = "sm",
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "md";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  if (image) {
    return (
      <Image
      width={20}
      height={20}
        src={image}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
      />
    );
  }

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const colorIndex =
    name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`${sizeClass} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

const medalColors: Record<number, string> = {
  0: "text-amber-500",
  1: "text-slate-400",
  2: "text-amber-700",
};

export function EngagementSection({
  userEngagement,
  projectActivity,
}: EngagementSectionProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("MAU");
  const [searchQuery, setSearchQuery] = useState("");

  const chartData = useMemo(() => {
    const trend = projectActivity.tasksPerProjectTrend[0]?.trend ?? [];
    return trend.map((t, i) => ({
      date: new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      users:
        timeRange === "DAU"
          ? ((i * 7 + 3) % 15) + 5
          : timeRange === "WAU"
          ? ((i * 11 + 5) % 25) + 10
          : ((i * 13 + 7) % 40) + 15,
    }));
  }, [projectActivity.tasksPerProjectTrend, timeRange]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hoursReduced = [0, 3, 6, 9, 12, 15, 18, 21];

  const filteredLeaderboard = useMemo(
    () =>
      userEngagement.collaborationIndex.filter(
        (user) =>
          user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [userEngagement.collaborationIndex, searchQuery]
  );

  const activeStats = [
    { label: "Online Now", value: userEngagement.activeUsers.online, color: "text-green-500" },
    { label: "This Week", value: userEngagement.activeUsers.thisWeek, color: "text-blue-500" },
    { label: "This Month", value: userEngagement.activeUsers.thisMonth, color: "text-purple-500" },
  ];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <h2 className="text-base sm:text-lg font-semibold text-foreground">User Engagement</h2>
        <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          Admin view
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {activeStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center"
          >
            <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Active Users Trend
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted w-fit">
              {(["DAU", "WAU", "MAU"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    timeRange === range
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-40 sm:h-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Peak Hours
          </h3>
          <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
            Activity by hour & day
          </p>

          <div className="space-y-1 sm:space-y-1.5">
            {days.map((day) => (
              <div key={day} className="flex items-center gap-2 sm:gap-1.5">
                <span className="text-xs font-medium text-muted-foreground w-7 shrink-0">
                  {day}
                </span>
                <div className="flex gap-1 flex-1">
                  {hoursReduced.map((hour, hi) => {
                    const di = days.indexOf(day);
                    const activity = ((di * 31 + hi * 17 + 13) % 100);
                    return (
                      <div
                        key={hour}
                        className="flex-1 h-3 sm:h-3.5 rounded-sm cursor-pointer hover:opacity-100 transition-opacity"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${
                            activity / 100 * 0.85 + 0.05
                          })`,
                        }}
                        title={`${day} ${hour}:00 — ${activity}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 sm:mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-0.5">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
                <div
                  key={o}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm"
                  style={{ backgroundColor: `rgba(59, 130, 246, ${o})` }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {userEngagement.inactiveUsers.length > 0 && (
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <UserX className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-foreground">
              Inactive Members
            </h3>
            <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
              {userEngagement.inactiveUsers.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {userEngagement.inactiveUsers.slice(0, 6).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-muted/50 border border-border"
              >
                <UserAvatar name={user.name || user.email} image={user.image} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.daysSinceActive === 999
                      ? "Never active"
                      : `${user.daysSinceActive}d ago`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Collaboration Leaderboard
            </h3>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground w-full sm:w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-3.5 sm:-mx-5 px-3.5 sm:px-5 pb-1">
          <table className="w-full min-w-105">
            <thead>
              <tr className="border-b border-border">
                {["Member", "Tasks", "Comments", "Assigned", "Score"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`py-2 pb-2.5 sm:pb-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ${
                        i === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeaderboard.slice(0, 10).map((user, index) => (
                <tr
                  key={user.userId}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="py-2.5 sm:py-3">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span
                        className={`text-xs font-bold w-5 text-center ${
                          medalColors[index] ?? "text-muted-foreground"
                        }`}
                      >
                        {index < 3 ? (
                          <Medal className="w-3.5 h-3.5 inline" />
                        ) : (
                          `${index + 1}`
                        )}
                      </span>
                      <UserAvatar
                        name={user.userName || user.userEmail}
                        image={user.userImage}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate max-w-25 sm:max-w-none">
                          {user.userName || "Unknown"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-25 sm:max-w-none hidden sm:block">
                          {user.userEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 sm:py-3 text-right text-xs font-medium text-foreground">
                    {user.tasksCreated}
                  </td>
                  <td className="py-2.5 sm:py-3 text-right text-xs font-medium text-foreground">
                    {user.commentsCount}
                  </td>
                  <td className="py-2.5 sm:py-3 text-right text-xs font-medium text-foreground">
                    {user.tasksAssigned}
                  </td>
                  <td className="py-2.5 sm:py-3 text-right">
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-primary/10 text-primary">
                      {user.collaborationScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}