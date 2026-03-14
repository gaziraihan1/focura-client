// components/WorkspaceUpgrade/PageFooter.tsx

export function UpgradePageFooter() {
  return (
    <div className="mt-10 text-center space-y-1">
      <p className="text-xs text-muted-foreground">
        All plans are billed per workspace. Upgrading one workspace does not
        affect others.
      </p>
      <p className="text-xs text-muted-foreground">
        Payments processed securely by Stripe. Cancel anytime.
      </p>
    </div>
  );
}