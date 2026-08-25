"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import ThemeSwitcher from "@/components/themes/ThemeSwitcher";
import { logout } from "@/lib/auth/logout";
import { Session } from "next-auth";
import { SidebarToggle } from "@/components/dashboard/shell/SidebarToggle";

interface WorkspaceLayoutHeaderProps {
  session: Session | null;
  onSidebarOpen: () => void;
  onSwitcherOpen: () => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export function WorkspaceLayoutHeader({
  session,
  onSidebarOpen,
  onSwitcherOpen,
  sidebarCollapsed = false,
  onSidebarToggle,
}: WorkspaceLayoutHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Cmd+K / Ctrl+K to open the workspace switcher
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSwitcherOpen();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onSwitcherOpen]);

  // Close the user menu with the Escape key.
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [userMenuOpen]);

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
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3 bg-card border-b border-border">
      {/* Mobile Menu Button */}
      <button
        aria-label="Open workspace sidebar"
        onClick={onSidebarOpen}
        className="lg:hidden p-2 rounded-lg hover:bg-accent transition shrink-0"
      >
        <Menu size={20} />
      </button>

      {onSidebarToggle && (
        <SidebarToggle
          collapsed={sidebarCollapsed}
          onToggle={onSidebarToggle}
          className="hidden lg:inline-flex"
        />
      )}

      {/* Search / switcher trigger */}
      <div className="flex-1 min-w-44 sm:min-w-60 max-w-md relative shrink-0">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          size={16}
        />
        <input
          aria-label="Search or press Cmd+K"
          type="text"
          placeholder="Search or press Cmd+K"
          onClick={onSwitcherOpen}
          readOnly
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground cursor-pointer hover:bg-accent transition"
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-accent"
          >
            {session?.user.image ? (
              <Image
                src={session.user.image}
                alt="User"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            )}
            <ChevronDown
              size={14}
              className={`hidden md:block text-muted-foreground transition-transform duration-200 ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {userMenuOpen && (
            <>
              <div
                role="presentation"
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl shadow-black/10">
                <div className="px-4 py-3.5 border-b border-border">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {session?.user?.name ?? "User"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
                    {session?.user?.email ?? "user@example.com"}
                  </p>
                </div>

                <div className="py-1.5">
                  {[
                    { href: "/dashboard/profile", icon: User, label: "Profile" },
                    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition hover:bg-accent"
                    >
                      <Icon size={16} className="text-muted-foreground" />
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-border py-1.5">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
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

        <ThemeSwitcher />
      </div>
    </header>
  );
}