"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import ThemeSwitcher from "../Themes/ThemeSwitcher";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/auth/logout";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "Resources", href: "/resources" },
];

export default function NavbarMain() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();

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
    <nav className="w-full border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold flex gap-1">
            <Image src={"/focura.png"} width={32} height={32} alt="logo" />
            Focura
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition"
              >
                {link.name}
              </Link>
            ))}

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition"
                >
                  Dashboard
                </Link>
                <ThemeSwitcher />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/authentication/login"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition"
                >
                  Login
                </Link>
                <ThemeSwitcher />
                <Link
                  href="/get-started"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-md border border-border/40"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/40 bg-background">
          <div className="flex flex-col space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm py-2 font-medium text-foreground/80 hover:text-foreground transition"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm py-2 font-medium text-foreground/80 hover:text-foreground transition"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="py-4">
                  <ThemeSwitcher />
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/authentication/login"
                  className="text-sm py-2 font-medium text-foreground/80 hover:text-foreground transition"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <div className="py-4">
                  <ThemeSwitcher />
                </div>
                <Link
                  href="/get-started"
                  className="w-full text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

