import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import { parseAnnouncement } from '@/utils/announcement.utils';
import type { PreviewContentProps } from '@/types/announcement.types';

export function PreviewContent({ raw }: PreviewContentProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const tokens = parseAnnouncement(raw);

  const handleCopy = useCallback((val: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(val);
      setTimeout(() => setCopied(null), 1800);
    });
  }, []);

  if (!raw.trim()) {
    return (
      <p className="text-muted-foreground/50 text-sm italic select-none">
        Preview will appear here…
      </p>
    );
  }

  return (
    <p className="text-sm text-foreground/90 leading-relaxed wrap-break-word">
      {tokens.map((token, i): React.ReactNode => {
        if (token.type === 'text')
          return <span key={i}>{token.value}</span>;

        if (token.type === 'italic')
          return (
            <em key={i} className="italic">
              {token.value}
            </em>
          );

        if (token.type === 'bold')
          return (
            <strong key={i} className="font-semibold">
              {token.value}
            </strong>
          );

        if (token.type === 'break') return <br key={i} />;

        if (token.type === 'mono')
          return (
            <span key={i} className="inline-flex items-center gap-1">
              <code className="px-1.5 py-0.5 rounded bg-muted text-[0.8em] font-mono border border-border/60 text-foreground/80">
                {token.value}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(token.value)}
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                title="Copy"
              >
                {copied === token.value ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </span>
          );

        if (token.type === 'link')
          return (
            <Link
              key={i}
              href={token.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              {token.label}
            </Link>
          );

        return null;
      })}
    </p>
  );
}