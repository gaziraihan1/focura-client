"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Users,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  X,
  MessageCircle ,
  Box ,
  Activity 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href?: string ;
  icon: React.ElementType;
  badge?: string;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks",
    // href: "",
    icon: CheckSquare,
    badge: "12",
    children: [
      {
        name: 'All Tasks',
        href: '/dashboard/tasks'
      },
      {
        name: "Team Task",
        href: "/dashboard/tasks/team-task"
      },
      {
        name: 'Add Task',
        href: '/dashboard/tasks/add-task'
      },
      {
        name: 'Calender View',
        href: '/dashboard/tasks/calender-view'
      },
      {
        name: 'Kanban Board',
        href: '/dashboard/tasks/kanban-board'
      }
    ]
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    name: "Workspace",
    // href: "/dashboard/te",
    icon: Users,
    children: [
      {name: "Workspaces", href: "/dashboard/workspaces"},
      {name: "Create Workspace", href: "/dashboard/workspaces/new-workspace"}
    ]
  },
  {
    name: "Storage",
    // href: "/dashboard/team",
    icon: Box,
    children: [
      {name: "Overview", href: "/dashboard/storage"},
      {name: "Files", href: "/dashboard/storage/files"},
      {name: "Shared Files", href: "/dashboard/storage/shared-files"}
    ]
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Activity Logs",
    href: "/dashboard/activity-logs",
    icon: Activity,
  },
];

const bottomNavigation: NavItem[] = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/focura.png"
                width={32}
                height={32}
                alt="Focura Logo"
              />
              <span className="text-xl font-bold text-sidebar-foreground">
                Focura
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent transition"
            >
              <X size={20} className="text-sidebar-foreground" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                        text-sm font-medium transition-colors
                        ${
                          item.href && isActive(item.href)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} />
                        <span>{item.name}</span>
                      </div>
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="ml-9 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={`
                              block px-3 py-2 rounded-lg text-sm transition-colors
                              ${
                                pathname === child.href
                                  ? "text-sidebar-primary font-medium"
                                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                              }
                            `}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || ""}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      text-sm font-medium transition-colors
                      ${
                        item.href && isActive(item.href )
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border space-y-1">
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href || ""}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-colors
                  ${
                    isActive(item.href || "")
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}