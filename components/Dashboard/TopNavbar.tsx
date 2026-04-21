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
import type { UserProfile } from "@/hooks/useUserProfile"; // ← single source of truth

interface TopNavbarProps {
  onMenuClick: () => void;
  user?: UserProfile;
  isRefreshing?: boolean; // subtle indicator when background-refetching
}

export default function TopNavbar({ onMenuClick, user, isRefreshing }: TopNavbarProps) {
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
    <header className="sticky top-0 z-9999 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left — hamburger + search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition"
          >
            <Menu size={24} className="text-foreground" />
          </button>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border min-w-75 lg:min-w-100">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks, projects, files..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right — actions + user menu */}
        <div className="flex items-center gap-2 lg:gap-3">
          <button className="md:hidden p-2 rounded-lg hover:bg-accent transition">
            <Search size={20} className="text-foreground" />
          </button>

          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
            <Plus size={18} />
            <span className="text-sm font-medium">New Task</span>
          </button>

          <ThemeSwitcher />
          <NotificationBell />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition"
            >
              {/* Avatar — ring pulses while background-refetching */}
              <div
                className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 transition-all ${
                  isRefreshing
                    ? "ring-primary/50 animate-pulse"
                    : "ring-transparent"
                }`}
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={300}
                    height={300}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-primary" />
                )}
              </div>
              <ChevronDown size={16} className="text-foreground hidden lg:block" />
            </button>

            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />

                <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* Identity */}
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-foreground">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.email ?? "user@example.com"}
                    </p>
                  </div>

                  {/* Nav links */}
                  <div className="py-2">
                    {[
                      { href: "/dashboard/profile",  icon: User,     label: "Profile"  },
                      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
                      { href: "/dashboard/billing",  icon: FileText, label: "Billing"  },
                    ].map(({ href, icon: Icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon size={18} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{label}</span>
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
                      className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-accent transition text-left disabled:opacity-60"
                    >
                      {isLoggingOut ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <LogOut size={16} />
                      )}
                      <span className="text-sm text-foreground">
                        {isLoggingOut ? "Logging out…" : "Logout"}
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