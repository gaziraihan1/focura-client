"use client";

import { useState } from "react";
import {
  Bell,
  Globe,
  KeyRound,
  Lock,
  Monitor,
  Palette,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { CapacityScheduleForm } from "@/components/Settings/CapacityScheduleForm";
import { AccountSettingsForm } from "@/components/Settings/AccountSettingsForm";
import { AppearanceSettingsForm } from "@/components/Settings/AppearanceSettingsForm";
import { NotificationsSettingsForm } from "@/components/Settings/NotificationsSettingsForm";
import { IntegrationsSettingsForm } from "@/components/Settings/IntegrationsSettingsForm";
import { ApiTokensSettingsForm } from "@/components/Settings/ApiTokensSettingsForm";
import { SecuritySettingsForm } from "@/components/Settings/SecuritySettingsForm";

const globalSettings = [
  {
    title: "Account",
    description:
      "Update login credentials, connected accounts, sessions, and security preferences.",
    icon: Shield,
    active: true,
  },
  {
    title: "Appearance",
    description:
      "Customize theme, sidebar behavior, density, and visual preferences across Focura.",
    icon: Palette,
    active: true,
  },
  {
    title: "Notifications",
    description:
      "Configure email, push, mentions, reminders, and activity notifications.",
    icon: Bell,
    active: true,
  },
  {
    title: "Integrations",
    description:
      "Connect GitHub, Slack, Google Calendar, Discord, and external tools.",
    icon: Globe,
    active: true,
  },
  {
    title: "API & Tokens",
    description:
      "Generate personal API tokens and manage developer access securely.",
    icon: KeyRound,
    active: true,
  },
  {
    title: "Capacity & Schedule",
    description:
      "Set your work hours, capacity, and schedule for accurate workload insights and burnout detection.",
    icon: Clock,
    active: true,
  },
  {
    title: "Security",
    description:
      "Change your password, enable two-factor authentication, and manage active sessions.",
    icon: Lock,
    active: true,
  },
];

const GLOBAL_FORM_MAP: Record<string, React.ComponentType> = {
  "Account": AccountSettingsForm,
  "Appearance": AppearanceSettingsForm,
  "Notifications": NotificationsSettingsForm,
  "Integrations": IntegrationsSettingsForm,
  "API & Tokens": ApiTokensSettingsForm,
  "Capacity & Schedule": CapacityScheduleForm,
  "Security": SecuritySettingsForm,
};

function SettingsCard({
  title,
  description,
  icon: Icon,
  active,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left group relative overflow-hidden rounded-2xl border border-border
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

            {active ? (
              <span
                className="
                  inline-flex items-center gap-1 rounded-full
                  bg-green-500/10 border border-green-500/20
                  px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400
                "
              >
                <CheckCircle2 className="w-3 h-3" />
                Live
              </span>
            ) : (
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
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function SettingsSection({
  title,
  description,
  items,
  onItemClick,
}: {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
    icon: React.ElementType;
    active?: boolean;
  }[];
  onItemClick?: (title: string) => void;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <SettingsCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            active={item.active}
            onClick={item.active ? () => onItemClick?.(item.title) : undefined}
          />
        ))}
      </div>
    </section>
  );
}

export default function SettingsOverviewPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderGlobalForm = (section: string) => {
    const FormComponent = GLOBAL_FORM_MAP[section];
    if (!FormComponent) return null;
    return <FormComponent />;
  };

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
            Settings
          </div>

          <div className="space-y-3">
            <h1
              className="
                text-3xl font-bold tracking-tight
                sm:text-4xl
              "
            >
              {activeSection || "Settings"}
            </h1>

            {!activeSection && (
              <p
                className="
                  max-w-3xl text-sm leading-7
                  text-muted-foreground sm:text-base
                "
              >
                Manage your account and personal preferences.
              </p>
            )}
          </div>
        </div>

        {/* Active Section Form */}
        {activeSection ? (
          <div className="space-y-6">
            <button
              onClick={() => setActiveSection(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back to settings
            </button>
            {renderGlobalForm(activeSection)}
          </div>
        ) : (
          <SettingsSection
            title="Account Settings"
            description="Personal preferences and settings that apply across all workspaces inside Focura. Workspace settings are managed under each workspace."
            items={globalSettings}
            onItemClick={setActiveSection}
          />
        )}
      </div>
    </div>
  );
}
