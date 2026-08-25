// components/CommentsList/EmptyComments.tsx
import { m as motion } from 'framer-motion';
import { MessageSquare, AtSign, ArrowUp } from 'lucide-react';

export function EmptyComments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      {/* Animated icon cluster */}
      <div className="relative mb-4">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6 text-primary/60" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-muted border border-border/60 flex items-center justify-center"
        >
          <AtSign className="w-3 h-3 text-muted-foreground/60" />
        </motion.div>
      </div>

      <p className="text-sm font-semibold text-foreground mb-1">
        No comments yet
      </p>
      <p className="text-xs text-muted-foreground/70 max-w-48 leading-relaxed">
        Start the conversation. Use{" "}
        <span className="inline-flex items-center gap-0.5 font-medium text-primary/80">
          <AtSign className="w-3 h-3" />@name
        </span>{" "}
        to mention someone.
      </p>

      {/* Subtle scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-4 flex items-center gap-1 text-[10px] text-muted-foreground/30"
      >
        <ArrowUp className="w-3 h-3" />
        <span>Type below to add the first comment</span>
      </motion.div>
    </motion.div>
  );
}
