"use client";

import { logout } from "@/lib/auth/logout";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Plus,
  ChevronDown,
  User,
  Settings,
  LogOut,
  FileText,
  Loader2,
} from "lucide-react";

import ThemeSwitcher from "../Themes/ThemeSwitcher";
import Image from "next/image";
import NotificationBell from "../Notifications/NotificationBell";
import { SearchModal } from "../Shared/SearchModal";
import type { UserProfile } from "@/hooks/useUserProfile";

interface TopNavbarProps {
  onMenuClick: () => void;
  user?: UserProfile;
  isRefreshing?: boolean;
  isLoadingProfile?: boolean;
}

export default function TopNavbar({
  onMenuClick,
  user,
  isRefreshing,
  isLoadingProfile,
}: TopNavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6 gap-3">

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={onMenuClick}
              className="shrink-0 rounded-xl p-2 transition hover:bg-accent lg:hidden"
            >
              <Menu size={20} className="text-foreground" />
            </button>

            <button
              onClick={() => setShowSearch(true)}
              className="hidden md:flex flex-1 max-w-sm items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 py-2 hover:border-primary/30 hover:bg-muted/60 transition-all duration-200 group cursor-text"
            >
              <Search size={15} className="text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm text-muted-foreground text-left min-w-0">
                Search workspaces, projects, files…
              </span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden rounded-xl p-2 transition hover:bg-accent"
            >
              <Search size={19} className="text-foreground" />
            </button>

            <Link
              href="/dashboard/tasks/add-task"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-primary-foreground transition hover:opacity-90 active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="text-[13px] font-semibold">New Task</span>
            </Link>

            <ThemeSwitcher />
            <NotificationBell />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-accent"
              >
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-2 transition-all duration-300 overflow-hidden ${
                    isRefreshing ? "ring-primary/50 animate-pulse" : "ring-transparent"
                  }`}
                >
                  {isLoadingProfile ? (
                    <Loader2 size={15} className="animate-spin text-primary" />
                  ) : user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? "User"}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-primary" />
                  )}
                </div>

                <div className="hidden lg:block text-left">
                  {isLoadingProfile ? (
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  ) : (
                    <p className="text-[13px] font-medium text-foreground leading-none">
                      {user?.name ?? "User"}
                    </p>
                  )}
                </div>

                <ChevronDown
                  size={14}
                  className={`hidden lg:block text-muted-foreground transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl shadow-black/10">
                    <div className="px-4 py-3.5 border-b border-border">
                      {isLoadingProfile ? (
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                          <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-foreground">{user?.name ?? "User"}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{user?.email ?? "user@example.com"}</p>
                        </>
                      )}
                    </div>

                    {/* Nav links */}
                    <div className="py-1.5">
                      {[
                        { href: "/dashboard/profile", icon: User, label: "Profile" },
                        { href: "/dashboard/settings", icon: Settings, label: "Settings" },
                        { href: "/dashboard/billing", icon: FileText, label: "Billing" },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition hover:bg-accent"
                        >
                          <Icon size={16} className="text-muted-foreground" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border py-1.5">
                      <button
                        onClick={() => { setShowUserMenu(false); handleLogout(); }}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition hover:bg-destructive/8 disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <LogOut size={15} />
                        )}
                        {isLoggingOut ? "Logging out…" : "Log out"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}