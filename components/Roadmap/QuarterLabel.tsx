"use client";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";

export default function QuarterLabel({ quarter }: { quarter: string }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.35 }}
      className='flex justify-center my-6'
    >
      <span className='relative z-10 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 px-4 py-1.5 rounded-full'>
        {quarter}
      </span>
    </motion.div>
  );
}
