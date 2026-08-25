"use client";

import Link from "next/link";
import { KeyRound, ShieldCheck, Plug, ChevronRight } from "lucide-react";
import { useSecuritySettings } from "@/hooks/useSecurity";
import { useIntegrations } from "@/hooks/integration/useIntegrations";

/**
 * Security & Connectors card for the profile page.
 *
 * - Change Password / Two-Factor Authentication redirect to the Security
 *   settings section (dashboard/settings?section=Security).
 * - Connector status mirrors the Integrations settings page
 *   (dashboard/settings?section=Integrations).
 */
export function ProfileSecurityCard() {
  const { data: securitySettings } = useSecuritySettings();
  const { data: integrations, isLoading: integrationsLoading } = useIntegrations();

  const twoFactorEnabled = securitySettings?.twoFactorEnabled ?? false;
  const activeConnectors = (integrations ?? []).filter((i) => i.active);
  const connectorLabel = activeConnectors.length
    ? activeConnectors.map((c) => c.name).join(", ")
    : "None connected";

  return (
    <div className="mt-6 rounded-xl bg-card border border-border p-6">
      <h2 className="text-base font-semibold text-foreground mb-4">Security</h2>

      <div className="space-y-3">
        {/* Change Password */}
        <Link
          href="/dashboard/settings?section=Security"
          className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <KeyRound size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground">
                Update your login password
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
        </Link>

        {/* Two-Factor Authentication */}
        <Link
          href="/dashboard/settings?section=Security"
          className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldCheck size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-muted-foreground">
                {twoFactorEnabled
                  ? "Enabled — extra protection for your account"
                  : "Not configured — add an extra security layer"}
              </p>
            </div>
          </div>
          <span
            className={
              twoFactorEnabled
                ? "shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400"
                : "shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            }
          >
            {twoFactorEnabled ? "Enabled" : "Not Configured"}
          </span>
        </Link>

        {/* Connectors */}
        <Link
          href="/dashboard/settings?section=Integrations"
          className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plug size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Connectors</p>
              <p className="text-xs text-muted-foreground">
                {integrationsLoading ? "Loading..." : connectorLabel}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
