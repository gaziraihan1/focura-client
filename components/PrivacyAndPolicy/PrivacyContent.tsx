import {
  FileText,
  Database,
  Settings2,
  Share2,
  Globe,
  Lock,
  Cookie,
  UserCog,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";
import {PrivacySection} from "./PrivacySection";
import {PrivacyHighlight} from "./PrivacyHighlight";
import {PrivacyList} from "./PrivacyList";
import {PrivacyDataTable} from "./PrivacyDataTable";
import {PrivacyRightsGrid} from "./PrivacyRightsGrid";

export const PrivacyContent = () => {
  return (
    <div className="space-y-10">
      {/* 1. Overview */}
      <PrivacySection id="overview" title="Overview" icon={FileText} index={1}>
        <p>
          Focura (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a productivity and collaboration
          SaaS platform. This Privacy Policy describes how we collect, use,
          disclose, and protect personal information when you visit our website
          or use the Focura platform (collectively, the &quot;Service&quot;).
        </p>
        <p>
          We are committed to data minimisation — we collect only what we need,
          retain it only as long as necessary, and never sell your personal data
          to third parties.
        </p>
        <PrivacyHighlight variant="success">
          Focura is compliant with the General Data Protection Regulation (GDPR),
          California Consumer Privacy Act (CCPA), and other applicable data
          protection laws. You can exercise your rights at any time by contacting{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="underline underline-offset-2 font-medium"
          >
            focurabusiness@gmail.com
          </a>
          .
        </PrivacyHighlight>
      </PrivacySection>

      {/* 2. Data We Collect */}
      <PrivacySection
        id="data-we-collect"
        title="Data We Collect"
        icon={Database}
        index={2}
      >
        <p>
          We collect different types of information depending on how you
          interact with the Service. The table below summarises the categories
          of personal data we collect, why we collect it, and how long we keep
          it.
        </p>
        <PrivacyDataTable />
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          * Retention periods may be extended where required by law or for the
          resolution of disputes and enforcement of agreements.
        </p>
      </PrivacySection>

      {/* 3. How We Use Your Data */}
      <PrivacySection
        id="how-we-use"
        title="How We Use Your Data"
        icon={Settings2}
        index={3}
      >
        <p>
          We process your personal data only when we have a lawful basis to do
          so. The legal bases we rely on are:
        </p>
        <PrivacyList
          items={[
            <span key="contract">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Contract performance
              </strong>{" "}
              — to create your account, provide the Service, and handle billing.
            </span>,
            <span key="legitimate">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Legitimate interests
              </strong>{" "}
              — to improve the platform, ensure security, and prevent fraud,
              provided these interests are not overridden by your rights.
            </span>,
            <span key="consent">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Consent
              </strong>{" "}
              — for optional features such as marketing emails and analytics
              cookies. You may withdraw consent at any time.
            </span>,
            <span key="legal">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Legal obligation
              </strong>{" "}
              — to comply with applicable laws, court orders, or regulatory
              requests.
            </span>,
          ]}
        />
        <p>Specifically, we use your data to:</p>
        <PrivacyList
          items={[
            "Provide, operate, and maintain the Focura platform and its features.",
            "Process transactions and manage your subscription.",
            "Send transactional emails such as account verification, password resets, and billing receipts.",
            "Detect, investigate, and prevent fraudulent transactions and other illegal activities.",
            "Personalise and improve your experience through product analytics.",
            "Respond to your support requests, comments, and questions.",
            "Send product updates, changelogs, and marketing communications (only with your consent).",
            "Comply with legal obligations and resolve disputes.",
          ]}
        />
      </PrivacySection>

      {/* 4. Sharing Your Data */}
      <PrivacySection
        id="sharing"
        title="Sharing Your Data"
        icon={Share2}
        index={4}
      >
        <PrivacyHighlight variant="warning">
          We do not sell, rent, or trade your personal data. We only share
          information with third parties as described below.
        </PrivacyHighlight>
        <p>
          We may share your data with the following categories of recipients:
        </p>
        <PrivacyList
          items={[
            <span key="providers">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Service Providers
              </strong>{" "}
              — trusted vendors who help us operate the Service (e.g., Vercel
              for hosting, Stripe for payments, Cloudinary for file storage,
              Upstash for caching). These parties are bound by Data Processing
              Agreements (DPAs) and may only use data to perform services for
              us.
            </span>,
            <span key="workspace">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Workspace Members
              </strong>{" "}
              — your name, avatar, and activity within a shared workspace are
              visible to other members of that workspace as necessary for
              collaboration.
            </span>,
            <span key="legal-req">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Legal Requirements
              </strong>{" "}
              — when disclosure is required by law, subpoena, or court order, or
              to protect the rights, property, or safety of Focura, its users,
              or others.
            </span>,
            <span key="business">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Business Transfers
              </strong>{" "}
              — in the event of a merger, acquisition, or sale of assets, your
              data may be transferred as part of that transaction. We will
              notify you before your data is transferred and becomes subject to
              a different privacy policy.
            </span>,
          ]}
        />
      </PrivacySection>

      {/* 5. International Transfers */}
      <PrivacySection
        id="international-transfers"
        title="International Data Transfers"
        icon={Globe}
        index={5}
      >
        <p>
          Focura is operated globally and your data may be transferred to, and
          processed in, countries other than your own. Where we transfer
          personal data outside the European Economic Area (EEA) or the UK, we
          ensure appropriate safeguards are in place, including:
        </p>
        <PrivacyList
          items={[
            "Standard Contractual Clauses (SCCs) approved by the European Commission.",
            "Adequacy decisions recognising the destination country's data protection standards.",
            "Binding Corporate Rules where applicable.",
          ]}
        />
        <p>
          You may request details of the specific safeguards applied to your
          data transfers by contacting us at{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
          >
             focurabusiness@gmail.com
          </a>
          .
        </p>
      </PrivacySection>

      {/* 6. Security */}
      <PrivacySection
        id="security"
        title="Security & Data Protection"
        icon={Lock}
        index={6}
      >
        <p>
          We implement industry-standard technical and organisational measures
          to protect your personal data against unauthorised access, alteration,
          disclosure, or destruction:
        </p>
        <PrivacyList
          items={[
            "All data is encrypted in transit using TLS 1.2+ and at rest using AES-256.",
            "Passwords are hashed using Argon2id — we never store plaintext passwords.",
            "Authentication uses RS256-signed JWTs with short-lived access tokens and secure refresh rotation.",
            "Access to production systems is restricted to authorised personnel on a need-to-know basis.",
            "We conduct regular security reviews and dependency audits.",
            "Security events are logged and monitored with automated alerting.",
          ]}
        />
        <PrivacyHighlight variant="info">
          Despite these measures, no transmission over the Internet is 100%
          secure. If you discover a security vulnerability, please report it
          responsibly to{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="underline underline-offset-2 font-medium"
          >
            focurabusiness@gmail.com
          </a>{" "}
          rather than opening a public issue.
        </PrivacyHighlight>
      </PrivacySection>

      {/* 7. Cookies */}
      <PrivacySection
        id="cookies"
        title="Cookies & Tracking"
        icon={Cookie}
        index={7}
      >
        <p>
          We use cookies and similar tracking technologies to operate the
          Service and understand how you use it. The types of cookies we use:
        </p>
        <PrivacyList
          items={[
            <span key="essential">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Strictly Necessary
              </strong>{" "}
              — required for authentication sessions and core platform
              functionality. Cannot be disabled.
            </span>,
            <span key="functional">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Functional
              </strong>{" "}
              — remember your preferences (theme, language, sidebar state) to
              personalise your experience.
            </span>,
            <span key="analytics">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Analytics
              </strong>{" "}
              — collect aggregated, anonymised usage data to help us improve the
              product. Requires consent.
            </span>,
          ]}
        />
        <p>
          You can manage cookie preferences via your browser settings or our
          in-app Cookie Preferences panel. Note that disabling non-essential
          cookies will not affect your ability to use core features.
        </p>
        <p>
          For full details, see our{" "}
          <a
            href="/cookies"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
          >
            Cookie Policy
          </a>
          .
        </p>
      </PrivacySection>

      {/* 8. Your Rights */}
      <PrivacySection
        id="your-rights"
        title="Your Privacy Rights"
        icon={UserCog}
        index={8}
      >
        <p>
          Depending on your location, you may have the following rights
          regarding your personal data. We honour all of these requests within
          30 days (or sooner where required by law):
        </p>
        <PrivacyRightsGrid />
        <p className="mt-2">
          To exercise any of these rights, email us at{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
          >
            focurabusiness@gmail.com
          </a>{" "}
          with the subject line &quot;Privacy Request&quot;. We may ask you to verify
          your identity before processing the request. We will not discriminate
          against you for exercising your rights.
        </p>
      </PrivacySection>

      {/* 9. Children */}
      <PrivacySection
        id="children"
        title="Children's Privacy"
        icon={Baby}
        index={9}
      >
        <p>
          The Service is not directed to children under the age of 16. We do
          not knowingly collect personal data from children. If you believe a
          child has provided us with personal information without parental
          consent, please contact us immediately at{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
          >
            focurabusiness@gmail.com
          </a>{" "}
          and we will take steps to delete such data promptly.
        </p>
      </PrivacySection>

      {/* 10. Policy Changes */}
      <PrivacySection
        id="policy-changes"
        title="Changes to This Policy"
        icon={RefreshCw}
        index={10}
      >
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our practices, technology, legal requirements, or other factors. When
          we make material changes:
        </p>
        <PrivacyList
          ordered
          items={[
            'We will update the "Last Updated" date at the top of this page.',
            "We will notify you via email or an in-app banner at least 14 days before the change takes effect.",
            "For significant changes to how we use your data, we will seek fresh consent where required.",
          ]}
        />
        <p>
          We encourage you to review this policy periodically. Your continued
          use of the Service after any changes constitutes your acceptance of
          the updated policy.
        </p>
      </PrivacySection>

      {/* 11. Contact */}
      <PrivacySection id="contact" title="Contact & DPO" icon={Mail} index={11}>
        <p>
          If you have questions, concerns, or requests relating to this Privacy
          Policy or how we handle your data, please reach out to us:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-1.5 text-sm">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              General Privacy Enquiries
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Email:{" "}
              <a
                href="mailto:focurabusiness@gmail.com"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
              >
                focurabusiness@gmail.com
              </a>
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Response time: within 2 business days
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-1.5 text-sm">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              Security Vulnerabilities
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Email:{" "}
              <a
                href="mailto:focurabusiness@gmail.com"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
              >
                focurabusiness@gmail.com
              </a>
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Responsible disclosure welcome
            </p>
          </div>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          You also have the right to lodge a complaint with your local
          supervisory authority (e.g., the ICO in the UK, or your national DPA
          within the EU) if you believe we have not handled your data lawfully.
        </p>
      </PrivacySection>
    </div>
  );
};