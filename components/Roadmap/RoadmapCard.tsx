"use client";

import { motion } from "framer-motion";
import { CATEGORY_COLORS, CATEGORY_LABELS, RoadmapItem, STATUS_CONFIG } from "@/lib/roadmapData";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function RoadmapCard({
  item,
  side,
  onClick,
}: {
  item : RoadmapItem;
  side : 'left' | 'right';
  onClick: (item: RoadmapItem) => void;
}) {
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin: '-80px' });
  const status   = STATUS_CONFIG[item.status];
  const catColor = CATEGORY_COLORS[item.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === 'left' ? -32 : 32, y: 12 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'relative flex mb-6',
        side === 'left'
          ? 'justify-end pr-8 md:pr-10'
          : 'justify-start pl-8 md:pl-10'
      )}
    >
      {/* Connector dot on the spine */}
      <div
        className={cn(
          'absolute top-5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-950 z-10',
          status.dot,
          side === 'left' ? 'right-0 translate-x-1.5' : 'left-0 -translate-x-1.5'
        )}
      />

      {/* Card */}
      <motion.button
        whileHover={{ scale: 1.012, y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18 }}
        onClick={() => onClick(item)}
        className={cn(
          'group w-full max-w-md text-left rounded-2xl border bg-white dark:bg-neutral-900 p-5 transition-shadow hover:shadow-md',
          status.border
        )}
      >
        {/* Top row: icon + title + status pill */}
        <div className='flex items-start justify-between gap-3 mb-3'>
          <div className='flex items-start gap-2.5 min-w-0'>
            {/* Icon bubble */}
            <div
              className='shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-base'
              style={{ borderColor: `${catColor}25`, border: `1.5px solid ${catColor}25` }}
            >
              {item.icon}
            </div>
            <div className='min-w-0'>
              <p
                className='text-[10px] font-bold uppercase tracking-widest mb-0.5'
                style={{ color: catColor }}
              >
                {CATEGORY_LABELS[item.category]}
              </p>
              <h3 className='text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug'>
                {item.title}
              </h3>
            </div>
          </div>

          {/* Status pill */}
          <span
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border',
              status.bg, status.border, status.textColor
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full shrink-0',
                status.dot,
                item.status === 'in-progress' && 'animate-pulse'
              )}
            />
            {status.label}
          </span>
        </div>

        {/* Description */}
        <p className='text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3'>
          {item.description}
        </p>

        {/* Highlight tags — first 2 only */}
        <div className='flex flex-wrap gap-1.5 mb-3'>
          {item.highlights.slice(0, 2).map((h) => (
            <span
              key={h}
              className='text-[10px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full'
            >
              {h}
            </span>
          ))}
          {item.highlights.length > 2 && (
            <span className='text-[10px] text-neutral-400 dark:text-neutral-500 px-1 self-center'>
              +{item.highlights.length - 2} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between'>
          <span className='text-[10px] font-mono text-neutral-400 dark:text-neutral-500'>
            {item.quarter}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity',
              status.textColor
            )}
          >
            View details
            <ArrowRight className='w-3 h-3 shrink-0' strokeWidth={2.5} />
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}