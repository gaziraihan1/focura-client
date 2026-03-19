// components/CommentsList/CommentContent.tsx
import { cn } from '@/lib/utils';
import { parseMentions } from '@/utils/comments.utils';

interface CommentContentProps {
  content: string;
}

export function CommentContent({ content }: CommentContentProps) {
  const parts = parseMentions(content);

  return (
    <span className="text-sm text-foreground/85 leading-relaxed wrap-break-word whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.type === 'mention' ? (
          <span
            key={i}
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-md mx-0.5',
              'bg-primary/10 text-primary text-xs font-semibold',
              'border border-primary/20'
            )}
          >
            @{part.value}
          </span>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </span>
  );
}