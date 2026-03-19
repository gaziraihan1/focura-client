// components/CommentsList/EmptyComments.tsx
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export function EmptyComments() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
        <MessageSquare className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No comments yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Be the first to leave a comment.
      </p>
    </motion.div>
  );
}