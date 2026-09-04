import { ContactContent } from "@/components/public/contact/ContactContent";
import { ContactHero } from "@/components/public/contact/ContactHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Gablura",
  description:
    "Get in touch with the Gablura team — for general enquiries, billing support, technical issues, feature requests, partnerships, or security disclosures.",
  keywords: [
    "gablura contact",
    "gablura support",
    "contact gablura",
    "gablura help",
    "billing support",
  ],
  openGraph: {
    title: "Contact Gablura – Get in Touch",
    description:
      "Reach out to the Gablura team. We respond to all messages within 2 business days.",
    url: "https://gablura-client.vercel.app/contact",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Gablura – Get in Touch",
    description:
      "Reach out to the Gablura team. We respond to all messages within 2 business days.",
  },
  alternates: {
    canonical: "https://gablura-client.vercel.app/contact",
  },
};

/**
 * /contact — Public page
 *
 * Sections:
 * 1. ContactHero    — headline, meta pills, response SLA badge
 * 2. ContactContent — 5-col grid:
 *    Left (3 cols):  ContactForm   — react-hook-form + zod + axios POST /api/v1/contact
 *    Right (2 cols): ContactInfo   — email cards, office hours, category list
 *                    ContactFAQ    — accordion FAQ (8 items, 4 categories)
 */
const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <ContactHero />
      <ContactContent />
    </div>
  );
};

export default ContactPage;