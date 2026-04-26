import {ContactForm} from "./ContactForm";
import {ContactInfo} from "./ContactInfo";
import {ContactFAQ} from "./ContactFaq";

export const ContactContent = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

        {/* ── Left: Form panel ──────────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
            {/* Panel header */}
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Send us a message
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                All fields marked with{" "}
                <span className="text-red-500" aria-hidden>
                  *
                </span>{" "}
                are required.
              </p>
            </div>

            {/* Form */}
            <div className="px-6 py-6">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* ── Right: Info + FAQ sidebar ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-10">
          <ContactInfo />
          <ContactFAQ />
        </div>

      </div>
    </div>
  );
};