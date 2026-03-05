import Image from 'next/image';

interface Props {
  user: { name: string | null; image?: string | null };
  size?: 'sm' | 'md';
}

export function MemberAvatar({ user, size = 'md' }: Props) {
  const cls = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm';
  return (
    <div className={`${cls} shrink-0 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center font-semibold text-muted-foreground`}>
      {user.image
        ? <Image width={32} height={32} src={user.image} alt={user.name ?? ''} className="h-full w-full object-cover" />
        : (user.name?.[0] ?? '?').toUpperCase()
      }
    </div>
  );
}