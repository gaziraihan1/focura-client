import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TermsListProps {
  items: (string | ReactNode)[];
  ordered?: boolean;
  className?: string;
}

export const TermsList = ({ items, ordered = false, className }: TermsListProps) => {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag
      className={cn(
        "space-y-2 text-sm text-neutral-600 dark:text-neutral-400",
        ordered ? "list-none counter-reset-item" : "list-none",
        className
      )}
    >
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          {ordered ? (
            <span className="shrink-0 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
          ) : (
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-2" />
          )}
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </Tag>
  );
};
