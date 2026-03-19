// components/StorageOverview/LoadingState.tsx
import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading workspaces...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <HardDrive className="w-8 h-8 text-muted-foreground" />
        </motion.div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}