"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import ThemeSwitcher from "../themes/ThemeSwitcher";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/auth/logout";
import { useIsFocuraAdmin } from "@/hooks/useFeatures";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "Reviews", href: "/reviews" },
  { name: "Resources", href: "/resources" },
  { name: "Guides", href: "/guides" },
];

const desktopLinkClass = (active: boolean) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    active
      ? "bg-accent text-foreground"
      : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
  }`;

const mobileLinkClass = (active: boolean) =>
  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    active
      ? "bg-accent text-foreground"
      : "text-foreground/75 hover:bg-accent/50 hover:text-foreground"
  }`;

export default function NavbarMain() {
  const { data: isAdmin = false } = useIsFocuraAdmin();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { status } = useSession();
  const pathname = usePathname();

  const isLoading = status === "loading";
  // A user is logged in once NextAuth reports an authenticated session.
  // The backend token is only required for API calls (handled elsewhere),
  // so it must not gate navbar link visibility.
  const isAuthenticated = status === "authenticated";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
    <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-9999">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-lg sm:text-xl font-semibold shrink-0"
          >
            <Image src="/focura.png" width={36} height={36} alt="Focura" className="rounded-md" priority />
            Focura
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={desktopLinkClass(isActive(link.href))}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href={"/admin-dashboard"}
                aria-current={isActive("/admin-dashboard") ? "page" : undefined}
                className={desktopLinkClass(isActive("/admin-dashboard"))}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-accent/50 hover:text-foreground"
                >
                  Dashboard
                </Link>
                <ThemeSwitcher />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/authentication/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-accent/50 hover:text-foreground"
                >
                  Login
                </Link>
                <ThemeSwitcher />
                <Link
                  href="/authentication/registration"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={open ? "mobile-nav" : undefined}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl border border-border/60 text-foreground hover:bg-accent hover:border-border transition active:scale-95"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-200"
        >
          <nav className="px-4 sm:px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={mobileLinkClass(isActive(link.href))}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href={"/admin-dashboard"}
                onClick={() => setOpen(false)}
                aria-current={isActive("/admin-dashboard") ? "page" : undefined}
                className={mobileLinkClass(isActive("/admin-dashboard"))}
              >
                Admin Dashboard
                {isActive("/admin-dashboard") && (
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                )}
              </Link>
            )}
          </nav>

          <div className="border-t border-border/40 px-4 sm:px-6 py-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
              <span className="text-sm text-foreground/70">Appearance</span>
              <ThemeSwitcher />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-3">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center rounded-lg border border-border bg-accent/40 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/authentication/login"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center rounded-lg border border-border bg-accent/40 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition"
                >
                  Login
                </Link>
                <Link
                  href="/authentication/registration"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
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