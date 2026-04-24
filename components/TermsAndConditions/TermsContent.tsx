import {
  FileText,
  UserCheck,
  ShieldCheck,
  Lock,
  CreditCard,
  Ban,
  Scale,
  RefreshCw,
  Mail,
  Globe,
} from "lucide-react";
import {TermsSection} from "./TermsSection";
import {TermsHighlight} from "./TermsHighlight";
import {TermsList} from "./TermsList";

const TermsContent = () => {
  return (
    <div className="space-y-10">
      {/* 1. Introduction */}
      <TermsSection id="introduction" title="Introduction" icon={FileText} index={1}>
        <p>
          Welcome to Focura (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms &amp; Conditions govern your
          access to and use of the Focura platform, including our website, web
          application, APIs, and all related services (collectively, the
          &quot;Service&quot;).
        </p>
        <TermsHighlight variant="info">
          By creating an account or using any part of the Service, you acknowledge
          that you have read, understood, and agree to be bound by these Terms. If
          you do not agree, please do not use Focura.
        </TermsHighlight>
        <p>
          These Terms apply to all users of the Service, including visitors,
          registered users, workspace administrators, and team members. If you are
          using the Service on behalf of an organization, you represent that you
          have the authority to bind that organization to these Terms.
        </p>
      </TermsSection>

      {/* 2. Eligibility */}
      <TermsSection id="eligibility" title="Eligibility & Account Registration" icon={UserCheck} index={2}>
        <p>
          To use Focura you must meet the following requirements:
        </p>
        <TermsList
          items={[
            "Be at least 16 years of age (or the age of digital consent in your jurisdiction, whichever is higher).",
            "Provide accurate, current, and complete information during registration and keep it updated.",
            "Maintain the confidentiality of your login credentials and be responsible for all activity under your account.",
            "Not create accounts using automated means or false identities.",
            "Not use the Service if you are prohibited from doing so by applicable law.",
          ]}
        />
        <p>
          You are responsible for all actions taken through your account. Notify us
          immediately at{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
          >
            focurabusiness@gmail.com
          </a>{" "}
          if you suspect any unauthorized access.
        </p>
      </TermsSection>

      {/* 3. Acceptable Use */}
      <TermsSection id="acceptable-use" title="Acceptable Use Policy" icon={ShieldCheck} index={3}>
        <p>
          You agree to use the Service only for lawful purposes and in a manner
          consistent with all applicable local, national, and international laws
          and regulations. You must not:
        </p>
        <TermsList
          items={[
            "Upload, transmit, or distribute any content that is unlawful, harmful, abusive, defamatory, or otherwise objectionable.",
            "Attempt to gain unauthorized access to any portion of the Service or related systems.",
            "Use the Service to send unsolicited communications (spam) or to harvest data without consent.",
            "Introduce malware, viruses, or any destructive code into the platform.",
            "Reverse-engineer, decompile, or attempt to extract source code from Focura.",
            "Resell, sublicense, or commercially exploit the Service without our written consent.",
            "Interfere with or disrupt the integrity or performance of the Service or other users' use of it.",
          ]}
        />
        <TermsHighlight variant="warning">
          Violation of this Acceptable Use Policy may result in immediate
          suspension or permanent termination of your account without refund.
        </TermsHighlight>
      </TermsSection>

      {/* 4. Intellectual Property */}
      <TermsSection id="intellectual-property" title="Intellectual Property" icon={Lock} index={4}>
        <p>
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            Our IP:
          </strong>{" "}
          The Focura platform, including its design, code, trademarks, logos, and
          all related materials, are owned by or licensed to us and are protected
          by applicable intellectual property laws. Nothing in these Terms
          transfers ownership of Focura&apos;s IP to you.
        </p>
        <p>
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            Your Content:
          </strong>{" "}
          You retain full ownership of all content, data, and materials you upload
          or create within the Service (&quot;User Content&quot;). By using Focura, you
          grant us a limited, non-exclusive, royalty-free license to store, process,
          and display your User Content solely to operate and improve the Service.
        </p>
        <TermsList
          items={[
            "You are solely responsible for the legality and accuracy of your User Content.",
            "We do not claim ownership of any data, files, or work products you create.",
            "You may export your data at any time through your account settings.",
          ]}
        />
      </TermsSection>

      {/* 5. Billing */}
      <TermsSection id="billing" title="Billing & Subscriptions" icon={CreditCard} index={5}>
        <p>
          Focura offers both free and paid subscription plans. By subscribing to a
          paid plan, you agree to the following:
        </p>
        <TermsList
          ordered
          items={[
            "Billing is processed monthly or annually depending on the plan selected at checkout.",
            "All payments are handled by our third-party payment processor (Stripe) and are subject to their terms.",
            "Subscription fees are non-refundable except as required by applicable law or expressly stated in our Refund Policy.",
            "We reserve the right to modify pricing with 30 days advance notice to existing subscribers.",
            "Failure to pay may result in downgrade to the free plan or suspension of your account.",
          ]}
        />
        <TermsHighlight variant="success">
          You may cancel your subscription at any time. Cancellation takes effect
          at the end of the current billing period and you will continue to have
          access to paid features until then.
        </TermsHighlight>
      </TermsSection>

      {/* 6. Termination */}
      <TermsSection id="termination" title="Termination & Suspension" icon={Ban} index={6}>
        <p>
          Either party may terminate the relationship at any time:
        </p>
        <p>
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            By You:
          </strong>{" "}
          You may delete your account at any time through your account settings.
          Upon deletion, your data will be permanently removed within 30 days,
          subject to our data retention obligations under applicable law.
        </p>
        <p>
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            By Us:
          </strong>{" "}
          We reserve the right to suspend or terminate your account immediately
          and without notice if:
        </p>
        <TermsList
          items={[
            "You violate these Terms or our Acceptable Use Policy.",
            "We are required to do so by law or court order.",
            "Your account poses a security risk to us or other users.",
            "You engage in fraudulent, abusive, or deceptive behavior.",
          ]}
        />
        <p>
          Upon termination, your right to use the Service ceases immediately.
          Provisions that by their nature should survive termination (including
          intellectual property rights, disclaimers, and limitation of liability)
          will remain in effect.
        </p>
      </TermsSection>

      {/* 7. Liability */}
      <TermsSection id="liability" title="Disclaimers & Limitation of Liability" icon={Scale} index={7}>
        <TermsHighlight variant="warning">
          The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties
          of any kind, either express or implied, including but not limited to
          fitness for a particular purpose or non-infringement.
        </TermsHighlight>
        <p>
          To the fullest extent permitted by applicable law, Focura and its
          officers, directors, employees, and agents shall not be liable for:
        </p>
        <TermsList
          items={[
            "Any indirect, incidental, special, consequential, or punitive damages.",
            "Loss of data, revenue, profits, goodwill, or business opportunities.",
            "Unauthorized access to or alteration of your data.",
            "Downtime, interruptions, or errors in the Service.",
          ]}
        />
        <p>
          In no event shall our total aggregate liability exceed the greater of
          (a) $100 USD or (b) the amount you paid us in the 12 months preceding
          the claim.
        </p>
      </TermsSection>

      {/* 8. Changes */}
      <TermsSection id="changes" title="Changes to These Terms" icon={RefreshCw} index={8}>
        <p>
          We may update these Terms from time to time. When we do:
        </p>
        <TermsList
          ordered
          items={[
            "We will update the \"Last Updated\" date at the top of this page.",
            "For material changes, we will notify you via email or an in-app notice at least 14 days before the changes take effect.",
            "Your continued use of the Service after the effective date constitutes acceptance of the revised Terms.",
          ]}
        />
        <p>
          We recommend reviewing these Terms periodically to stay informed of your
          rights and obligations.
        </p>
      </TermsSection>

      {/* 9. Governing Law */}
      <TermsSection id="governing-law" title="Governing Law & Disputes" icon={Globe} index={9}>
        <p>
          These Terms are governed by and construed in accordance with the laws of
          the jurisdiction in which Focura is incorporated, without regard to its
          conflict of law provisions.
        </p>
        <p>
          Any dispute arising out of or relating to these Terms or the Service
          shall first be addressed through good-faith negotiation. If unresolved,
          disputes shall be settled by binding arbitration, except that either
          party may seek injunctive relief in any court of competent jurisdiction.
        </p>
      </TermsSection>

      {/* 10. Contact */}
      <TermsSection id="contact" title="Contact Us" icon={Mail} index={10}>
        <p>
          If you have any questions, concerns, or feedback about these Terms,
          please reach out:
        </p>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-2 text-sm">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">Focura Legal Team</p>
          <p>
            Email:{" "}
            <a
              href="mailto:focurabusiness@gmail.com"
              className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
            >
              focurabusiness@gmail.com
            </a>
          </p>
          <p>
            Website:{" "}
            <a
              href="https://focura-client.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
            >
              focura-client.vercel.app
            </a>
          </p>
          <p className="text-neutral-500 dark:text-neutral-500 text-xs pt-1">
            We aim to respond to all inquiries within 2 business days.
          </p>
        </div>
      </TermsSection>
    </div>
  );
};

export default TermsContent;