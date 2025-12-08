// app/dashboard/[workspaceSlug]/layout.tsx
"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  Menu,
//   X,
  LogOut,
  Search,
  Command,
} from "lucide-react";
import { useWorkspace, useWorkspaces } from "@/hooks/useWorkspace";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.workspaceSlug as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Fetch current workspace
  const { data: workspace, isLoading } = useWorkspace(slug);
  const { data: allWorkspaces = [] } = useWorkspaces();

  // Keyboard shortcut for workspace switcher (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSwitcherOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigation = [
    {
      name: "Overview",
      href: `/dashboard/workspaces/${slug}`,
      icon: LayoutDashboard,
      match: (path: string) => path === `/dashboard/${slug}`,
    },
    {
      name: "Tasks",
      href: `/dashboard/workspaces/${slug}/tasks`,
      icon: CheckSquare,
      match: (path: string) => path.includes("/tasks"),
    },
    {
      name: "Projects",
      href: `/dashboard/workspaces/${slug}/projects`,
      icon: FolderKanban,
      match: (path: string) => path.includes("/projects"),
    },
    {
      name: "Team",
      href: `/dashboard/workspaces/${slug}/team`,
      icon: Users,
      match: (path: string) => path.includes("/team"),
    },
    {
      name: "Calendar",
      href: `/dashboard/workspaces/${slug}/calendar`,
      icon: Calendar,
      match: (path: string) => path.includes("/calendar"),
    },
    {
      name: "Analytics",
      href: `/dashboard/workspaces/${slug}/analytics`,
      icon: BarChart3,
      match: (path: string) => path.includes("/analytics"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Workspace not found
        </h2>
        <Link
          href="/dashboard/workspaces"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Back to Workspaces
        </Link>
      </div>
    );
  }

  const currentMember = workspace.members.find(
    (m) => m.user.id === session?.user?.id
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Workspace Switcher */}
          <div className="p-4 border-b border-border">
            <button
              onClick={() => setSwitcherOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: workspace.color || "#667eea" }}
              >
                {workspace.logo || workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground truncate">
                  {workspace.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentMember?.role || "Member"}
                </p>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              href={`/dashboard/${slug}/settings`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>

            <Link
              href="/dashboard/workspaces"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent transition"
            >
              <LogOut size={18} />
              <span>All Workspaces</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-card border-b border-border">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="Search or press Cmd+K"
              onClick={() => setSwitcherOpen(true)}
              readOnly
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground cursor-pointer hover:bg-accent transition"
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-accent transition">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Workspace Switcher Modal */}
      {switcherOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
          onClick={() => setSwitcherOpen(false)}
        >
          <div
            className="bg-card rounded-xl border border-border w-full max-w-md max-h-96 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Command size={14} />
                <span>Quick switch workspace</span>
              </div>
              <input
                type="text"
                placeholder="Search workspaces..."
                autoFocus
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground outline-none focus:ring-2 ring-primary"
              />
            </div>

            <div className="overflow-y-auto max-h-64">
              {allWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    router.push(`/dashboard/${ws.workspaceSlug}`);
                    setSwitcherOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition ${
                    ws.workspaceSlug === slug ? "bg-accent" : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: ws.color || "#667eea" }}
                  >
                    {ws.logo || ws.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{ws.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ws._count.members} members · {ws._count.projects}{" "}
                      projects
                    </p>
                  </div>
                </button>
              ))}

              <button
                onClick={() => {
                  router.push("/dashboard/workspaces/new");
                  setSwitcherOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-primary hover:bg-accent transition border-t border-border"
              >
                <div className="w-10 h-10 rounded-lg border-2 border-dashed border-primary flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <span className="font-medium">Create new workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}