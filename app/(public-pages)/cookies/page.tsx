import { CookiesContent } from "@/components/Cookies/CookiesContent";
import { CookiesHero } from "@/components/Cookies/CookiesHero";
import { CookiesMobileNav } from "@/components/Cookies/CookiesMobileNav";
import { CookiesNav, CookiesNavItem } from "@/components/Cookies/CookiesNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Focura",
  description:
    "Learn exactly which cookies Focura sets, why, and how to manage or opt out of non-essential tracking. GDPR and ePrivacy compliant.",
  keywords: [
    "focura cookies",
    "focura cookie policy",
    "cookie settings",
    "gdpr cookies",
    "privacy cookies",
  ],
  openGraph: {
    title: "Cookie Policy – Focura",
    description:
      "Learn exactly which cookies Focura sets, why, and how to manage or opt out of non-essential tracking.",
    url: "https://focura-client.vercel.app/cookies",
    siteName: "Focura",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focura Cookie Policy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy – Focura",
    description:
      "Learn exactly which cookies Focura sets, why, and how to manage or opt out.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/cookies",
  },
};

const NAV_ITEMS: CookiesNavItem[] = [
  { id: "what-are-cookies", label: "What Are Cookies?" },
  { id: "cookie-categories", label: "Cookie Categories" },
  { id: "cookie-list", label: "Complete Cookie List" },
  { id: "third-party", label: "Third-Party Services" },
  { id: "managing-consent", label: "Managing Preferences" },
  { id: "browser-controls", label: "Browser Controls" },
  { id: "policy-changes", label: "Policy Changes" },
  { id: "contact", label: "Contact Us" },
];

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <CookiesHero />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Mobile nav */}
        <CookiesMobileNav items={NAV_ITEMS} />

        <div className="flex gap-12 lg:gap-16">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <CookiesNav items={NAV_ITEMS} />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <CookiesContent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;