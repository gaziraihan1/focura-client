import Image from 'next/image';
import { Users, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnnouncementTarget } from '@/types/announcement.types';

interface AnnouncementTargetsProps {
  targets: AnnouncementTarget[];
  className?: string;
}

const MAX_VISIBLE = 6;

/**
 * Shows the private recipients of an announcement.
 * Collapses to "+N more" beyond MAX_VISIBLE.
 */
export function AnnouncementTargets({
  targets,
  className,
}: AnnouncementTargetsProps) {
  const visible  = targets.slice(0, MAX_VISIBLE);
  const overflow = targets.length - MAX_VISIBLE;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Users className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Visible to {targets.length} {targets.length === 1 ? 'person' : 'people'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {visible.map(({ userId, user }) => (
          <div
            key={userId}
            className={cn(
              'flex items-center gap-2 rounded-full border border-border bg-muted/60',
              'px-3 py-1.5 text-xs text-foreground',
            )}
          >
            <div className="relative size-5 shrink-0 overflow-hidden rounded-full bg-muted">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="20px"
                />
              ) : (
                <UserCircle2 className="size-full text-muted-foreground" />
              )}
            </div>
            <span className="font-medium">{user.name}</span>
          </div>
        ))}

        {overflow > 0 && (
          <div className={cn(
            'flex items-center rounded-full border border-border bg-muted/60',
            'px-3 py-1.5 text-xs text-muted-foreground',
          )}>
            +{overflow} more
          </div>
        )}
      </div>
    </div>
  );
}