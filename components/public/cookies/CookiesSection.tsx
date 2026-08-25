import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CookiesSectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  index: number;
}

export const CookiesSection = ({
  id,
  title,
  icon: Icon,
  children,
  index,
}: CookiesSectionProps) => {
  return (
    <section
      id={id}
      className="scroll-mt-28 pb-10 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 last:pb-0"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 mt-0.5">
          <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
        </div>
        <div>
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase block mb-0.5">
            Section {index}
          </span>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 leading-tight">
            {title}
          </h2>
        </div>
      </div>

      <div className="pl-13 space-y-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
};