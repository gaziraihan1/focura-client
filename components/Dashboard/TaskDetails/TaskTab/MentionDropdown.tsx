// components/MentionTextarea/MentionDropdown.tsx
import { m as motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Shared/Avatar';
import { Search } from 'lucide-react';
import type { MentionUser, DropdownPosition } from '@/types/comment.types';

interface MentionDropdownProps {
  users: MentionUser[];
  activeIndex: number;
  position: DropdownPosition;
  onSelect: (user: MentionUser) => void;
}

export function MentionDropdown({
  users,
  activeIndex,
  position,
  onSelect,
}: MentionDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.13, ease: 'easeOut' }}
      style={{ top: position.top, left: position.left }}
      className={cn(
        'absolute z-50 min-w-56 max-w-72',
        'rounded-xl border border-border bg-popover shadow-xl shadow-black/10',
        'overflow-hidden'
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-border/60 flex items-center gap-2">
        <Search className="w-3 h-3 text-muted-foreground/50" />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Mention a teammate
        </p>
        <span className="ml-auto text-[10px] text-muted-foreground/40 tabular-nums">
          {users.length} {users.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* User list */}
      <div className="py-1 max-h-52 overflow-y-auto">
        {users.map((user, i) => (
          <motion.button
            key={user.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(user);
            }}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100',
              i === activeIndex
                ? 'bg-primary/10 text-foreground'
                : 'hover:bg-muted text-foreground'
            )}
          >
            <Avatar name={user.name} image={user.image} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user.name}</p>
              {user.role && (
                <p className="text-[10px] text-muted-foreground truncate capitalize">
                  {user.role.replace(/_/g, ' ').toLowerCase()}
                </p>
              )}
            </div>
            {i === activeIndex && (
              <span className="text-[9px] text-muted-foreground/40 font-mono shrink-0">
                ↵
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-1.5 border-t border-border/40 flex items-center gap-3">
        <span className="text-[9px] text-muted-foreground/40">
          <kbd className="px-0.5 py-0.5 rounded bg-muted/60 text-[8px] font-mono">↑↓</kbd>
          {" "}navigate
        </span>
        <span className="text-[9px] text-muted-foreground/40">
          <kbd className="px-0.5 py-0.5 rounded bg-muted/60 text-[8px] font-mono">↵</kbd>
          {" "}select
        </span>
        <span className="text-[9px] text-muted-foreground/40">
          <kbd className="px-0.5 py-0.5 rounded bg-muted/60 text-[8px] font-mono">esc</kbd>
          {" "}close
        </span>
      </div>
    </motion.div>
  );
}
