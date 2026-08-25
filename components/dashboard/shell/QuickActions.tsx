import Link from "next/link";
import { LucideIcon, LayoutGrid, UserPlus, FolderPlus, Keyboard } from "lucide-react";
import { ShortcutsCard } from "./ShortcutsCard";

interface QuickAction {
  label: string;
  hint: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  href?: string | null;
  onClick?: string;
}

const actions: QuickAction[] = [
  {
    label: "New workspace",
    hint: "Start fresh",
    icon: LayoutGrid,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    href: "/dashboard/workspaces/new-workspace",
  },
  {
    label: "Invite member",
    hint: "Grow your team",
    icon: UserPlus,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-700",
    href: "/dashboard/workspaces",
  },
  {
    label: "New project",
    hint: "Inside a workspace",
    icon: FolderPlus,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-700",
    href: "/dashboard/workspaces",
  },
  {
    label: "Shortcuts",
    hint: "⌘K to switch",
    icon: Keyboard,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-700",
    href: null,
  },
];

export function QuickActions() {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Quick actions
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const inner = (
            <div className="flex flex-col gap-3 p-4 bg-card border rounded-xl hover:bg-accent/50 hover:border-border/80 transition cursor-pointer h-full">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.iconBg}`}>
                <action.icon size={16} className={action.iconColor} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.hint}</p>
              </div>
            </div>
          );

          return action.href ? (
            <Link key={action.label} href={action.href} className="block">
              {inner}
            </Link>
          ) : (
            <ShortcutsCard key={action.label} inner={inner} />
          );
        })}
      </div>
    </div>
  );
}

// Separate client component just for the keyboard shortcut trigger