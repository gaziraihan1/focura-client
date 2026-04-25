import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

type CookiesHighlightVariant = "info" | "warning" | "success";

interface CookiesHighlightProps {
  children: ReactNode;
  variant?: CookiesHighlightVariant;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
};

const styles: Record<CookiesHighlightVariant, string> = {
  info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-300",
  warning:
    "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300",
  success:
    "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300",
};

export const CookiesHighlight = ({
  children,
  variant = "info",
}: CookiesHighlightProps) => {
  const Icon = icons[variant];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed",
        styles[variant]
      )}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
      <div>{children}</div>
    </div>
  );
};
