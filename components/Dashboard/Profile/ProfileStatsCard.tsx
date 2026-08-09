import { m as motion } from "framer-motion";
import { Shield, Calendar, KeyRound } from "lucide-react";
import { formatLastPasswordChange } from "@/hooks/useSecurity";

interface ProfileStatsCardProps {
  role: string;
  createdAt: string;
  lastPasswordChange?: string | null;
}

export function ProfileStatsCard({
  role,
  createdAt,
  lastPasswordChange,
}: ProfileStatsCardProps) {
  const lastChangedLabel = formatLastPasswordChange(lastPasswordChange);
  const lastChangedFull = lastPasswordChange
    ? new Date(lastPasswordChange).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="font-semibold text-foreground capitalize">
            {role.toLowerCase()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Member Since</p>
          <p className="font-semibold text-foreground">
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <KeyRound size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Password Updated</p>
          <p className="font-semibold text-foreground">
            {lastChangedLabel ? (
              <time
                dateTime={lastPasswordChange ?? undefined}
                title={lastChangedFull ?? undefined}
              >
                {lastChangedLabel}
                {lastChangedFull && (
                  <span className="sr-only"> on {lastChangedFull}</span>
                )}
              </time>
            ) : (
              "No password change recorded"
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}