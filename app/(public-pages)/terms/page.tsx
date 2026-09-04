import TermsContent from "@/components/public/terms/TermsContent";
import { TermsHero } from "@/components/public/terms/TermsHero";
import { TermsMobileNav } from "@/components/public/terms/TermsMobileNav";
import { TermsNav, TermsNavItem } from "@/components/public/terms/TermsNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Gablura",
  description:
    "Read Gablura's Terms & Conditions to understand your rights and obligations when using our platform.",
  keywords: [
    "gablura terms",
    "gablura terms and conditions",
    "gablura tos",
    "terms of service",
  ],
  openGraph: {
    title: "Terms & Conditions – Gablura",
    description:
      "Read Gablura's Terms & Conditions to understand your rights and obligations when using our platform.",
    url: "https://gablura-client.vercel.app/terms",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions – Gablura",
    description:
      "Read Gablura's Terms & Conditions to understand your rights and obligations.",
  },
  alternates: {
    canonical: "https://gablura-client.vercel.app/terms",
  },
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