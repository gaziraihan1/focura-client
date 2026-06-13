import Image from 'next/image';
import { UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnnouncementUser } from '@/types/announcement.types';

interface AnnouncementAuthorProps {
  user: AnnouncementUser;
  className?: string;
}

/**
 * Displays author avatar + name.
 * Falls back to icon when image is null.
 */
export function AnnouncementAuthor({ user, className }: AnnouncementAuthorProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="object-cover"
            sizes="36px"
          />
        ) : (
          <UserCircle2 className="size-full text-muted-foreground p-1" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{user.name}</span>
        <span className="text-xs text-muted-foreground">Author</span>
      </div>
    </div>
  );
}