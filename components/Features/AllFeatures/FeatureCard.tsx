'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Shared/Avatar';
import { FeatureStatusBadge } from './FeatureStatusBadge';
import { FeatureVoteButtons }  from './FeatureVoteButtons';
import { AdminStatusChanger }  from './AdminStatusChanger';
import type { FeatureRequest } from '@/types/feature.types';
import { DeleteConfirm } from './DeleteConfirm';

interface Props {
  feature:    FeatureRequest;
  isAdmin:    boolean;
  isDeleting: boolean;
  onDelete:   (id: string) => void;
  index:      number;
}

export function FeatureCard({ feature, isAdmin, isDeleting, onDelete, index }: Props) {
  const [expanded,     setExpanded]     = useState(false);
  const [confirmOpen,  setConfirmOpen]  = useState(false);

  console.log(feature)
  const timeAgo = formatDistanceToNow(new Date(feature.createdAt), { addSuffix: true });

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
        transition={{ duration: 0.22, ease: 'easeOut', delay: index * 0.03 }}
        className={cn(
          'group flex flex-col gap-3 p-5 rounded-xl border bg-card',
          'hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5',
          'transition-all duration-200',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <FeatureStatusBadge status={feature.status} />
              {feature.status === 'PENDING' && (
                <span className="text-[10px] text-muted-foreground">Awaiting review</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              {feature.title}
            </h3>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
              disabled={isDeleting}
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
            >
              {isDeleting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Trash2  className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        <p className={cn(
          'text-sm text-muted-foreground leading-relaxed',
          !expanded && 'line-clamp-2',
        )}>
          {feature.description}
        </p>

        {feature.description.length > 120 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="self-start flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors"
          >
            {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
          </button>
        )}

        {feature.adminNote && (
          <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground/80 leading-relaxed">
            <span className="font-semibold text-primary">Admin note: </span>
            {feature.adminNote}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={feature.createdBy.name} image={feature.createdBy.image} size="sm" />
            <span className="text-[11px] text-muted-foreground truncate">{feature.createdBy.name}</span>
            <span className="text-muted-foreground/40 text-[11px]">·</span>
            <span className="text-[11px] text-muted-foreground/70 shrink-0">{timeAgo}</span>
          </div>

          <div className="flex items-center gap-2">
            <FeatureVoteButtons feature={feature} />
            {isAdmin && <AdminStatusChanger feature={feature} />}
          </div>
        </div>
      </motion.div>

      {confirmOpen && (
        <DeleteConfirm
          title={feature.title}
          isDeleting={isDeleting}
          onConfirm={() => { onDelete(feature.id); setConfirmOpen(false); }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}