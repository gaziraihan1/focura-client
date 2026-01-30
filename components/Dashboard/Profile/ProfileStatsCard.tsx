import { motion } from "framer-motion";
import { Shield, Calendar } from "lucide-react";

interface ProfileStatsCardProps {
  role: string;
  createdAt: string;
}

export function ProfileStatsCard({ role, createdAt }: ProfileStatsCardProps) {
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
    </motion.div>
  );
}