import { motion } from "framer-motion";
import { Crown, Check } from "lucide-react";

interface Workspace {
  id: string;
  plan: string;
  maxStorage: number;
}

interface ProfilePlanCardProps {
  ownedWorkspaces: Workspace[];
}

const getPlanBadgeColor = (plan: string) => {
  switch (plan) {
    case "FREE":
      return "bg-gray-500/10 text-gray-500";
    case "PRO":
      return "bg-blue-500/10 text-blue-500";
    case "BUSINESS":
      return "bg-purple-500/10 text-purple-500";
    case "ENTERPRISE":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export function ProfilePlanCard({ ownedWorkspaces }: ProfilePlanCardProps) {
  const workspace = ownedWorkspaces[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Current Plan</h3>
        <Crown size={20} className="text-primary" />
      </div>

      {workspace ? (
        <div className="space-y-3">
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getPlanBadgeColor(
              workspace.plan
            )}`}
          >
            {workspace.plan}
          </span>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span className="text-muted-foreground">
                Up to 5 team members
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span className="text-muted-foreground">
                {(workspace.maxStorage / 1024).toFixed(0)} GB storage
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check size={16} className="text-green-500" />
              <span className="text-muted-foreground">Unlimited projects</span>
            </div>
          </div>

          <button className="w-full mt-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition text-sm font-medium">
            Upgrade Plan
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No workspace plan active
        </p>
      )}
    </motion.div>
  );
}