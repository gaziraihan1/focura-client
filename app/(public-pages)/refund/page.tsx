import RefundContent from "@/components/public/refund/RefundContent";
import { RefundHero } from "@/components/public/refund/RefundHero";
import { RefundMobileNav } from "@/components/public/refund/RefundMobileNav";
import { RefundNav, RefundNavItem } from "@/components/public/refund/RefundNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Focura",
  description:
    "Focura's refund policy — a fair 14-day window for first-time subscribers. Learn what qualifies, how to request, and how Paddle processes refunds.",
  keywords: [
    "focura refund",
    "focura refund policy",
    "money back guarantee",
    "paddle refund",
    "subscription refund",
  ],
  openGraph: {
    title: "Refund Policy – Focura",
    description:
      "Focura's refund policy — a fair 14-day window for first-time subscribers.",
    url: "https://focura-client.vercel.app/refund",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy – Focura",
    description:
      "Focura's refund policy — a fair 14-day window for first-time subscribers.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/refund",
  },
};

const NAV_ITEMS: RefundNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "refund-window", label: "14-Day Refund Window" },
  { id: "eligible", label: "What Qualifies" },
  { id: "not-eligible", label: "What Does Not Qualify" },
  { id: "usage-assessment", label: "Usage Assessment" },
  { id: "cancellation", label: "Cancellation Requirement" },
  { id: "paddle", label: "Paddle & Payments" },
  { id: "how-to-request", label: "How to Request" },
  { id: "exceptions", label: "Exceptions" },
  { id: "policy-changes", label: "Policy Changes" },
];

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <RefundHero />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Mobile nav */}
        <RefundMobileNav items={NAV_ITEMS} />

        <div className="flex gap-12 lg:gap-16">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <RefundNav items={NAV_ITEMS} />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <RefundContent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;