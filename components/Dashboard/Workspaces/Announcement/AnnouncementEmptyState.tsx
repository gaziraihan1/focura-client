"use client"
import { motion } from 'framer-motion'
import { Megaphone } from "lucide-react";

export function AnnouncementEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Megaphone className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">No announcements yet</p>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-55">
        Workspace announcements will appear here.
      </p>
    </motion.div>
  );
}
