"use client";

import { ProjectMemberContribution } from "@/hooks/useProjectAnalytics";
import { Award, CheckCircle2, Clock, MessageSquare, TrendingUp } from "lucide-react";

interface ProjectMemberLeaderboardProps {
  data: ProjectMemberContribution[];
}

const contributionConfig = [
  { key: "completedTasks", label: "Tasks Done", icon: CheckCircle2, color: "text-green-500" },
  { key: "totalHours", label: "Hours", icon: Clock, color: "text-blue-500", format: (v: number) => `${v}h` },
  { key: "commentsCount", label: "Comments", icon: MessageSquare, color: "text-purple-500" },
  { key: "contributionScore", label: "Score", icon: TrendingUp, color: "text-orange-500" },
];

export function ProjectMemberLeaderboard({ data }: ProjectMemberLeaderboardProps) {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => b.contributionScore - a.contributionScore);

  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Member Contributions</h2>
        </div>
        <span className="text-sm text-muted-foreground">{sortedData.length} members</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b">
              <th className="pb-3 pr-4">Rank</th>
              <th className="pb-3 pr-4">Member</th>
              <th className="pb-3 pr-4 hidden md:table-cell">Role</th>
              {contributionConfig.map((c) => (
                <th key={c.key} className="pb-3 pr-4 text-right">
                  <span className="flex items-center justify-end gap-1">
                    <c.icon className={`w-3 h-3 ${c.color}`} />
                    {c.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sortedData.map((member, index) => (
              <tr key={member.userId} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 pr-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : index === 1
                      ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      : index === 2
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                      {member.userName?.charAt(0).toUpperCase() || member.userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.userName || member.userEmail}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{member.userEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 hidden md:table-cell">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {member.role}
                  </span>
                </td>
                {contributionConfig.map((config) => (
                  <td key={config.key} className="py-3 pr-4 text-right">
                    <span className="text-sm font-medium text-foreground">
                      {config.format
                        ? config.format(member[config.key as keyof ProjectMemberContribution] as number)
                        : (member[config.key as keyof ProjectMemberContribution] as number).toLocaleString()}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}