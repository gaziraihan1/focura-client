"use client";

import {
  Bell,
  Globe,
  KeyRound,
  Lock,
  Monitor,
  Palette,
  Shield,
  Clock,
  Zap,
} from "lucide-react";
import { useUrlState } from "@/hooks/useUrlState";
import { CapacityScheduleForm } from "@/components/Settings/CapacityScheduleForm";
import { AccountSettingsForm } from "@/components/Settings/AccountSettingsForm";
import { AppearanceSettingsForm } from "@/components/Settings/AppearanceSettingsForm";
import { NotificationsSettingsForm } from "@/components/Settings/NotificationsSettingsForm";
import { IntegrationsSettingsForm } from "@/components/Settings/IntegrationsSettingsForm";
import { ApiTokensSettingsForm } from "@/components/Settings/ApiTokensSettingsForm";
import { AutomationsSettingsForm } from "@/components/Settings/AutomationsSettingsForm";
import { SecuritySettingsForm } from "@/components/Settings/SecuritySettingsForm";
import { SettingsSection } from "@/components/Settings/SettingsSection";

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
    title: "Automations",
    description:
      "Automate repetitive work with trigger-based rules across your workspaces.",
    icon: Zap,
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
  "Automations": AutomationsSettingsForm,
  "Security": SecuritySettingsForm,
};

const renderGlobalForm = (section: string) => {
  const FormComponent = GLOBAL_FORM_MAP[section];
  if (!FormComponent) return null;
  return <FormComponent />;
};
export default function SettingsOverviewPage() {
  const [activeSection, setActiveSection] = useUrlState<string>("section", "");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 p-3 lg:p-8">
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
              onClick={() => setActiveSection("")}
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
