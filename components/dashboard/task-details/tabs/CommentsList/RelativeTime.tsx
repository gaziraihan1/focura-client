// components/CommentsList/RelativeTime.tsx
import { getRelativeTimeLabel } from '@/utils/comments.utils';

interface RelativeTimeProps {
  date: string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const label = getRelativeTimeLabel(date);
  const fullDate = new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <time
      dateTime={date}
      title={fullDate}
      className="text-[11px] text-muted-foreground/50 tabular-nums hover:text-muted-foreground transition-colors cursor-default"
    >
      {label}
    </time>
  );
}
