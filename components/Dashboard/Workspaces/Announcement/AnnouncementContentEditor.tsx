// src/components/announcements/AnnouncementContentEditor.tsx
'use client';

import { useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, Bold, Italic, Code2, Link2, CornerDownLeft } from 'lucide-react';
import { parseAnnouncement, } from '@/utils/announcement.utils';
import Link from 'next/link';

interface Props {
  value:    string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

// ─── Toolbar button config ────────────────────────────────────────────────────

const TOOLS = [
  {
    id:      'bold',
    icon:    Bold,
    label:   'Bold  **text**',
    wrap:    ['**', '**'],
    sample:  'bold text',
  },
  {
    id:      'italic',
    icon:    Italic,
    label:   'Italic  //text//',
    wrap:    ['//', '//'],
    sample:  'italic text',
  },
  {
    id:      'mono',
    icon:    Code2,
    label:   'Mono  $$text$$',
    wrap:    ['$$', '$$'],
    sample:  'code',
  },
  {
    id:      'link',
    icon:    Link2,
    label:   'Link  {url|label}',
    wrap:    ['{', '|label}'],
    sample:  'https://example.com',
  },
  {
    id:      'break',
    icon:    CornerDownLeft,
    label:   'New line  >',
    insert:  '>',
    wrap:    null,
    sample:  '',
  },
] as const;

// ─── Inline preview renderer ──────────────────────────────────────────────────

function PreviewContent({ raw }: { raw: string }) {
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
          return <em key={i} className="italic">{token.value}</em>;

        if (token.type === 'bold')
          return <strong key={i} className="font-semibold">{token.value}</strong>;

        if (token.type === 'break')
          return <br key={i} />;

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
                {copied === token.value
                  ? <Check className="w-3 h-3 text-green-500" />
                  : <Copy className="w-3 h-3" />}
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

// ─── Main editor ─────────────────────────────────────────────────────────────

export function AnnouncementContentEditor({ value, onChange, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  // Insert wrap around selection or insert at cursor
  const applyFormat = useCallback(
    (tool: typeof TOOLS[number]) => {
      const ta = ref.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const sel   = value.slice(start, end);

      let next: string;
      let cursorAt: number;

      if ('insert' in tool && tool.insert) {
        // bare insert (e.g. >)
        next     = value.slice(0, start) + tool.insert + value.slice(end);
        cursorAt = start + tool.insert.length;
      } else if (tool.wrap) {
        const [open, close] = tool.wrap;
        const inner = sel || tool.sample;
        next     = value.slice(0, start) + open + inner + close + value.slice(end);
        cursorAt = start + open.length + inner.length + close.length;
      } else {
        return;
      }

      onChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(cursorAt, cursorAt);
      });
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Content
        </label>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className={cn(
            'text-xs px-2.5 py-1 rounded-md transition-colors',
            preview
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted/50 border border-border/60 w-fit">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              type="button"
              disabled={disabled || preview}
              onClick={() => applyFormat(tool)}
              title={tool.label}
              className={cn(
                'p-1.5 rounded-md text-muted-foreground',
                'hover:text-foreground hover:bg-background',
                'transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}

        {/* Syntax legend (subtle) */}
        <div className="h-4 w-px bg-border mx-1" />
        <span className="text-[10px] text-muted-foreground/60 px-1 font-mono select-none hidden sm:block">
          **b** //i// $$mono$$ &#x7B;url&#x7D; &gt;
        </span>
      </div>

      {/* Editor / Preview pane */}
      <div className={cn(
        'rounded-xl border border-border overflow-hidden transition-all',
        !preview && 'focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20',
      )}>
        {preview ? (
          <div className="min-h-30 px-3.5 py-3 bg-muted/20">
            <PreviewContent raw={value} />
          </div>
        ) : (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={
              'Write your announcement…\n\nTip: **bold**, //italic//, $$mono$$, {https://url.com|link}, > new line'
            }
            rows={6}
            className={cn(
              'w-full resize-none bg-transparent px-3.5 py-3',
              'text-sm text-foreground placeholder:text-muted-foreground/50',
              'focus:outline-none font-mono leading-relaxed',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          />
        )}
      </div>

      {/* Character count */}
      <div className="flex justify-end">
        <span className={cn(
          'text-[11px] tabular-nums transition-colors',
          value.length > 9000
            ? 'text-destructive'
            : value.length > 7000
            ? 'text-yellow-500'
            : 'text-muted-foreground/50',
        )}>
          {value.length.toLocaleString()} / 10,000
        </span>
      </div>
    </div>
  );
}