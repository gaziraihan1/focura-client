import { CheckCircle2 } from "lucide-react";

export function SettingsCard({
  title,
  description,
  icon: Icon,
  active,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left group relative overflow-hidden rounded-2xl border border-border
        bg-card p-5 transition-colors duration-200
        hover:border-primary/20 hover:bg-accent/30
      "
    >
      <div
        className="
          absolute inset-x-0 top-0 h-px
          bg-linear-to-r from-transparent via-primary/40 to-transparent
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      <div className="flex items-start gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-xl border border-border
            bg-secondary text-foreground
          "
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight">
              {title}
            </h3>

            {active ? (
              <span
                className="
                  inline-flex items-center gap-1 rounded-full
                  bg-green-500/10 border border-green-500/20
                  px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400
                "
              >
                <CheckCircle2 className="w-3 h-3" />
                Live
              </span>
            ) : (
              <span
                className="
                  rounded-full border border-border
                  bg-muted px-2 py-0.5 text-[10px]
                  font-medium uppercase tracking-wide
                  text-muted-foreground
                "
              >
                Soon
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}