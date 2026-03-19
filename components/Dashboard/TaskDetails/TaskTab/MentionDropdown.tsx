// components/MentionTextarea/MentionDropdown.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Shared/Avatar';
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
        'absolute z-50 min-w-50 max-w-70',
        'rounded-xl border border-border bg-popover shadow-xl shadow-black/10',
        'overflow-hidden'
      )}
    >
      <div className="px-2.5 py-2 border-b border-border/60">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Mention someone
        </p>
      </div>
      <div className="py-1 max-h-48 overflow-y-auto">
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
              'w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-colors duration-100',
              i === activeIndex
                ? 'bg-primary/10 text-foreground'
                : 'hover:bg-muted text-foreground'
            )}
          >
            <Avatar name={user.name} image={user.image} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              {user.role && (
                <p className="text-[10px] text-muted-foreground truncate capitalize">
                  {user.role.toLowerCase()}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}