import { ContactContent } from "@/components/Contact/ContactContent";
import { ContactHero } from "@/components/Contact/ContactHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Focura",
  description:
    "Get in touch with the Focura team — for general enquiries, billing support, technical issues, feature requests, partnerships, or security disclosures.",
  openGraph: {
    title: "Contact Focura",
    description:
      "Reach out to the Focura team. We respond to all messages within 2 business days.",
    url: "https://focura-client.vercel.app/contact",
    siteName: "Focura",
    type: "website",
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