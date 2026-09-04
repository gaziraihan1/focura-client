"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "../themes/ThemeSwitcher";

export default function NavbarAuth() {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Image src="/gablura-logo-rounded.png" alt="Gablura" width={36} height={36} className="rounded-md"/>
          Gablura
        </Link>

        <Link
          href="/"
          className="text-sm font-medium text-foreground/70 hover:text-primary transition"
        >
          Back to Home
        </Link>
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
