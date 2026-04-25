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
          In addition to cookies, Focura may use similar technologies such as{" "}
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
          Cookies set by Focura (&quot;first-party cookies&quot;) are used exclusively to
          operate and improve our platform. We do not allow third-party
          advertising networks to set cookies on Focura pages.
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
          Focura or anywhere else.
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
          The table below lists every cookie currently set by Focura, its
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
          Some features of Focura embed or connect to third-party services.
          These services may set their own cookies subject to their own privacy
          policies. The third parties we currently integrate with are:
        </p>
        <CookiesList
          items={[
            <span key="paddle">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Paddle
              </strong>{" "}
              — our payment processor and Merchant of Record. Paddle may set
              cookies during the checkout flow to detect fraud and process
              transactions securely. See{" "}
              <a
                href="https://www.paddle.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
              >
                Paddle&apos;s Privacy Policy
              </a>
              .
            </span>,
            <span key="vercel">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Vercel
              </strong>{" "}
              — our hosting and CDN provider. Vercel may set a cookie for Edge
              network routing. No personal data is stored in this cookie. See{" "}
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

      {/* 5. Managing Consent */}
      <CookiesSection
        id="managing-consent"
        title="Managing Your Cookie Preferences"
        icon={ToggleRight}
        index={5}
      >
        <p>
          You are in control. You can manage non-essential cookie categories at
          any time without affecting your ability to use the core features of
          Focura.
        </p>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              In-App Cookie Preferences
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Toggle non-essential categories without leaving Focura
            </p>
          </div>

          {/* Toggle rows */}
          {[
            {
              label: "Strictly Necessary",
              description: "Required for authentication and core functionality.",
              locked: true,
              defaultOn: true,
            },
            {
              label: "Functional",
              description:
                "Remembers theme, sidebar state, and language preferences.",
              locked: false,
              defaultOn: true,
            },
            {
              label: "Analytics",
              description:
                "Anonymous usage data to help us improve the product.",
              locked: false,
              defaultOn: false,
            },
          ].map(({ label, description, locked, defaultOn }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {label}
                  {locked && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                      Always On
                    </span>
                  )}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {description}
                </p>
              </div>
              {/* Visual toggle — not wired; actual toggle lives in-app */}
              <div
                className={`shrink-0 w-10 h-5.5 rounded-full relative transition-colors ${
                  defaultOn
                    ? "bg-neutral-900 dark:bg-neutral-100"
                    : "bg-neutral-200 dark:bg-neutral-700"
                } ${locked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white dark:bg-neutral-900 shadow transition-all ${
                    defaultOn ? "left-4.5" : "left-0.5"
                  }`}
                />
              </div>
            </div>
          ))}

          <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              To update preferences, go to{" "}
              <span className="font-mono text-neutral-600 dark:text-neutral-300">
                Settings → Privacy → Cookie Preferences
              </span>{" "}
              inside your Focura account.
            </p>
          </div>
        </div>
        <CookiesHighlight variant="warning">
          Withdrawing consent for functional or analytics cookies takes effect
          immediately. Your previously stored preference cookies will be deleted
          at the start of your next session.
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
          Focura from authenticating your session. You will be signed out and
          unable to log back in until cookies are re-enabled for{" "}
          <span className="font-mono font-semibold">focura.app</span>.
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
            "For changes that require renewed consent, we will display an updated consent banner on your next visit.",
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
          If you have questions about how Focura uses cookies, or wish to
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
                href="mailto:privacy@focura.app"
                className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
              >
                privacy@focura.app
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
          Last Updated: April 25, 2026 · Version 1.0 · Effective: January 1,
          2026
        </p>
      </CookiesSection>
    </div>
  );
};
