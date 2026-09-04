export const faqs = [
  {
    q: "What is Gablura?",
    a: "Gablura is a modern workflow and productivity platform designed to help teams plan, collaborate, and execute with total clarity.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Gablura uses enterprise-grade encryption, secure cloud hosting, and strict access controls to protect your data.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. You can get started with Gablura for free — no credit card required.",
  },
  {
    q: "Can I invite my team members?",
    a: "Absolutely. You can add team members, assign roles, and collaborate in real time.",
  },
  {
    q: "Does Gablura offer customer support?",
    a: "Yes. We provide 24/7 support via email and chat, along with detailed documentation.",
  },
];

export type ShowcaseVariant = "workspace" | "collaborate" | "automation";

export const features = [
  {
    title: "Organize your workspace effortlessly",
    desc: "Create structured roadmaps, assign tasks, and visualize your team's workload with clarity. Gablura makes planning intuitive and powerful.",
    variant: "workspace" as ShowcaseVariant,
    reverse: false,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Collaborate in real time",
    desc: "Keep everyone aligned with live updates, instant notifications, and seamless communication — all inside one unified workspace.",
    variant: "collaborate" as ShowcaseVariant,
    reverse: true,
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Automate the busywork",
    desc: "Save time by automating repetitive tasks. Set triggers, create workflows, and let Gablura handle the busywork for your team.",
    variant: "automation" as ShowcaseVariant,
    reverse: false,
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80",
  },
];

export const integrations = [
  { name: "Slack", logo: "/images/slack_logo_icon.png" },
  { name: "Notion", logo: "/images/notion_logo_icon.png" },
  { name: "Google Drive", logo: "/images/google_drive_logo_icon.png" },
  { name: "Figma", logo: "/images/figma_logo_icon.png" },
  { name: "Asana", logo: "/images/asana_logo_icon.png" },
  { name: "Trello", logo: "/images/trello_icon-icons.png" },
];

export const plans = [
  {
    name: "Starter",
    price: "Free",
    tagline: "For individuals getting started.",
    features: [
      "Up to 3 projects",
      "Basic task management",
      "Single workspace",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    tagline: "For teams that need momentum.",
    features: [
      "Unlimited projects",
      "Team collaboration tools",
      "Real-time updates",
      "Advanced analytics",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    tagline: "For organizations that need control.",
    features: [
      "Unlimited workspaces",
      "Custom roles and permissions",
      "Automation workflows",
      "Audit logs",
      "Dedicated manager",
    ],
    highlighted: false,
  },
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Lead, Northwind",
    quote:
      "Gablura gave our team back hours every week. Planning finally feels effortless instead of exhausting.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Marcus Reed",
    role: "Engineering Manager, Buildly",
    quote:
      "We shipped 40% faster once everyone could see the same plan. The focus features are genuinely different.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Amara Okafor",
    role: "Operations Director, Lumen",
    quote:
      "The first tool our team actually enjoys opening. Clear, calm, and incredibly easy to use.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
];
