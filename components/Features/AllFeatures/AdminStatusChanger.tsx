'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpdateFeatureStatus } from '@/hooks/useFeatures';
import type { FeatureRequest, FeatureStatus } from '@/types/feature.types';

const STATUS_OPTIONS: { value: FeatureStatus; label: string; className: string }[] = [
  { value: 'PENDING',   label: 'Pending',   className: 'text-muted-foreground' },
  { value: 'APPROVED',  label: 'Approve',   className: 'text-emerald-600' },
  { value: 'REJECTED',  label: 'Reject',    className: 'text-destructive' },
  { value: 'PLANNED',   label: 'Planned',   className: 'text-primary' },
  { value: 'COMPLETED', label: 'Completed', className: 'text-violet-600' },
];

export function AdminStatusChanger({ feature }: { feature: FeatureRequest }) {
  const [open,      setOpen]      = useState(false);
  const [adminNote, setAdminNote] = useState(feature.adminNote ?? '');

  const { mutate: updateStatus, isPending } = useUpdateFeatureStatus();

  const handleChange = (status: FeatureStatus) => {
    updateStatus(
      { id: feature.id, status, adminNote: adminNote.trim() || undefined },
      { onSettled: () => setOpen(false) },
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Change status"
      >
        {isPending
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <Settings2 className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{    opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'absolute right-0 bottom-full mb-2 z-50',
              'w-56 rounded-xl bg-card border border-border shadow-lg shadow-black/10 p-2',
            )}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Set status
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-0.5 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Optional admin note…"
              rows={2}
              className={cn(
                'w-full mb-2 px-2.5 py-2 rounded-lg text-xs',
                'border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground/50',
                'focus:outline-none focus:border-primary/50 resize-none',
              )}
            />

            <div className="flex flex-col gap-0.5">
              {STATUS_OPTIONS.map(({ value, label, className }) => (
                <button
                  key={value}
                  type="button"
                  disabled={isPending || feature.status === value}
                  onClick={() => handleChange(value)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors',
                    'hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed',
                    className,
                    feature.status === value && 'bg-muted',
                  )}
                >
                  {feature.status === value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  )}
                  {label}
                  {feature.status === value && (
                    <span className="ml-auto text-[9px] text-muted-foreground">current</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}