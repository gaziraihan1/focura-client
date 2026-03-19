// components/TaskActivity/UserAvatar.tsx
import Image from 'next/image';
import type { ActivityUser } from '@/types/task-activity.types';
import { getUserInitials } from '@/utils/task-activity.utils';

interface UserAvatarProps {
  user: ActivityUser;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const initials = getUserInitials(user.name);

  return (
    <div className="shrink-0">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
        {user.image ? (
          <Image
            width={32}
            height={32}
            src={user.image}
            alt={user.name || ''}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
    </div>
  );
}