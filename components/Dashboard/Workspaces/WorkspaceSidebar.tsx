import Link from "next/link";
import { ChevronDown, Settings, LogOut, LucideIcon } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

interface Member {
  user: {
    id: string;
    name: string;
  };
  role: string;
}

interface Workspace {
  id: string;
  name: string;
  color?: string | null;
  logo?: string | null;
}

interface WorkspaceSidebarProps {
  workspace: Workspace;
  currentMember?: Member;
  navigation: NavigationItem[];
  pathname: string;
  slug: string;
  sidebarOpen: boolean;
  onSidebarClose: () => void;
  onSwitcherOpen: () => void;
}

export function WorkspaceSidebar({
  workspace,
  currentMember,
  navigation,
  pathname,
  slug,
  sidebarOpen,
  onSidebarClose,
  onSwitcherOpen,
}: WorkspaceSidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
  flex flex-col transform transition-transform duration-200
  lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <button
              onClick={onSwitcherOpen}
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

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onSidebarClose}
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

          <div className="p-4 border-t border-border space-y-2">
            <Link
              href={`/dashboard/workspaces/${slug}/settings`}
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onSidebarClose}
        />
      )}
    </>
  );
}