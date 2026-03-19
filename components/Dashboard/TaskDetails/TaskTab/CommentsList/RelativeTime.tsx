// components/CommentsList/RelativeTime.tsx
import { getRelativeTimeLabel } from '@/utils/comments.utils';

interface RelativeTimeProps {
  date: string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const label = getRelativeTimeLabel(date);

  return (
    <time
      dateTime={date}
      title={new Date(date).toLocaleString()}
      className="text-[11px] text-muted-foreground/60 tabular-nums"
    >
      {label}
    </time>
  );
}