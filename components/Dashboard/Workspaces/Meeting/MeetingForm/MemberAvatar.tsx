// Thin wrapper over the shared Avatar primitive preserving the bg-muted +
// bordered look and sm/md sizing used by the meeting attendee picker.
import { Avatar } from '@/components/Shared/Avatar';

interface Props {
  user: { name: string | null; image?: string | null };
  size?: 'sm' | 'md';
}

export function MemberAvatar({ user, size = 'md' }: Props) {
  return (
    <Avatar
      name={user.name ?? undefined}
      image={user.image ?? undefined}
      size={size}
      variant="muted"
    />
  );
}