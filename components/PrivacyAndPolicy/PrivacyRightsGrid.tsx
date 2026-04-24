import {
  Eye,
  Pencil,
  Trash2,
  Download,
  Ban,
  HandMetal,
  Megaphone,
  RefreshCw,
} from "lucide-react";

const rights = [
  {
    icon: Eye,
    title: "Right to Access",
    description:
      "Request a copy of the personal data we hold about you at any time.",
  },
  {
    icon: Pencil,
    title: "Right to Rectification",
    description:
      "Correct inaccurate or incomplete personal information in your account.",
  },
  {
    icon: Trash2,
    title: "Right to Erasure",
    description:
      'Request deletion of your personal data ("right to be forgotten").',
  },
  {
    icon: Download,
    title: "Right to Portability",
    description:
      "Export your data in a structured, machine-readable format at any time.",
  },
  {
    icon: Ban,
    title: "Right to Restrict",
    description:
      "Ask us to limit how we process your data in certain circumstances.",
  },
  {
    icon: HandMetal,
    title: "Right to Object",
    description:
      "Object to processing of your data for direct marketing or profiling.",
  },
  {
    icon: Megaphone,
    title: "Right to Complain",
    description:
      "Lodge a complaint with your local data protection authority at any time.",
  },
  {
    icon: RefreshCw,
    title: "Right to Withdraw",
    description:
      "Withdraw consent for data processing at any time without penalty.",
  },
];

export const PrivacyRightsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {rights.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex items-start gap-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-4"
        >
          <div className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-sm">
            <Icon className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
              {title}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
