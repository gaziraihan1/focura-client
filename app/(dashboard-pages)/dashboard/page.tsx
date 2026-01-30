import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { StatsGrid } from "@/components/Dashboard/StatsGrid";
import { RecentTasks } from "@/components/Dashboard/RecentTasks";
import { TodaySchedule } from "@/components/Dashboard/TodaySchedule";
import ProductivityOverview from "@/components/Dashboard/ProductivityOverview";

import {
  CheckSquare,
  Clock,
  FolderOpen,
  Users,
} from "lucide-react";

import {
  DashboardStat,
  RecentTask,
  UpcomingEvent,
} from "@/types/dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/authentication/login");

  const stats: DashboardStat[] = [
    {
      name: "Active Tasks",
      value: "12",
      change: "+2 from yesterday",
      icon: CheckSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "In Progress",
      value: "8",
      change: "3 due today",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      name: "Projects",
      value: "5",
      change: "2 active",
      icon: FolderOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Team Members",
      value: "24",
      change: "+3 this month",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const recentTasks: RecentTask[] = [
    {
      id: 1,
      title: "Update landing page design",
      project: "Website Redesign",
      priority: "High",
      dueDate: "Today",
      assignee: "You",
    },
    {
      id: 2,
      title: "Review marketing materials",
      project: "Q4 Campaign",
      priority: "Medium",
      dueDate: "Tomorrow",
      assignee: "Sarah",
    },
  ];

  const upcomingEvents: UpcomingEvent[] = [
    { id: 1, title: "Team Standup", time: "10:00 AM", type: "Meeting" },
    { id: 2, title: "Project Deadline", time: "5:00 PM", type: "Deadline" },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader userName={session.user?.name} />
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTasks tasks={recentTasks} />
        <TodaySchedule events={upcomingEvents} />
      </div>

      <ProductivityOverview />
    </div>
  );
}
