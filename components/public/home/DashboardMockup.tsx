import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  active?: boolean;
  badge?: string;
}

const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  { label: "Dashboard", active: true },
  { label: "Tasks", badge: "12" },
  { label: "Projects" },
  { label: "Calendar" },
  { label: "Wellness" },
];

const COLUMNS = [
  {
    name: "Planned",
    dot: "bg-muted-foreground/50",
    tasks: [
      { title: "Design system audit", tag: "Design", tagClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400", due: "Mar 2" },
      { title: "API rate limiting", tag: "Backend", tagClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400", due: "Today" },
    ],
  },
  {
    name: "In progress",
    dot: "bg-blue-500",
    tasks: [
      { title: "Mobile nav refactor", tag: "Mobile", tagClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", due: "Mar 5" },
      { title: "Onboarding flow v2", tag: "Product", tagClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400", due: "Mar 8" },
    ],
  },
  {
    name: "Done",
    dot: "bg-emerald-500",
    tasks: [
      { title: "Search UX polish", tag: "UX", tagClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", due: "Done" },
    ],
  },
] as const;

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left",
        "shadow-2xl shadow-foreground/10 select-none",
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
        <WindowDots />
        <div className="ml-2 flex-1 truncate rounded-md border border-border bg-background px-3 py-1 text-[11px] text-muted-foreground">
          app.focura.com/dashboard
        </div>
      </div>

      <div className="flex min-h-[280px] sm:min-h-[340px]">
        {/* Sidebar */}
        <aside className="hidden w-32 shrink-0 flex-col gap-1 border-r border-border bg-muted/30 p-3 sm:flex">
          <div className="mb-2 flex items-center gap-1.5 border-b border-border pb-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground text-[8px] font-bold text-background">
              F
            </span>
            <span className="text-[11px] font-semibold text-foreground">Focura</span>
          </div>
          {SIDEBAR_ITEMS.map((item) => (
            <span
              key={item.label}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1 text-[10px]",
                item.active
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "font-medium text-muted-foreground",
              )}
            >
              {item.label}
              {"badge" in item && item.badge !== undefined && (
                <span className="rounded-full bg-background/25 px-1 text-[8px] font-bold">
                  {item.badge}
                </span>
              )}
            </span>
          ))}
        </aside>

        {/* Main panel */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Good morning, Alex
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
              3 day streak
            </span>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-2.5">
            {COLUMNS.map((col) => (
              <div
                key={col.name}
                className="flex flex-col gap-1.5 rounded-lg bg-muted/40 p-2"
              >
                <div className="mb-0.5 flex items-center gap-1.5 px-0.5">
                  <span className={cn("h-1.5 w-1.5 rounded-full", col.dot)} />
                  <span className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {col.name}
                  </span>
                </div>
                {col.tasks.map((task) => (
                  <div
                    key={task.title}
                    className="flex flex-col gap-1 rounded-md border border-border bg-background p-1.5"
                  >
                    <span className="text-[9px] font-medium leading-snug text-foreground">
                      {task.title}
                    </span>
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-px text-[7px] font-semibold",
                          task.tagClass,
                        )}
                      >
                        {task.tag}
                      </span>
                      <span className="text-[7px] text-muted-foreground/70">
                        {task.due === "Done" ? "Done" : `Due ${task.due}`}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-auto rounded-md border border-dashed border-border px-1.5 py-1 text-center text-[8px] text-muted-foreground/70">
                  + Add task
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
