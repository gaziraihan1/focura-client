"use client"
import { motion } from 'framer-motion'
import { Megaphone } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/Shared/EmptyState";

export function AnnouncementEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <SharedEmptyState
        icon={Megaphone}
        title="No announcements yet"
        description="Workspace announcements will appear here."
      />
    </motion.div>
  );
}
