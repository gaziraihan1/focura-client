"use client";

import { X } from "lucide-react";
import { CATEGORY_COLORS, CATEGORY_LABELS, RoadmapItem, STATUS_CONFIG } from "@/lib/roadmapData";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DetailModal({
  item,
  onClose,
}: {
  item   : RoadmapItem;
  onClose: () => void;
}) {
  const status   = STATUS_CONFIG[item.status];
  const catColor = CATEGORY_COLORS[item.category];

  // Close on Escape
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className='fixed inset-0 z-50 flex items-center justify-center p-4'
        onClick={onClose}
        onKeyDown={handleKey}
        role='dialog'
        aria-modal='true'
      >
        {/* Backdrop */}
        <div className='absolute inset-0 bg-neutral-900/50 dark:bg-neutral-950/70 backdrop-blur-sm' />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          className='relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden'
        >
          {/* Colour accent bar */}
          <div className='h-1 w-full' style={{ backgroundColor: catColor }} />

          <div className='p-6'>
            {/* Header */}
            <div className='flex items-start justify-between gap-4 mb-5'>
              <div className='flex items-start gap-3 min-w-0'>
                <div
                  className='shrink-0 w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl'
                  style={{ borderColor: `${catColor}25`, border: `1.5px solid ${catColor}25` }}
                >
                  {item.icon}
                </div>
                <div className='min-w-0'>
                  <p
                    className='text-[10px] font-bold uppercase tracking-widest mb-0.5'
                    style={{ color: catColor }}
                  >
                    {CATEGORY_LABELS[item.category]} · {item.quarter}
                  </p>
                  <h2 className='text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight'>
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label='Close'
                className='shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* Status badge */}
            <div className='mb-5'>
              <span
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold',
                  status.bg, status.border, status.textColor
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    status.dot,
                    item.status === 'in-progress' && 'animate-pulse'
                  )}
                />
                {status.label}
              </span>
            </div>

            {/* Detail text */}
            <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6'>
              {item.detail}
            </p>

            {/* Highlights */}
            <div className='rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 p-4'>
              <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3'>
                Key Highlights
              </p>
              <div className='space-y-2.5'>
                {item.highlights.map((h, i) => (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.055 }}
                    className='flex items-start gap-2.5'
                  >
                    <span
                      className='shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5'
                      style={{ backgroundColor: `${catColor}18` }}
                    >
                      <svg className='w-2.5 h-2.5' viewBox='0 0 10 10' fill='none'>
                        <path
                          d='M2 5l2 2 4-4'
                          stroke={catColor}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                    <span className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                      {h}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}