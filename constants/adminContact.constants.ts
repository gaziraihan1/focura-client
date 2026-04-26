// ─── Constants ────────────────────────────────────────────────────────────────

import { ContactCategory, ContactStatus } from "@/hooks/useContactMessage";

export const STATUS_OPTIONS: { value: ContactStatus | ""; label: string }[] = [
  { value: "",         label: "All Statuses" },
  { value: "UNREAD",   label: "Unread" },
  { value: "READ",     label: "Read" },
  { value: "REPLIED",  label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

export const CATEGORY_OPTIONS: { value: ContactCategory | ""; label: string }[] = [
  { value: "",                label: "All Categories" },
  { value: "GENERAL",         label: "General" },
  { value: "BILLING",         label: "Billing" },
  { value: "TECHNICAL",       label: "Technical" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "BUG_REPORT",      label: "Bug Report" },
  { value: "OTHER",           label: "Other" },
];

// All colors come from your CSS variable token system — no raw color values
export const STATUS_CLASSES: Record<ContactStatus, string> = {
  UNREAD:   "bg-primary/10 text-primary ring-1 ring-primary/20",
  READ:     "bg-muted text-muted-foreground ring-1 ring-border",
  REPLIED:  "bg-chart-2/15 text-chart-2 ring-1 ring-chart-2/25",
  ARCHIVED: "bg-chart-4/15 text-chart-5 ring-1 ring-chart-4/25",
};

export const CATEGORY_CLASSES: Record<ContactCategory, string> = {
  GENERAL:         "bg-muted text-muted-foreground",
  BILLING:         "bg-chart-1/10 text-chart-1",
  TECHNICAL:       "bg-destructive/10 text-destructive",
  FEATURE_REQUEST: "bg-chart-2/10 text-chart-2",
  BUG_REPORT:      "bg-chart-5/10 text-chart-5",
  OTHER:           "bg-secondary text-secondary-foreground",
};