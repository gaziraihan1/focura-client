import TermsContent from "@/components/TermsAndConditions/TermsContent";
import { TermsHero } from "@/components/TermsAndConditions/TermsHero";
import { TermsMobileNav } from "@/components/TermsAndConditions/TermsMobileNav";
import { TermsNav, TermsNavItem } from "@/components/TermsAndConditions/TermsNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Focura",
  description:
    "Read Focura's Terms & Conditions to understand your rights and obligations when using our platform.",
};

const NAV_ITEMS: TermsNavItem[] = [
  { id: "introduction", label: "Introduction" },
  { id: "eligibility", label: "Eligibility & Accounts" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "billing", label: "Billing & Subscriptions" },
  { id: "termination", label: "Termination" },
  { id: "liability", label: "Disclaimers & Liability" },
  { id: "changes", label: "Changes to Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact Us" },
];

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <TermsHero />

      {/* Body — sidebar layout */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Mobile nav (visible on small screens) */}
        <TermsMobileNav items={NAV_ITEMS} />

        <div className="flex gap-12 lg:gap-16">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <TermsNav items={NAV_ITEMS} />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <TermsContent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;