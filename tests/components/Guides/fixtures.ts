import type { GuideSection } from "@/types/guides.types";

export const guideSections: GuideSection[] = [
  {
    id: "getting-started",
    icon: "✦",
    label: "Getting Started",
    color: "blue",
    title: "Getting Started",
    subtitle: "Your first steps in Focura",
    articles: [
      { title: "Creating your account", content: "Sign up with your email address or Google." },
      { title: "Creating your workspace", content: "Enter a name that represents your team." },
    ],
  },
  {
    id: "tasks",
    icon: "◉",
    label: "Tasks & Subtasks",
    color: "amber",
    title: "Tasks & Subtasks",
    subtitle: "Create, assign, and track work items",
    articles: [
      { title: "Creating a task", content: "Click New Task and fill in the details." },
      { title: "Recurring tasks", content: "Toggle Recurring and choose a pattern." },
    ],
  },
  {
    id: "billing",
    icon: "◆",
    label: "Billing & Plans",
    color: "cyan",
    title: "Billing & Plans",
    subtitle: "Manage your subscription",
    articles: [{ title: "Available plans", content: "Free, Pro, Business, and Enterprise plans." }],
  },
];
