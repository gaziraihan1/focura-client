import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Scissors,
  BarChart2,
  Mail,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {RefundSection} from "./RefundSection";
import {RefundHighlight} from "./RefundHighlight";
import {RefundList} from "./RefundList";
import {RefundEligibilityGrid} from "./RefundEligibilityGrid";
import {RefundTimeline} from "./RefundTimeline";
import {RefundRequestCard} from "./RefundRequestCard";
import {RefundPaddleNote} from "./RefundPaddleNote";

const RefundContent = () => {
  return (
    <div className="space-y-10">
      {/* 1. Overview */}
      <RefundSection id="overview" title="Overview" icon={FileText} index={1}>
        <p>
          At Focura, we stand behind the quality of our product. If you are not
          satisfied with your subscription for a qualifying reason, we offer a
          fair and transparent refund process. This policy explains exactly when
          a refund is available, how to request one, and what to expect.
        </p>
        <RefundHighlight variant="info">
          All payments on Focura are processed by{" "}
          <strong className="font-semibold">Paddle</strong>, our Merchant of
          Record. This means Paddle handles the actual charge, tax, and refund
          on our behalf. See{" "}
          <a href="#paddle" className="underline underline-offset-2 font-medium">
            Section 7
          </a>{" "}
          for full Paddle-specific details.
        </RefundHighlight>
        <p>
          Refunds are reviewed on a case-by-case basis. Submitting a request
          does not guarantee approval — each claim is assessed against the
          conditions described below. We aim to respond to every request within
          3–5 business days.
        </p>
      </RefundSection>

      {/* 2. 7-Day Window */}
      <RefundSection
        id="refund-window"
        title="7-Day Refund Window"
        icon={Clock}
        index={2}
      >
        <p>
          Focura offers a{" "}
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            7-calendar-day refund window
          </strong>{" "}
          starting from the date your payment is processed. Requests submitted
          after this window are not eligible for a refund under any
          circumstances, including technical issues discovered after Day 7.
        </p>
        <RefundTimeline />
        <RefundHighlight variant="warning">
          The 7-day clock starts on the exact date and time your payment is
          charged — not when you first log in or activate the plan. Check your
          Paddle receipt for the precise charge timestamp.
        </RefundHighlight>
      </RefundSection>

      {/* 3. Eligible */}
      <RefundSection
        id="eligible"
        title="What Qualifies for a Refund"
        icon={CheckCircle}
        index={3}
      >
        <p>
          A refund may be approved only when{" "}
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            all
          </strong>{" "}
          of the following conditions are satisfied:
        </p>
        <RefundList
          ordered
          items={[
            <span key="first-time">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                First-time subscription only.
              </strong>{" "}
              The refund applies exclusively to the very first subscription
              purchase on your account. Any subsequent charges — including plan
              upgrades made after the initial purchase — are not eligible.
            </span>,
            <span key="light-usage">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Minimal / light product usage.
              </strong>{" "}
              Your account must not have been used heavily during the
              subscription period. We assess usage based on signals such as
              number of workspaces created, tasks logged, active sessions, files
              uploaded, and team members invited. Accounts with significant
              usage will not qualify.
            </span>,
            <span key="technical">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Proven technical issue (if applicable).
              </strong>{" "}
              If your reason is a technical problem, you must provide clear
              evidence — such as error screenshots, screen recordings, or
              browser console logs — demonstrating that a core feature of Focura
              was broken and prevented you from using the product as intended.
              General dissatisfaction without a technical cause is assessed under
              the light-usage condition above.
            </span>,
            <span key="window">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Request submitted within 7 days.
              </strong>{" "}
              Your refund email must be sent to focurabusiness@gmail.com within
              7 calendar days of the original charge date.
            </span>,
            <span key="cancelled">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Subscription cancelled before renewal.
              </strong>{" "}
              You must cancel your subscription before the next billing date as
              part of the refund process. Failure to cancel may result in a
              further charge, which will not be refunded.
            </span>,
          ]}
        />
      </RefundSection>

      {/* 4. Not Eligible */}
      <RefundSection
        id="not-eligible"
        title="What Does Not Qualify"
        icon={XCircle}
        index={4}
      >
        <p>
          The following situations are explicitly excluded from our refund
          policy:
        </p>
        <RefundEligibilityGrid />
        <RefundHighlight variant="warning">
          If you are unsure whether your situation qualifies, email us at{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="underline underline-offset-2 font-semibold"
          >
            focurabusiness@gmail.com
          </a>{" "}
          before the 7-day window closes. We are happy to discuss your case.
        </RefundHighlight>
      </RefundSection>

      {/* 5. Usage Assessment */}
      <RefundSection
        id="usage-assessment"
        title="How We Assess Usage"
        icon={BarChart2}
        index={5}
      >
        <p>
          &quot;Heavy usage&quot; is a key condition that disqualifies a refund. To
          ensure this is applied fairly, we use an objective set of signals when
          reviewing an account. The following activities — individually or in
          combination — indicate significant use of the product:
        </p>
        <RefundList
          items={[
            "Creating 3 or more workspaces or project boards.",
            "Logging 20 or more tasks, items, or entries.",
            "Conducting 10 or more active sessions over the subscription period.",
            "Inviting 2 or more team members or collaborators.",
            "Uploading files totalling more than 50 MB.",
            "Generating reports, exports, or integrating third-party services.",
            "Using premium features such as advanced analytics or automations more than 5 times.",
          ]}
        />
        <p>
          These thresholds are guidelines, not hard rules. We apply reasonable
          judgement and consider the overall picture of how the account was used.
          Accounts that clearly received significant value from the subscription
          will not be eligible for a refund, even if they fall below individual
          thresholds.
        </p>
        <RefundHighlight variant="info">
          We will never share granular usage data in public communications.
          During a refund review, usage metrics relevant to your case will be
          shared with you privately in our email correspondence.
        </RefundHighlight>
      </RefundSection>

      {/* 6. Cancellation Requirement */}
      <RefundSection
        id="cancellation"
        title="Cancellation Before Renewal"
        icon={Scissors}
        index={6}
      >
        <p>
          A refund request must be accompanied by cancellation of your
          subscription. We do not process refunds for accounts that remain
          active and renew after the request is submitted.
        </p>
        <RefundList
          ordered
          items={[
            "Log in to your Focura account and navigate to Settings → Billing.",
            'Click "Cancel Subscription" and confirm the cancellation.',
            "You will receive a Paddle cancellation confirmation email — include this in your refund request as proof.",
            "Your account will remain on the paid plan until the end of the current billing period.",
            "Once the refund is approved, access may be revoked before the period ends.",
          ]}
        />
        <RefundHighlight variant="warning">
          If your subscription renews before we process your refund request, the
          renewal charge is not refundable. It is your responsibility to cancel
          before the next billing date. You can find your next renewal date in
          Settings → Billing or in your Paddle receipt.
        </RefundHighlight>
      </RefundSection>

      {/* 7. Paddle */}
      <RefundSection
        id="paddle"
        title="Paddle & Payment Processing"
        icon={ShieldCheck}
        index={7}
      >
        <p>
          Because Paddle acts as our Merchant of Record, the mechanics of refund
          processing differ slightly from a direct payment provider. Here is
          everything you need to know:
        </p>
        <RefundPaddleNote />
      </RefundSection>

      {/* 8. How to Request */}
      <RefundSection
        id="how-to-request"
        title="How to Submit a Refund Request"
        icon={Mail}
        index={8}
      >
        <p>
          To request a refund, send an email to{" "}
          <a
            href="mailto:focurabusiness@gmail.com"
            className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors font-medium"
          >
            focurabusiness@gmail.com
          </a>{" "}
          with the subject line{" "}
          <span className="font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs">
            Refund Request — [Your Name] — [Order ID]
          </span>{" "}
          and include all of the fields listed below. Incomplete requests will
          be returned for more information, which may cause you to miss the
          7-day window.
        </p>
        <RefundRequestCard />
      </RefundSection>

      {/* 9. Exceptions */}
      <RefundSection
        id="exceptions"
        title="Exceptions & Special Cases"
        icon={AlertCircle}
        index={9}
      >
        <p>
          We recognise that circumstances can be unusual. The following
          situations are handled with additional care:
        </p>
        <RefundList
          items={[
            <span key="double">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Duplicate charges:
              </strong>{" "}
              If you were charged more than once for the same plan due to a
              payment error, we will refund the duplicate charge in full,
              regardless of the 7-day window. Provide both Order IDs.
            </span>,
            <span key="fraud">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Unauthorised charges:
              </strong>{" "}
              If you believe your account was accessed without your permission
              and a subscription was purchased fraudulently, contact us
              immediately at{" "}
              <a
                href="mailto:security@focura.app"
                className="underline underline-offset-2 text-neutral-900 dark:text-neutral-100"
              >
                security@focura.app
              </a>
              . We will investigate and work with Paddle to resolve the issue.
            </span>,
            <span key="extended">
              <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
                Extended service outages:
              </strong>{" "}
              If Focura experiences a verified outage lasting more than 48
              continuous hours during your subscription period, you may be
              eligible for a pro-rated credit or partial refund at our
              discretion.
            </span>,
          ]}
        />
        <RefundHighlight variant="info">
          Exceptions are handled on a case-by-case basis at Focura&apos;s sole
          discretion. Raising an exception does not guarantee a refund but we
          commit to reviewing every claim honestly and responding in writing.
        </RefundHighlight>
      </RefundSection>

      {/* 10. Policy Changes */}
      <RefundSection
        id="policy-changes"
        title="Changes to This Policy"
        icon={RefreshCw}
        index={10}
      >
        <p>
          We may update this Refund Policy from time to time to reflect changes
          in our products, pricing, or legal obligations. When we make material
          changes, we will notify existing subscribers via email at least 14
          days before the new policy takes effect.
        </p>
        <p>
          The policy in force at the time of your purchase is the one that
          governs your refund eligibility for that transaction — even if the
          policy is later updated. We will always honour the terms that were
          active when you paid.
        </p>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-2 text-sm">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            Questions about this policy?
          </p>
          <p className="text-neutral-500 dark:text-neutral-400">
            Email us at{" "}
            <a
              href="mailto:focurabusiness@gmail.com"
              className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
            >
              focurabusiness@gmail.com
            </a>{" "}
            — we typically respond within 2 business days.
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 pt-1">
            Last Updated: April 25, 2026 · Version 1.0 · Effective: January 1,
            2026
          </p>
        </div>
      </RefundSection>
    </div>
  );
};

export default RefundContent;