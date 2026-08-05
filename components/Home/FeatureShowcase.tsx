import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flag,
  FolderOpen,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { features, type ShowcaseVariant } from "@/constants/home.constants";

/* ─── Shared helpers ─────────────────────────────────────────────────────── */

function Avatar({ initials, color = "bg-muted text-muted-foreground", size = 5 }: { initials: string; color?: string; size?: number }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full font-bold ring-2 ring-background ${color}`}
      style={{ width: size === 4 ? 16 : size === 5 ? 20 : 24, height: size === 4 ? 16 : size === 5 ? 20 : 24, fontSize: size === 4 ? 6 : size === 5 ? 7 : 8 }}
    >
      {initials}
    </span>
  );
}

function WindowChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
      <div className="ml-2 hidden sm:block flex-1 truncate rounded-md border border-border bg-background px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground">
        {url}
      </div>
    </div>
  );
}

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ListChecks, label: "Tasks" },
  { icon: FolderOpen, label: "Projects", active: true },
  { icon: Calendar, label: "Calendar" },
  { icon: HeartPulse, label: "Wellness" },
];

/* ─── 1. Workspace / Project board mock ───────────────────────────────────── */

function WorkspaceMock() {
  const columns = [
    {
      name: "Planned",
      count: 2,
      color: "bg-foreground/40",
      tasks: [
        {
          title: "Design system audit",
          tag: "Design",
          tagColor: "bg-blue-500/10 text-blue-600",
          priority: "High",
          priorityColor: "bg-orange-500/10 text-orange-600",
          due: "Mar 2",
          avatars: ["JT", "AK"],
          comments: 4,
        },
        {
          title: "API rate limiting",
          tag: "Backend",
          tagColor: "bg-purple-500/10 text-purple-600",
          priority: "Urgent",
          priorityColor: "bg-red-500/10 text-red-600",
          due: "Today",
          avatars: ["MS"],
          comments: 2,
        },
      ],
    },
    {
      name: "In progress",
      count: 2,
      color: "bg-foreground",
      tasks: [
        {
          title: "Mobile nav refactor",
          tag: "Mobile",
          tagColor: "bg-emerald-500/10 text-emerald-600",
          priority: "Medium",
          priorityColor: "bg-yellow-500/10 text-yellow-600",
          due: "Mar 5",
          avatars: ["SR", "DL", "AK"],
          comments: 7,
        },
        {
          title: "Onboarding flow v2",
          tag: "Product",
          tagColor: "bg-pink-500/10 text-pink-600",
          priority: "High",
          priorityColor: "bg-orange-500/10 text-orange-600",
          due: "Mar 8",
          avatars: ["JT"],
          comments: 1,
        },
      ],
    },
    {
      name: "Done",
      count: 1,
      color: "bg-green-500",
      tasks: [
        {
          title: "Search UX polish",
          tag: "UX",
          tagColor: "bg-cyan-500/10 text-cyan-600",
          priority: "Low",
          priorityColor: "bg-blue-500/10 text-blue-600",
          due: "Done",
          avatars: ["DL"],
          comments: 0,
        },
      ],
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <WindowChrome url="app.focura.com/projects/northwind-q3/board" />

      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col border-r border-border bg-muted/20 p-2">
          <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground text-[8px] font-bold text-background">F</div>
            <span className="text-[10px] font-semibold text-foreground">Focura</span>
          </div>
          {NAV.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[9px] ${
                active ? "bg-foreground text-background font-medium" : "text-muted-foreground"
              }`}
            >
              <Icon size={11} />
              {label}
            </div>
          ))}
          <div className="mt-auto border-t border-border/70 pt-2">
            <div className="flex items-center gap-2 px-1.5 py-1.5 text-[9px] text-muted-foreground">
              <Settings size={11} />
              Settings
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="min-w-0 p-2.5 sm:p-3">
          {/* Top bar */}
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-[9px] font-bold text-white">N</span>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-foreground">Northwind — Q3 Roadmap</p>
                <p className="truncate text-[8px] text-muted-foreground">Product · 4 members</p>
              </div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <div className="hidden md:flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[8px] text-muted-foreground">
                <Search size={9} />
                Search…
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[8px] font-semibold text-background">
                <Plus size={9} />
                New Task
              </div>
              <div className="flex -space-x-1">
                <Avatar initials="JT" color="bg-indigo-500/20 text-indigo-600" />
                <Avatar initials="AK" color="bg-emerald-500/20 text-emerald-600" />
                <Avatar initials="SR" color="bg-amber-500/20 text-amber-600" />
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground ring-2 ring-background"
                  style={{ fontSize: 7 }}
                >
                  +2
                </span>
              </div>
            </div>
          </div>

          {/* Kanban — horizontally scrollable like real board apps on narrow screens */}
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {columns.map((col) => (
              <div key={col.name} className="w-37.5 shrink-0 rounded-lg bg-muted/40 p-1.5 sm:w-auto sm:min-w-37.5 sm:flex-1">
                <div className="flex items-center gap-1.5 px-0.5 pb-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{col.name}</p>
                  <span className="rounded-full bg-muted px-1 text-muted-foreground" style={{ fontSize: 7 }}>{col.count}</span>
                  <MoreHorizontal size={9} className="ml-auto text-muted-foreground/60" />
                </div>
                <div className="space-y-1.5">
                  {col.tasks.map((t) => (
                    <div key={t.title} className="rounded-md border border-border bg-card p-1.5 shadow-sm">
                      <p className="font-medium leading-snug text-foreground" style={{ fontSize: 8.5 }}>{t.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        <span className={`rounded-full px-1.5 py-px font-medium ${t.tagColor}`} style={{ fontSize: 6.5 }}>{t.tag}</span>
                        <span className={`rounded-full px-1.5 py-px font-medium ${t.priorityColor}`} style={{ fontSize: 6.5 }}>{t.priority}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex -space-x-1">
                          {t.avatars.map((a, i) => (
                            // react-doctor-disable-next-line react-doctor/no-array-index-as-key -- static mock avatar initials may repeat; no per-item identity
                            <span key={i} className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground ring-1 ring-background" style={{ fontSize: 5.5 }}>
                              {a}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: 7 }}>
                          {t.comments > 0 && (
                            <span className="flex items-center gap-0.5">
                              <MessageSquare size={7} />
                              {t.comments}
                            </span>
                          )}
                          <span className="flex items-center gap-0.5">
                            {t.due === "Done" ? <CheckCircle2 size={7} className="text-green-600" /> : <Clock size={7} />}
                            {t.due}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 rounded-md border border-dashed border-border px-1.5 py-1 text-muted-foreground" style={{ fontSize: 7.5 }}>
                    <Plus size={8} />
                    Add task
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Collaborate / task discussion mock ───────────────────────────────── */

function CollaborateMock() {
  const messages = [
    {
      name: "Amira Khan",
      initials: "AK",
      color: "bg-emerald-500/20 text-emerald-600",
      time: "9:41 AM",
      text: "Shipped the new dashboard today 🚀 Deploy is green.",
      files: true,
    },
    {
      name: "You",
      initials: "YU",
      color: "bg-foreground text-background",
      time: "9:47 AM",
      text: "On it — review queue is updated. Mobile looks perfect.",
      self: true,
    },
    {
      name: "Diego López",
      initials: "DL",
      color: "bg-amber-500/20 text-amber-600",
      time: "9:52 AM",
      text: "Approved. Nice work!",
      self: false,
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <WindowChrome url="app.focura.com/tasks/124/discussion" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_190px]">
        {/* Thread */}
        <div className="min-w-0 p-2.5 sm:p-3">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border pb-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-[10px] font-bold text-white">#</div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-foreground">Launch mobile app</p>
              <p className="flex items-center gap-1 text-[8px] text-muted-foreground">
                <span className="flex items-center gap-0.5 rounded-full bg-green-500/10 px-1.5 py-px font-medium text-green-600">
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                  In Review
                </span>
                Due Mar 8 · High priority
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="flex -space-x-1">
                <Avatar initials="AK" color="bg-emerald-500/20 text-emerald-600" />
                <Avatar initials="DL" color="bg-amber-500/20 text-amber-600" />
                <Avatar initials="SR" color="bg-indigo-500/20 text-indigo-600" />
              </div>
              <MoreHorizontal size={11} className="text-muted-foreground" />
            </div>
          </div>

          {/* Messages */}
          <div className="mt-3 space-y-2.5">
            {messages.map((m) => (
              <div key={m.text} className={`flex gap-2 ${m.self ? "justify-end" : "justify-start"}`}>
                {!m.self && <Avatar initials={m.initials} color={m.color} />}
                <div className={`max-w-[80%] rounded-xl px-2.5 py-2 ${m.self ? "rounded-br-sm bg-foreground text-background" : "rounded-bl-sm border border-border bg-card text-foreground"}`}>
                  <div className="flex items-center gap-1.5">
                    <p className={`text-[8px] font-semibold ${m.self ? "text-background/80" : "text-muted-foreground"}`}>{m.name}</p>
                    <span className={m.self ? "text-background/50" : "text-muted-foreground/70"} style={{ fontSize: 7 }}>{m.time}</span>
                  </div>
                  <p className="mt-0.5 text-[9px] leading-relaxed">{m.text}</p>
                  {m.files && (
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-1.5 py-1 text-muted-foreground" style={{ fontSize: 7 }}>
                      <Paperclip size={8} />
                      dashboard-v2.png · 2.4 MB
                    </div>
                  )}
                </div>
                {m.self && <Avatar initials={m.initials} color={m.color} />}
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-2">
            <Avatar initials="YU" color="bg-foreground text-background" />
            <span className="flex-1 text-muted-foreground" style={{ fontSize: 8.5 }}>Write a comment…</span>
            <span className="flex items-center gap-1 rounded-md bg-foreground px-2 py-1 font-semibold text-background" style={{ fontSize: 7.5 }}>
              <Send size={8} />
              Send
            </span>
          </div>
        </div>

        {/* Details sidebar — stacks below the thread on narrow screens (real app pattern) */}
        <div className="flex flex-col gap-2.5 border-t border-border bg-muted/20 p-3 lg:border-l lg:border-t-0">
          <div>
            <p className="font-semibold uppercase tracking-wide text-muted-foreground" style={{ fontSize: 7.5 }}>Assignees</p>
            <div className="mt-1.5 space-y-1.5">
              {[
                { n: "Amira Khan", i: "AK", c: "bg-emerald-500/20 text-emerald-600" },
                { n: "Diego López", i: "DL", c: "bg-amber-500/20 text-amber-600" },
                { n: "Sara Rahman", i: "SR", c: "bg-indigo-500/20 text-indigo-600" },
              ].map((u) => (
                <div key={u.n} className="flex items-center gap-1.5">
                  <Avatar initials={u.i} color={u.c} />
                  <span className="text-[8px] text-foreground">{u.n}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border/70 pt-2">
            <p className="font-semibold uppercase tracking-wide text-muted-foreground" style={{ fontSize: 7.5 }}>Details</p>
            <div className="mt-1.5 space-y-1 text-[8px] text-muted-foreground">
              <p className="flex items-center gap-1"><Calendar size={9} /> Due Mar 8, 2026</p>
              <p className="flex items-center gap-1"><Flag size={9} /> High priority</p>
              <p className="flex items-center gap-1"><Users size={9} /> 3 members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Automations mock ─────────────────────────────────────────────────── */

function AutomationMock() {
  const rules = [
    {
      title: "When a task is marked done",
      action: "Notify the assignee",
      app: "Focura",
      active: true,
      runs: "128 runs",
    },
    {
      title: "When a deadline is near",
      action: "Send a reminder",
      app: "Email",
      active: true,
      runs: "46 runs",
    },
    {
      title: "When a project ships",
      action: "Post to Slack",
      app: "Slack",
      active: false,
      runs: "12 runs",
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <WindowChrome url="app.focura.com/settings/automations" />

      <div className="p-2.5 sm:p-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground/10 text-foreground">
            <Zap size={13} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-foreground">Automations</p>
            <p className="truncate text-[8px] text-muted-foreground">Save time by automating repetitive work</p>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[8px] font-semibold text-background">
            <Plus size={9} />
            New rule
          </div>
        </div>

        {/* Rules */}
        <div className="mt-3 space-y-1.5">
          {rules.map((r) => (
            <div key={r.title} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground/10 text-foreground">
                <Zap size={10} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground" style={{ fontSize: 8.5 }}>{r.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-muted-foreground" style={{ fontSize: 7.5 }}>
                  <ChevronDown size={8} style={{ transform: "rotate(-90deg)" }} />
                  {r.action}
                  <span className="flex items-center gap-0.5 rounded-full border border-border px-1.5 py-px">
                    <span className="h-1 w-1 rounded-full bg-foreground/50" />
                    {r.app}
                  </span>
                  <span className="hidden sm:inline">· {r.runs}</span>
                </p>
              </div>
              <span
                className={`flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                  r.active ? "bg-foreground" : "bg-muted"
                }`}
              >
                <span className={`h-3 w-3 rounded-full bg-background shadow-sm ${r.active ? "ml-auto" : ""}`} />
              </span>
            </div>
          ))}
        </div>

        {/* Add row */}
        <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-dashed border-border px-2.5 py-2 text-[8px] text-muted-foreground">
          <Sparkles size={10} className="shrink-0 text-foreground/60" />
          <span className="min-w-0 truncate">Add a new rule — choose a trigger</span>
        </div>

        {/* Activity footer */}
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-muted-foreground" style={{ fontSize: 7.5 }}>
          <CheckCircle2 size={9} className="text-green-600" />
          3 automations active · Last run 2 min ago
        </div>
      </div>
    </div>
  );
}

function mockFor(variant: ShowcaseVariant) {
  switch (variant) {
    case "collaborate":
      return <CollaborateMock />;
    case "automation":
      return <AutomationMock />;
    default:
      return <WorkspaceMock />;
  }
}

export default function FeatureShowcase() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Product tour
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Powerful features that help your team move faster
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            Everything you need to plan, collaborate, and execute — in one
            beautifully designed system.
          </p>
        </div>

        <div className="mt-16 space-y-20">
          {features.map((f, index) => (
            <div
              key={f.title}
              className={`flex flex-col items-center gap-10 md:gap-16 ${
                f.reverse ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="w-full md:flex-1" aria-hidden="true">
                <div className="rounded-2xl border border-border bg-card p-3 shadow-xl shadow-foreground/5 transition-shadow hover:shadow-2xl hover:shadow-foreground/10">
                  <div className="rounded-xl bg-muted/30 p-1">
                    {mockFor(f.variant)}
                  </div>
                </div>
              </div>

              <div className="w-full md:flex-1">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 max-w-16 bg-border" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {f.title}
                </h3>
                <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{f.desc}</p>
                <button className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:opacity-70">
                  Learn more
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
