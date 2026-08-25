// Thin wrapper over the shared Avatar primitive so the activity feed keeps its
// exact h-8 w-8 muted fallback look while reusing one implementation.
import type { ActivityUser } from '@/types/task-activity.types';
import { Avatar } from '@/components/shared/Avatar';

interface UserAvatarProps {
  user: ActivityUser;
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="shrink-0">
      <Avatar
        name={user.name}
        image={user.image}
        variant="muted"
        twoLetterInitials
        className="h-8 w-8 text-sm"
      />
    </div>
  );
}