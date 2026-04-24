import { PrivacyContent } from "@/components/PrivacyAndPolicy/PrivacyContent";
import { PrivacyHero } from "@/components/PrivacyAndPolicy/PrivacyHero";
import { PrivacyMobileNav } from "@/components/PrivacyAndPolicy/PrivacyMobileNav";
import { PrivacyNav, PrivacyNavItem } from "@/components/PrivacyAndPolicy/PrivacyNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Focura",
  description:
    "Learn how Focura collects, uses, and protects your personal data. We are committed to transparency and your privacy rights.",
};

const NAV_ITEMS: PrivacyNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "data-we-collect", label: "Data We Collect" },
  { id: "how-we-use", label: "How We Use Your Data" },
  { id: "sharing", label: "Sharing Your Data" },
  { id: "international-transfers", label: "International Transfers" },
  { id: "security", label: "Security" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "your-rights", label: "Your Privacy Rights" },
  { id: "children", label: "Children's Privacy" },
  { id: "policy-changes", label: "Policy Changes" },
  { id: "contact", label: "Contact & DPO" },
];

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <PrivacyHero />

      {/* Body — sidebar layout */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Mobile nav (visible on small screens) */}
        <PrivacyMobileNav items={NAV_ITEMS} />

        <div className="flex gap-12 lg:gap-16">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <PrivacyNav items={NAV_ITEMS} />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <PrivacyContent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;