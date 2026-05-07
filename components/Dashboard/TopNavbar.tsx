"use client";

import { logout } from "@/lib/auth/logout";
import { useState } from "react";
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
    <header className="sticky top-0 z-9999 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 transition hover:bg-accent lg:hidden"
          >
            <Menu size={24} className="text-foreground" />
          </button>

          <div className="hidden min-w-75 items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2 md:flex lg:min-w-100">
            <Search size={18} className="text-muted-foreground" />

            <input
              type="text"
              placeholder="Search tasks, projects, files..."
              className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            <kbd className="hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 lg:gap-3">
          <button className="rounded-lg p-2 transition hover:bg-accent md:hidden">
            <Search size={20} className="text-foreground" />
          </button>

          <button className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90 sm:flex">
            <Plus size={18} />
            <span className="text-sm font-medium">New Task</span>
          </button>

          <ThemeSwitcher />
          <NotificationBell />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-accent"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-2 transition-all ${
                  isRefreshing
                    ? "animate-pulse ring-primary/50"
                    : "ring-transparent"
                }`}
              >
                {isLoadingProfile ? (
                  <Loader2
                    size={16}
                    className="animate-spin text-primary"
                  />
                ) : user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={300}
                    height={300}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-primary" />
                )}
              </div>

              <ChevronDown
                size={16}
                className="hidden text-foreground lg:block"
              />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />

                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                  {/* Identity */}
                  <div className="border-b border-border p-4">
                    {isLoadingProfile ? (
                      <div className="space-y-2">
                        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-foreground">
                          {user?.name ?? "User"}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {user?.email ?? "user@example.com"}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Nav links */}
                  <div className="py-2">
                    {[
                      {
                        href: "/dashboard/profile",
                        icon: User,
                        label: "Profile",
                      },
                      {
                        href: "/dashboard/settings",
                        icon: Settings,
                        label: "Settings",
                      },
                      {
                        href: "/dashboard/billing",
                        icon: FileText,
                        label: "Billing",
                      },
                    ].map(({ href, icon: Icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-accent"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon
                          size={18}
                          className="text-muted-foreground"
                        />

                        <span className="text-sm text-foreground">
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-border">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-accent disabled:opacity-60"
                    >
                      {isLoggingOut ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <LogOut size={16} />
                      )}

                      <span className="text-sm text-foreground">
                        {isLoggingOut
                          ? "Logging out…"
                          : "Logout"}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}