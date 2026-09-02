import { AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  type: "not-found" | "no-access" | "no-permission";
  workspaceSlug?: string;
  onNavigate: () => void;
}

const errorConfig = {
  "not-found": {
    icon: AlertCircle,
    iconColor: "text-red-500",
    title: "Workspace not found",
    description: "Unable to load workspace information",
    buttonText: "Back to Workspaces",
  },
  "no-access": {
    icon: ShieldAlert,
    iconColor: "text-amber-500",
    title: "Access Denied",
    description: "You are not a member of this workspace",
    buttonText: "Back to Workspaces",
  },
  "no-permission": {
    icon: ShieldAlert,
    iconColor: "text-amber-500",
    title: "Permission Denied",
    description:
      "You don't have permission to create projects in this workspace",
    buttonText: "Back to Projects",
  },
};

export function ErrorState({ type, onNavigate }: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <Icon className={`w-12 h-12 ${config.iconColor} mx-auto mb-4`} />
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {config.title}
      </h2>
      <p className="text-muted-foreground mb-6">{config.description}</p>
      <Button
        onClick={onNavigate}
        className="hover:opacity-90"
      >
        {config.buttonText}
      </Button>
    </div>
  );
}