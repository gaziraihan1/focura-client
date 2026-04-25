import { ShieldCheck, ExternalLink } from "lucide-react";

export const RefundPaddleNote = () => {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
        {/* Paddle logo placeholder — neutral square with "P" */}
        <div className="w-8 h-8 rounded-lg bg-[#0B2033] flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-extrabold tracking-tight">P</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Paddle Merchant of Record
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            How refunds work within Paddle&apos;s billing infrastructure
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p>
          Focura uses{" "}
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            Paddle
          </strong>{" "}
          as its Merchant of Record (MoR). This means Paddle is the legally
          responsible seller for all transactions made on our platform, and all
          payments are processed, taxed, and receipted by Paddle on our behalf.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              title: "Tax & Compliance",
              body:
                "Paddle handles all sales tax, VAT, and GST collection and remittance globally. You will not be charged additional taxes beyond the displayed price.",
            },
            {
              title: "Payment Receipt",
              body:
                "Your payment receipt comes from Paddle, not Focura directly. Use the Order ID in that receipt when submitting a refund request.",
            },
            {
              title: "Refund Processing",
              body:
                "Once Focura approves your request, we instruct Paddle to issue the refund. Processing time is 5–10 business days depending on your bank or card issuer.",
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 p-4"
            >
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                {title}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 px-4 py-3.5">
          <ShieldCheck
            className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            <strong className="font-semibold">Buyer Protection:</strong> As Paddle
            is the MoR, you may also contact Paddle Support directly if you
            believe a charge was made in error. Paddle&apos;s own refund and dispute
            policies apply in parallel to this policy. We cooperate fully with
            all Paddle-initiated chargebacks and refund reviews.
          </p>
        </div>

        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Learn more about how Paddle operates as a Merchant of Record at{" "}
          <a
            href="https://www.paddle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-300 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-600 transition-colors"
          >
            paddle.com
            <ExternalLink className="w-3 h-3" />
          </a>
          .
        </p>
      </div>
    </div>
  );
};