import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  CheckSquare,
  Clock,
  TrendingUp,
  Users,
  FolderOpen,
  Calendar,
} from "lucide-react";
import { authOptions } from "@/lib/auth/authOptions";
// import { authOptions } from "@/lib/auth/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  console.log("Dashboard Session Check:", session ? 'SUCCESS' : 'FAILURE');

  if (!session) {
    redirect("/authentication/login");
  }

  const stats = [
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

  const recentTasks = [
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
    {
      id: 3,
      title: "Fix authentication bug",
      project: "Platform Update",
      priority: "High",
      dueDate: "Today",
      assignee: "John",
    },
    {
      id: 4,
      title: "Prepare quarterly report",
      project: "Analytics",
      priority: "Low",
      dueDate: "Next Week",
      assignee: "You",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Team Standup",
      time: "10:00 AM",
      type: "Meeting",
    },
    {
      id: 2,
      title: "Client Presentation",
      time: "2:00 PM",
      type: "Meeting",
    },
    {
      id: 3,
      title: "Project Deadline",
      time: "5:00 PM",
      type: "Deadline",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {session.user?.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Tasks</h2>
            <button className="text-sm text-primary hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FolderOpen size={14} />
                        {task.project}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === "High"
                          ? "bg-red-500/10 text-red-500"
                          : task.priority === "Medium"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {task.assignee}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Today&apos;s Schedule
          </h2>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.time}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.type === "Meeting"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium text-foreground">
            View Full Calendar
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Productivity Overview
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm rounded-lg bg-accent text-foreground">
              Week
            </button>
            <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-accent text-muted-foreground transition">
              Month
            </button>
            <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-accent text-muted-foreground transition">
              Year
            </button>
          </div>
        </div>

        <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">
              Chart visualization will go here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}