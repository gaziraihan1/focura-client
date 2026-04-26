"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "General",
    question: "How quickly will I get a reply?",
    answer:
      "We aim to respond to all enquiries within 2 business days (Monday to Friday, 9 AM – 6 PM GMT+6). You'll receive an automatic confirmation email immediately after submitting the form.",
  },
  {
    category: "General",
    question: "Can I contact support without creating an account?",
    answer:
      "Yes — the contact form is open to everyone. No Focura account is required to reach us. Simply fill in your name, email, and message.",
  },
  {
    category: "Billing",
    question: "I was charged but can't access my plan. What should I do?",
    answer:
      "Select \"Billing & Subscriptions\" as the category and include your registered email address and the Paddle Order ID from your receipt. We'll investigate and resolve access issues within 1 business day.",
  },
  {
    category: "Billing",
    question: "How do I request a refund?",
    answer:
      "Please review our Refund Policy page first to check eligibility. If you qualify (first-time subscription, within 7 days, minimal usage), email focurabusiness@gmail.com with your name, email, Order ID, and reason. See the full policy at /refund.",
  },
  {
    category: "Technical",
    question: "I found a bug — what information should I include?",
    answer:
      "Select \"Technical Issue\" as the category. Include: your browser and OS, the steps to reproduce the bug, what you expected vs what happened, and any screenshots or screen recordings. Console errors (F12 → Console) are especially helpful.",
  },
  {
    category: "Technical",
    question: "I found a security vulnerability. How should I report it?",
    answer:
      "Please do NOT open a public GitHub issue. Instead, email security@focura.app with a detailed description. We follow a responsible disclosure process and will acknowledge your report within 48 hours.",
  },
  {
    category: "Feature Requests",
    question: "Can I suggest a new feature?",
    answer:
      "Absolutely — select \"Feature Request\" from the category dropdown. Describe what you're trying to accomplish and why the feature would help. You can also vote on existing feature requests from inside your Focura account under Settings → Feature Requests.",
  },
  {
    category: "Partnership",
    question: "I'm interested in a partnership or integration. Who do I contact?",
    answer:
      "Select \"Partnership\" as the category. Briefly describe your company, what kind of partnership you have in mind, and your timeline. We review all partnership enquiries and respond to qualified leads within 3 business days.",
  },
];

interface FAQRowProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQRow({ item, isOpen, onToggle }: FAQRowProps) {
  return (
    <div className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
      >
        <div className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
            {item.category}
          </span>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors leading-snug">
            {item.question}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 text-neutral-400 dark:text-neutral-500 transition-transform duration-200 mt-5",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export const ContactFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
          FAQ
        </p>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Common questions
        </h2>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5">
        {faqs.map((item, i) => (
          <FAQRow
            key={i}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
};