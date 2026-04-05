// components/AdminUserDetail/CopyableId.tsx
import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import type { CopyableIdProps } from '@/types/admin.types';

export function CopyableId({ id }: CopyableIdProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [id]);

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border hover:border-primary/30 transition-colors"
    >
      <code className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
        {id}
      </code>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground/60 group-hover:text-muted-foreground shrink-0 transition-colors" />
      )}
    </button>
  );
}