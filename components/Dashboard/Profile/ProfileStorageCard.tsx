import { motion } from "framer-motion";
import { HardDrive } from "lucide-react";

interface StorageData {
  total: number;
  used: number;
  remaining: number;
}

interface ProfileStorageCardProps {
  storage: StorageData | null;
}

export function ProfileStorageCard({ storage }: ProfileStorageCardProps) {
  const storagePercentage = storage ? (storage.used / storage.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Storage</h3>
        <HardDrive size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Used</span>
          <span className="font-medium text-foreground">
            {storage ? (storage.used / 1024).toFixed(2) : 0} GB
          </span>
        </div>

        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${storagePercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Available</span>
          <span className="font-medium text-foreground">
            {storage ? (storage.total / 1024).toFixed(2) : 0} GB
          </span>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {storage
              ? `${((storage.remaining / storage.total) * 100).toFixed(1)}% remaining`
              : "0% remaining"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}