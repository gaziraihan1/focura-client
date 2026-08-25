// components/WorkspaceUpgrade/PageHeader.tsx
import { ArrowLeft, Crown } from 'lucide-react';

interface PageHeaderProps {
  onBack: () => void;
}

export function UpgradePageHeader({ onBack }: PageHeaderProps) {
  return (
    <>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to billing
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Crown className="w-3.5 h-3.5" />
          Workspace upgrade
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Choose a plan for this workspace
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
          Each workspace has its own independent plan. Upgrading here only
          affects this workspace — your other workspaces are untouched.
        </p>
      </div>
    </>
  );
}