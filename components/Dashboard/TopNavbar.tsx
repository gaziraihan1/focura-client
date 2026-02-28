"use client";

import { logout } from "@/lib/auth/logout";
import { useState } from "react";
// import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Menu,
  Search,
  // Bell,
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

interface TopNavbarProps {
  onMenuClick: () => void;
  user?: UserProfile
}
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  timezone?: string;
  role: string;
  createdAt: string;
  ownedWorkspaces: Array<{
    id: string;
    plan: string;
    maxStorage: number;
  }>;
}

export default function TopNavbar({ onMenuClick, user }: TopNavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

const handleLogout = async () => {
  setIsLoggingOut(true);
  try {
    await logout();
  } catch (error) {
    console.error('Logout error:', error);
    setIsLoggingOut(false);
  }
};


  return (
    <header className="sticky top-0 z-9999 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
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

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={300}
                    height={300}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-primary" />
                )}
              </div>
              <ChevronDown
                size={16}
                className="text-foreground hidden lg:block"
              />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-foreground">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings
                        size={18}
                        className="text-muted-foreground"
                      />
                      <span className="text-sm text-foreground">Settings</span>
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FileText
                        size={18}
                        className="text-muted-foreground"
                      />
                      <span className="text-sm text-foreground">Billing</span>
                    </Link>
                  </div>

                  <div className="border-t border-border">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-accent transition text-left"
                    >
                      {isLoggingOut ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
      {isLoggingOut ? 'Logging out...' : 'Logout'}
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