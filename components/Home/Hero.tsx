import Link from "next/link";
import {
  ArrowRight,
  Check,
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Users,
  Box,
  Calendar,
  HeartPulse,
  Activity,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Plus,
  Flame,
  Clock,
  TrendingUp,
} from "lucide-react";

const SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: CheckSquare, label: "Tasks", badge: "12" },
  { icon: FolderOpen, label: "Projects" },
  { icon: Users, label: "Workspace" },
  { icon: Box, label: "Storage" },
  { icon: Calendar, label: "Calendar" },
  { icon: HeartPulse, label: "Wellness" },
  { icon: Activity, label: "Activity Logs" },
];

const BOTTOM_NAV = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help & Support" },
];

const QUICK_ACTIONS = [
  { label: "New workspace", hint: "Start fresh" },
  { label: "Invite member", hint: "Grow your team" },
  { label: "New project", hint: "Inside a workspace" },
  { label: "Shortcuts", hint: "⌘K to switch" },
];

const WORKSPACES = [
  { name: "Northwind", color: "#667eea", projects: 6, members: 12, role: "Owner" },
  { name: "Buildly", color: "#f0932b", projects: 3, members: 8, role: "Member" },
];

const TASKS = [
  { title: "Finalize homepage copy", meta: "Marketing · Today", priority: "High", done: false },
  { title: "Review onboarding flow", meta: "Product · Tomorrow", priority: "Urgent", done: false },
  { title: "Ship v2 release notes", meta: "Engineering · Fri", priority: "Medium", done: true },
];

const ACTIVITIES = [
  { label: "Alex completed “Mobile nav”", time: "2 min ago" },
  { label: "Priya joined Northwind", time: "1 hr ago" },
];

function HeroCopy() {
  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24 text-center">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-40" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
        </span>
        Built for focused teams
      </div>

      {/* Headline */}
      <h1 className="mt-7 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[64px] lg:leading-[1.05]">
        One calm workspace
        <br />
        <span className="text-muted-foreground">for all your work.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
        Focura brings your tasks, projects, and people together in one focused
        workspace — so you can plan less and do more.
      </p>

      {/* CTAs */}
      <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/get-started"
          className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm transition hover:opacity-90"
        >
          Start for Free
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/demo"
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
        >
          Get a Demo
        </Link>
      </div>

      {/* Stat strip */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
        <span><strong className="font-semibold text-foreground">8,000+</strong> focused teams</span>
        <span className="hidden sm:block h-4 w-px bg-border" aria-hidden="true" />
        <span><strong className="font-semibold text-foreground">99.9%</strong> uptime</span>
        <span className="hidden sm:block h-4 w-px bg-border" aria-hidden="true" />
        <span><strong className="font-semibold text-foreground">4.9/5</strong> from users</span>
      </div>
    </div>
  );
}

function HeroDashboardMockup() {
  return (
    <div
      className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24 pointer-events-none select-none mt-1"
      aria-hidden="true"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-foreground/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <div className="ml-4 hidden sm:block rounded-md bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground border border-border">
            app.focura.com/dashboard
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[190px_1fr]">
          {/* ── Sidebar (matches components/Dashboard/Sidebar.tsx) ── */}
          <div className="hidden md:flex flex-col border-r border-border bg-muted/20 p-3">
            <div className="flex items-center gap-2 px-2 pb-3 border-b border-border/70 mb-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground text-[9px] font-bold text-background">F</div>
              <span className="text-[11px] font-semibold text-foreground">Focura</span>
            </div>

            <nav className="flex-1 space-y-0.5">
              {SIDEBAR_NAV.map(({ icon: Icon, label, active, badge }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[10px] ${
                    active
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon size={12} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      className="rounded-full bg-foreground font-bold text-background"
                      style={{ fontSize: "0.5rem", lineHeight: 1, padding: "1px 5px" }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-auto space-y-0.5 border-t border-border/70 pt-2">
              {BOTTOM_NAV.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[10px] text-muted-foreground">
                  <Icon size={12} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Main content (matches dashboard/page.tsx) ── */}
          <div className="min-w-0 p-3 md:p-4">
            {/* Top bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5">
                <Search size={11} className="text-muted-foreground shrink-0" />
                <span className="flex-1 truncate text-[10px] text-muted-foreground">
                  Search workspaces, projects, files…
                </span>
                <span className="rounded border border-border bg-muted px-1 font-mono text-[8px] font-medium text-muted-foreground">⌘K</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-foreground px-2.5 py-1.5 text-[10px] font-semibold text-background">
                <Plus size={10} strokeWidth={2.5} />
                New Task
              </div>
              <div className="relative rounded-lg border border-border bg-background p-1.5 text-muted-foreground">
                <Bell size={11} />
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden="true" />
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[8px] font-bold text-foreground ring-1 ring-border">
                A
              </div>
            </div>

            {/* Greeting card */}
            <div className="mt-3 rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[11px] font-semibold text-foreground">Good morning, Alex</p>
                    <span className="text-[10px]">☀️</span>
                  </div>
                  <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                    Here&apos;s your Focura hub — pick a workspace to dive in.
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[8px] text-muted-foreground">
                    <TrendingUp size={9} />
                    2 workspaces
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:block text-right">
                    <p className="text-[8px] text-muted-foreground">Today</p>
                    <p className="text-[10px] font-medium text-foreground">Monday, Feb 24</p>
                  </div>
                  <div className="flex h-8 w-8 flex-col items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-[8px] font-medium text-primary leading-none">Mon</span>
                    <span className="text-[11px] font-bold text-primary leading-tight">24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <p className="mt-3 text-[8px] font-medium uppercase tracking-wider text-muted-foreground">
              Quick actions
            </p>
            <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {QUICK_ACTIONS.map(({ label, hint }) => (
                <div key={label} className="rounded-lg border border-border bg-background px-2.5 py-2">
                  <p className="text-[9px] font-medium text-foreground">{label}</p>
                  <p className="mt-0.5 text-[8px] text-muted-foreground">{hint}</p>
                </div>
              ))}
            </div>

            {/* Main grid: 2/3 + 1/3 */}
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-1.5">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-1.5">
                {/* Your workspaces */}
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FolderOpen size={11} className="text-foreground" />
                      <p className="text-[10px] font-semibold text-foreground">Your workspaces</p>
                    </div>
                    <span className="text-[8px] text-muted-foreground">View all →</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {WORKSPACES.map((ws) => (
                      <div key={ws.name} className="flex items-center gap-2 rounded-lg px-1.5 py-1.5">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold text-white shadow-sm"
                          style={{ backgroundColor: ws.color }}
                        >
                          {ws.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[9px] font-medium text-foreground">{ws.name}</p>
                            <span
                              className="rounded-full bg-muted text-muted-foreground"
                              style={{ fontSize: "0.5rem", lineHeight: 1, padding: "1px 5px" }}
                            >
                              {ws.role}
                            </span>
                          </div>
                          <p className="text-[8px] text-muted-foreground">
                            {ws.projects} projects · {ws.members} members
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-1.5 py-1.5 text-[8px] text-muted-foreground">
                      <Plus size={10} className="shrink-0" />
                      Create new workspace
                    </div>
                  </div>
                </div>

                {/* Tasks needing attention */}
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Flame size={11} className="text-foreground" />
                      <p className="text-[10px] font-semibold text-foreground">Tasks needing attention</p>
                    </div>
                    <span className="text-[8px] text-muted-foreground">View all →</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {TASKS.map((t) => (
                      <div key={t.title} className="flex items-center gap-2 rounded-lg px-1.5 py-1.5">
                        <span
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                            t.done ? "border-foreground bg-foreground" : "border-border"
                          }`}
                        >
                          {t.done && <Check size={8} className="text-background" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-[9px] ${t.done ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
                            {t.title}
                          </p>
                          <p className="text-[8px] text-muted-foreground">{t.meta}</p>
                        </div>
                        <span
                          className="rounded-full bg-muted text-muted-foreground shrink-0"
                          style={{ fontSize: "0.5rem", lineHeight: 1, padding: "1px 5px" }}
                        >
                          {t.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-1.5">
                {/* Focus streak */}
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-500 text-white shadow-sm">
                      <Flame size={12} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px] font-semibold text-foreground">3 day streak</p>
                        <span
                          className="rounded-full border border-yellow-500/20 bg-yellow-500/10 font-medium text-yellow-600"
                          style={{ fontSize: "0.5rem", lineHeight: 1, padding: "1px 5px" }}
                        >
                          Building
                        </span>
                      </div>
                      <p className="mt-0.5 text-[8px] text-muted-foreground">
                        Great momentum — keep it going.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[42%] rounded-full bg-yellow-500" />
                  </div>
                </div>

                {/* Recent activity */}
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <p className="text-[10px] font-medium text-foreground">Recent activity</p>
                  <div className="mt-1.5 divide-y divide-border/50">
                    {ACTIVITIES.map((a) => (
                      <div key={a.label} className="flex items-center gap-2 py-1.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Clock size={9} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[9px] text-foreground">{a.label}</p>
                          <p className="text-[8px] text-muted-foreground">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full bg-background overflow-hidden">
      {/* Subtle grid backdrop across the whole hero (cheap, pure CSS) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70 dark:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--foreground-rgb),0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--foreground-rgb),0.06) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 92%)",
        }}
      />

      <HeroCopy />

      {/* ── CSS-built dashboard mockup (mirrors the real Focura dashboard) ── */}
      <HeroDashboardMockup />
    </section>
  );
}
