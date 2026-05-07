"use client";

import {
  Bell,
  Brush,
  CreditCard,
  Globe,
  KeyRound,
  Lock,
  Monitor,
  Palette,
  Settings2,
  Shield,
  User2,
  Wrench,
} from "lucide-react";

const globalSettings = [
  
  {
    title: "Account",
    description:
      "Update login credentials, connected accounts, sessions, and security preferences.",
    icon: Shield,
  },
  {
    title: "Appearance",
    description:
      "Customize theme, sidebar behavior, density, and visual preferences across Focura.",
    icon: Palette,
  },
  {
    title: "Notifications",
    description:
      "Configure email, push, mentions, reminders, and activity notifications.",
    icon: Bell,
  },
  {
    title: "Integrations",
    description:
      "Connect GitHub, Slack, Google Calendar, Discord, and external tools.",
    icon: Globe,
  },
  {
    title: "API & Tokens",
    description:
      "Generate personal API tokens and manage developer access securely.",
    icon: KeyRound,
  },
];

const workspaceSettings = [
  {
    title: "Workspace General",
    description:
      "Manage workspace name, logo, slug, branding, and visibility settings.",
    icon: Settings2,
  },
  {
    title: "Members & Roles",
    description:
      "Invite teammates, manage permissions, roles, and collaboration access.",
    icon: User2,
  },
  {
    title: "Billing",
    description:
      "Manage subscriptions, invoices, seat limits, and workspace plans.",
    icon: CreditCard,
  },
  {
    title: "Security",
    description:
      "Configure workspace-level security rules, policies, and protections.",
    icon: Lock,
  },
  {
    title: "Workspace Integrations",
    description:
      "Connect shared integrations and automation tools for your workspace.",
    icon: Wrench,
  },
  {
    title: "Appearance & Branding",
    description:
      "Customize workspace visuals, colors, and future branding capabilities.",
    icon: Brush,
  },
];

function SettingsCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl border border-border
        bg-card p-5 transition-all duration-200
        hover:border-primary/20 hover:bg-accent/30
      "
    >
      <div
        className="
          absolute inset-x-0 top-0 h-px
          bg-linear-to-r from-transparent via-primary/40 to-transparent
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      <div className="flex items-start gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-xl border border-border
            bg-secondary text-foreground
          "
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight">
              {title}
            </h3>

            <span
              className="
                rounded-full border border-border
                bg-muted px-2 py-0.5 text-[10px]
                font-medium uppercase tracking-wide
                text-muted-foreground
              "
            >
              Soon
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {items.map((item) => (
          <SettingsCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}

export default function SettingsOverviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 p-6 lg:p-8">
        {/* Header */}
        <div className="space-y-4">
          <div
            className="
              inline-flex items-center gap-2 rounded-full
              border border-border bg-secondary
              px-3 py-1 text-xs font-medium
              text-secondary-foreground
            "
          >
            <Monitor className="h-3.5 w-3.5" />
            Settings Preview
          </div>

          <div className="space-y-3">
            <h1
              className="
                text-3xl font-bold tracking-tight
                sm:text-4xl
              "
            >
              Settings
            </h1>

            <p
              className="
                max-w-3xl text-sm leading-7
                text-muted-foreground sm:text-base
              "
            >
              Focura settings and customization features are currently under
              development. These sections preview the upcoming account,
              workspace, security, integrations, and personalization controls
              that will be added in future updates.
            </p>
          </div>
        </div>

        {/* Global */}
        <SettingsSection
          title="Global Settings"
          description="
          Personal account preferences and settings that apply across all
          workspaces and experiences inside Focura.
          "
          items={globalSettings}
        />

        {/* Workspace */}
        <SettingsSection
          title="Workspace Settings"
          description="
          Team and workspace-level management controls for collaboration,
          permissions, billing, integrations, and organization customization.
          "
          items={workspaceSettings}
        />

        {/* Footer Notice */}
        <div
          className="
            rounded-2xl border border-dashed border-border
            bg-card/50 p-6
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl bg-primary text-primary-foreground
              "
            >
              <Settings2 className="h-5 w-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold tracking-tight">
                More settings are coming soon
              </h3>

              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Upcoming updates will include advanced permissions, audit logs,
                workspace branding, API management, notifications, accessibility
                controls, enterprise security, and automation tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}