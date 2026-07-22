"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Users,
  Calendar,
  Settings,
  HelpCircle,
  ChevronDown,
  X,
  Box,
  Activity,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Tasks",
    icon: CheckSquare,
    badge: "12",
    children: [
      { name: "All Tasks", href: "/dashboard/tasks" },
      { name: "Team Task", href: "/dashboard/tasks/team-task" },
      { name: "Add Task", href: "/dashboard/tasks/add-task" },
      { name: "Calendar View", href: "/dashboard/tasks/calender-view" },
      { name: "Kanban Board", href: "/dashboard/tasks/kanban-board" },
    ],
  },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  {
    name: "Workspace",
    icon: Users,
    children: [
      { name: "Workspaces", href: "/dashboard/workspaces" },
      { name: "Create Workspace", href: "/dashboard/workspaces/new-workspace" },
    ],
  },
  {
    name: "Storage",
    icon: Box,
    children: [
      { name: "Overview", href: "/dashboard/storage" },
      { name: "Files", href: "/dashboard/storage/files" },
    ],
  },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Activity Logs", href: "/dashboard/activity-logs", icon: Activity },
];

const bottomNavigation: NavItem[] = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navRef = useRef<HTMLElement>(null);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const isGroupActive = (item: NavItem) => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) return item.children.some((c) => pathname === c.href);
    return false;
  };

  // Arrow key roving within sidebar nav
  const handleNavKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!navRef.current) return;
    const focusable = Array.from(
      navRef.current.querySelectorAll<HTMLElement>("a[href], button[aria-expanded]")
    );
    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (currentIndex + 1) % focusable.length;
        break;
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (currentIndex - 1 + focusable.length) % focusable.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = focusable.length - 1;
        break;
    }
    if (nextIndex !== currentIndex) {
      focusable[nextIndex].focus();
    }
  }, []);

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64
        bg-sidebar border-r border-sidebar-border
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-sidebar-border group-hover:ring-sidebar-primary/40 transition-all">
            <Image src="/focura.png" width={32} height={32} alt="Focura Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-sidebar-foreground">
            Focura
          </span>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent transition text-sidebar-foreground/60 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X size={18} />
        </button>
      </div>

      <nav
        ref={navRef}
        className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-0.5"
        aria-label="Main navigation"
        onKeyDown={handleNavKeyDown}
      >
        {navigation.map((item) => {
          const active = isGroupActive(item);

          return (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    aria-expanded={expandedItems.includes(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                      text-sm font-medium transition-all duration-150 group
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                      ${active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={17}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={active ? "text-sidebar-primary" : ""}
                      />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 opacity-60 ${
                        expandedItems.includes(item.name) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedItems.includes(item.name) && (
                    <div className="ml-8 mt-0.5 mb-1 space-y-0.5 border-l border-sidebar-border/60 pl-3" role="group" aria-label={`${item.name} submenu`}>
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            aria-current={childActive ? "page" : undefined}
                            className={`
                              block px-2.5 py-2 rounded-lg text-[13px] transition-all duration-150
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                              ${childActive
                                ? "text-sidebar-primary font-semibold bg-sidebar-primary/8"
                                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                              }
                            `}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href || ""}
                  onClick={onClose}
                  aria-current={isActive(item.href || "") ? "page" : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-sm font-medium transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                    ${item.href && isActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    }
                  `}
                >
                  <item.icon
                    size={17}
                    strokeWidth={item.href && isActive(item.href) ? 2.2 : 1.8}
                    className={item.href && isActive(item.href) ? "text-sidebar-primary" : ""}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground leading-none">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-0.5 shrink-0">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href || ""}
            onClick={onClose}
            aria-current={isActive(item.href || "") ? "page" : undefined}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              ${isActive(item.href || "")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              }
            `}
          >
            <item.icon size={17} strokeWidth={1.8} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
