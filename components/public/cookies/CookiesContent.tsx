import {
  FileText,
  Cookie,
  Database,
  Globe,
  ToggleRight,
  MonitorSmartphone,
  RefreshCw,
  Mail,
} from "lucide-react";
import {CookiesSection} from "./CookiesSection";
import {CookiesHighlight} from "./CookiesHighlight";
import {CookiesList} from "./CookiesList";
import {CookiesTypeTable} from "./CookiesTypeTable";
import {CookiesCategoryCards} from "./CookiesCategoryCards";
import {CookiesBrowserGuide} from "./CookiesBrowserGuide";

export const CookiesContent = () => {
  return (
    <div className="space-y-10">
      <CookiesBasicsSections />
      <CookiesConsentSections />
    </div>
  );
};

/** Sections 1–4: what cookies are, categories, full list, third-party services. */
function CookiesBasicsSections() {
  return (
    <>
      {/* 1. What Are Cookies */}
      <CookiesSection
        id="what-are-cookies"
        title="What Are Cookies?"
        icon={FileText}
        index={1}
      >
        <p>
          Cookies are small text files that a website stores on your device
          (computer, tablet, or phone) when you visit. They allow the site to
          remember information about your visit — such as whether you are logged
          in, your display preferences, or which pages you visited — so that you
          do not have to re-enter that information every time you return.
        </p>
        <p>
          In addition to cookies, Gablura may use similar technologies such as{" "}
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            localStorage
          </strong>
          ,{" "}
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            sessionStorage
          </strong>
          , and{" "}
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            pixel tags
          </strong>
          . Where this policy refers to &quot;cookies,&quot; it applies to all these
          technologies equally.
        </p>
        <CookiesHighlight variant="info">
          Cookies set by Gablura (&quot;first-party cookies&quot;) are used exclusively to
          operate and improve our platform. We do not allow third-party
          advertising networks to set cookies on Gablura pages.
        </CookiesHighlight>
      </CookiesSection>

      {/* 2. Cookie Categories */}
      <CookiesSection
        id="cookie-categories"
        title="Cookie Categories We Use"
        icon={Cookie}
        index={2}
      >
        <p>
          We use three categories of cookies. The category determines whether
          we need your consent to set them and how long they persist on your
          device.
        </p>
        <CookiesCategoryCards />
        <CookiesHighlight variant="success">
          We do not use advertising cookies, cross-site tracking cookies, or
          any cookies that build profiles used to serve targeted ads — on
          Gablura or anywhere else.
        </CookiesHighlight>
      </CookiesSection>

      {/* 3. Full Cookie List */}
      <CookiesSection
        id="cookie-list"
        title="Complete Cookie Reference"
        icon={Database}
        index={3}
      >
        <p>
          The table below lists every cookie currently set by Gablura, its
          purpose, how long it lasts, and whether it requires your consent. We
          keep this list up to date whenever a cookie is added, changed, or
          removed.
        </p>
        <CookiesTypeTable />
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Session cookies are deleted automatically when you close your browser.
          Persistent cookies remain on your device for the duration shown above,
          unless cleared manually or by withdrawing consent.
        </p>
      </CookiesSection>

      {/* 4. Third-Party Cookies */}
      <CookiesSection
        id="third-party"
        title="Third-Party Services"
        icon={Globe}
        index={4}
      >
        <p>
          Some features of Gablura embed or connect to third-party services.
          These services may set their own cookies subject to their own privacy
          policies. The third parties we currently integrate with are:
        </p>
        <CookiesList
          items={[
            <span key="google">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Google
              </strong>{" "}
              — we use Google Analytics to measure aggregate usage (page views,
              session duration, feature usage) and Google OAuth for sign-in.
              Google Analytics sets the{" "}
              <span className="font-mono text-xs">_ga</span>,{" "}
              <span className="font-mono text-xs">_ga_&lt;MEASUREMENT_ID&gt;</span> and{" "}
              <span className="font-mono text-xs">_gid</span> cookies listed
              above, and sign-in with Google may set cookies on
              accounts.google.com governed by Google&apos;s own policies. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
              >
                Google&apos;s Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://support.google.com/analytics/answer/6004245"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
              >
                Google&apos;s Analytics Data Policy
              </a>
              .
            </span>,
            <span key="lemonsqueezy">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Lemon Squeezy
              </strong>{" "}
              — our payment processor and Merchant of Record. Lemon Squeezy may set
              cookies during the checkout flow to detect fraud and process
              transactions securely. See{" "}
              <a
                href="https://www.lemonsqueezy.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
              >
                Lemon Squeezy&apos;s Privacy Policy
              </a>
              .
            </span>,
            <span key="cloudinary">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Cloudinary
              </strong>{" "}
              — our image and file storage provider. Cloudinary stores the
              files you upload (e.g. avatars, attachments) so they can be
              served to your team. Files are transmitted and stored securely;
              Cloudinary does not set cookies on Gablura pages. See{" "}
              <a
                href="https://cloudinary.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
              >
                Cloudinary&apos;s Privacy Policy
              </a>
              .
            </span>,
            <span key="vercel">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Vercel
              </strong>{" "}
              — our hosting and CDN provider. Vercel also powers Speed
              Insights, which measures Core Web Vitals without setting
              cookies. See{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
              >
                Vercel&apos;s Privacy Policy
              </a>
              .
            </span>,
          ]}
        />
        <CookiesHighlight variant="info">
          We review all third-party integrations before adding them to ensure
          they meet our data minimisation standards. We do not integrate
          advertising networks, social media trackers, or data brokers.
        </CookiesHighlight>
      </CookiesSection>
    </>
  );
}

/** Sections 5–8: consent controls, browser guides, policy changes, contact. */
function CookiesConsentSections() {
  return (
    <>
      {/* 5. Managing Consent */}
      <CookiesSection
        id="managing-consent"
        title="Managing Your Cookie Preferences"
        icon={ToggleRight}
        index={5}
      >
        <p>
          You are in control. On your first visit, a consent banner appears at
          the bottom of the screen where you can accept or decline analytics
          cookies. Your choice is stored on your device and can be changed at
          any time without affecting your ability to use the core features of
          Gablura.
        </p>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Current Cookie Controls
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              What Gablura sets today and how to control it
            </p>
          </div>

          {/* Current status per category — honest, not fake toggles */}
          {[
            {
              label: "Strictly Necessary",
              status: "Always On",
              statusClass:
                "text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800",
              description:
                "Required for authentication, sessions, and security. These cannot be disabled.",
            },
            {
              label: "Functional",
              status: "Opt-Out",
              statusClass:
                "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/40",
              description:
                "Theme preference — stored in a small cookie and mirrored in localStorage. Block it in your browser to reset your preference each visit.",
            },
            {
              label: "Analytics",
              status: "Opt-In",
              statusClass:
                "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/40",
              description:
                "Google Analytics usage data — loads only after you accept the consent banner. Decline, or clear your stored choice, to keep it off.",
            },
          ].map(({ label, status, statusClass, description }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {label}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {description}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
              >
                {status}
              </span>
            </div>
          ))}

          <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Your consent choice is stored on this device (
              <span className="font-mono font-semibold">gablura-consent</span>{" "}
              in localStorage). To change it later, clear your saved
              preferences using the browser controls in the next section — the
              banner will reappear on your next visit.
            </p>
          </div>
        </div>
        <CookiesHighlight variant="warning">
          Strictly necessary cookies are exempt from consent under the ePrivacy
          Directive — blocking them in your browser will prevent Gablura from
          authenticating your session. Functional and analytics cookies can be
          blocked at any time without breaking core functionality.
        </CookiesHighlight>
      </CookiesSection>

      {/* 6. Browser Controls */}
      <CookiesSection
        id="browser-controls"
        title="Browser-Level Cookie Controls"
        icon={MonitorSmartphone}
        index={6}
      >
        <p>
          All major browsers let you view, block, and delete cookies directly
          through their settings. Use the guides below to find the right option
          for your browser:
        </p>
        <CookiesBrowserGuide />
        <CookiesHighlight variant="warning">
          Blocking strictly necessary cookies at the browser level will prevent
          Gablura from authenticating your session. You will be signed out and
          unable to log back in until cookies are re-enabled for{" "}            <span className="font-mono font-semibold">gablura.vercel.app</span>.
        </CookiesHighlight>
        <p>
          You can also opt out of analytics tracking across many websites using
          the{" "}
          <a
            href="https://optout.aboutads.info"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
          >
            Digital Advertising Alliance opt-out tool
          </a>{" "}
          or the{" "}
          <a
            href="https://www.youronlinechoices.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
          >
            Your Online Choices portal
          </a>{" "}
          (EU).
        </p>
      </CookiesSection>

      {/* 7. Policy Changes */}
      <CookiesSection
        id="policy-changes"
        title="Changes to This Policy"
        icon={RefreshCw}
        index={7}
      >
        <p>
          We may update this Cookie Policy to reflect changes in the cookies we
          use, new legal requirements under GDPR or the ePrivacy Directive, or
          changes to the services we integrate with. When we make material
          changes:
        </p>
        <CookiesList
          ordered
          items={[
            'We update the "Last Updated" date at the top of this page.',
            "We add new cookies to the Complete Cookie Reference table within 7 days of deployment.",
            "For changes that require renewed consent under GDPR or the ePrivacy Directive, we will update this page and notify you where required.",
          ]}
        />
        <p>
          We recommend bookmarking this page and checking back periodically,
          especially if you manage cookie compliance for your organisation.
        </p>
      </CookiesSection>

      {/* 8. Contact */}
      <CookiesSection id="contact" title="Contact Us" icon={Mail} index={8}>
        <p>
          If you have questions about how Gablura uses cookies, or wish to
          exercise any rights related to your data, please contact us:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-1.5 text-sm">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              General Privacy &amp; Cookies
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Email:{" "}
              <a
                href="mailto:privacy@gablura.app"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
              >
                privacy@gablura.app
              </a>
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Response within 2 business days
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-1.5 text-sm">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              Business &amp; Billing
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
              Response within 2 business days
            </p>
          </div>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Last Updated: August 11, 2026 · Version 1.1 · Effective: January 1,
          2026
        </p>
      </CookiesSection>
    </>
  );
}
