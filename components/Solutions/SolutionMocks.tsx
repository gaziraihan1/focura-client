"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  FolderOpen,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Zap,
} from "lucide-react";

/* ─── Shared helpers ─────────────────────────────────────────────────────── */

function Avatar({ initials, color = "bg-muted text-muted-foreground", size = 5 }: { initials: string; color?: string; size?: number }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ring-2 ring-background ${color}`}
      style={{
        width: size === 4 ? 16 : size === 5 ? 20 : 24,
        height: size === 4 ? 16 : size === 5 ? 20 : 24,
        fontSize: size === 4 ? 6 : size === 5 ? 7 : 8,
      }}
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
      <span className="ml-2 hidden truncate rounded-md border border-border bg-background px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground sm:inline-block">
        {url}
      </span>
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

function MockSidebar({ activeIndex = 2 }: { activeIndex?: number }) {
  return (
    <div className="hidden flex-col border-r border-border bg-muted/20 p-2 sm:flex">
      <div className="flex items-center gap-1.5 px-1.5 pb-2.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground text-[8px] font-bold text-background">F</div>
        <span className="text-[10px] font-semibold text-foreground">Focura</span>
      </div>
      {NAV.map(({ icon: Icon, label, active }, i) => (
        <div
          key={label}
          className={`flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[9px] ${
            active || i === activeIndex
              ? "bg-foreground font-medium text-background"
              : "text-muted-foreground"
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
  );
}

function MockTopbar({ project = "Northwind — Q3 Roadmap", sub = "Product · 4 members" }: { project?: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-[9px] font-bold text-indigo-50">N</span>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-foreground">{project}</p>
          <p className="truncate text-[8px] text-muted-foreground">{sub}</p>
        </div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <div className="hidden items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[8px] text-muted-foreground md:flex">
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
        </div>
      </div>
    </div>
  );
}

/* ─── 1. Kanban board mock ───────────────────────────────────────────────── */

interface TaskCardData {
  title: string;
  tag: string;
  tagColor: string;
  priority: string;
  priorityColor: string;
  due: string;
  avatars: string[];
  comments: number;
}

const KANBAN: { name: string; count: number; color: string; tasks: TaskCardData[] }[] = [
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

export function KanbanMock({ project, sub }: { project?: string; sub?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-foreground/5">
      <WindowChrome url="app.focura.com/projects/northwind-q3/board" />
      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
        <MockSidebar />
        <div className="min-w-0 p-2.5 sm:p-3">
          <MockTopbar project={project} sub={sub} />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {KANBAN.map((col) => (
              <div key={col.name} className="w-[150px] shrink-0 rounded-lg bg-muted/40 p-1.5 sm:w-auto sm:min-w-[150px] sm:flex-1">
                <div className="flex items-center gap-1.5 px-0.5 pb-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{col.name}</p>
                  <span className="ml-auto rounded-full bg-muted px-1 text-muted-foreground" style={{ fontSize: 7 }}>{col.count}</span>
                  <MoreHorizontal size={9} className="text-muted-foreground/60" />
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

/* ─── 2. Collaboration thread mock ───────────────────────────────────────── */

const MESSAGES = [
  {
    name: "Amira Khan",
    initials: "AK",
    color: "bg-emerald-500/20 text-emerald-600",
    time: "9:41 AM",
    text: "Shipped the new dashboard today 🚀 Deploy is green.",
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
  },
];

export function ThreadMock({ task = "Launch mobile app", status = "In Review" }: { task?: string; status?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-foreground/5">
      <WindowChrome url="app.focura.com/tasks/124/discussion" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_190px]">
        <div className="min-w-0 p-2.5 sm:p-3">
          <div className="flex items-center gap-2 border-b border-border pb-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-[10px] font-bold text-indigo-50">#</div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-foreground">{task}</p>
              <p className="flex items-center gap-1 text-[8px] text-muted-foreground">
                <span className="flex items-center gap-0.5 rounded-full bg-green-500/10 px-1.5 py-px font-medium text-green-600">
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                  {status}
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

          <div className="mt-3 space-y-2.5">
            {MESSAGES.map((m) => (
              <div key={m.text} className={`flex gap-2 ${m.self ? "justify-end" : "justify-start"}`}>
                {!m.self && <Avatar initials={m.initials} color={m.color} />}
                <div className={`max-w-[80%] rounded-xl px-2.5 py-2 ${m.self ? "rounded-br-sm bg-foreground text-background" : "rounded-bl-sm border border-border bg-card text-foreground"}`}>
                  <div className="flex items-center gap-1.5">
                    <p className={`text-[8px] font-semibold ${m.self ? "text-background/80" : "text-muted-foreground"}`}>{m.name}</p>
                    <span className={m.self ? "text-background/50" : "text-muted-foreground/70"} style={{ fontSize: 7 }}>{m.time}</span>
                  </div>
                  <p className="mt-0.5 text-[9px] leading-relaxed">{m.text}</p>
                </div>
                {m.self && <Avatar initials={m.initials} color={m.color} />}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-2">
            <Avatar initials="YU" color="bg-foreground text-background" />
            <span className="flex-1 text-muted-foreground" style={{ fontSize: 8.5 }}>Write a comment…</span>
            <span className="flex items-center gap-1 rounded-md bg-foreground px-2 py-1 font-semibold text-background" style={{ fontSize: 7.5 }}>
              Send
            </span>
          </div>
        </div>

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
              <p className="flex items-center gap-1"><Clock size={9} /> High priority</p>
              <p className="flex items-center gap-1"><MessageSquare size={9} /> 3 members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Progress / visibility mock ──────────────────────────────────────── */

const PROGRESS_ROWS = [
  { name: "Design system audit", status: "Done", bar: "w-2/3 bg-green-500", color: "text-green-600" },
  { name: "Mobile nav refactor", status: "In progress", bar: "w-1/2 bg-foreground", color: "text-foreground" },
  { name: "Onboarding flow v2", status: "Planned", bar: "w-1/3 bg-foreground/40", color: "text-muted-foreground" },
];

export function ProgressMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-foreground/5">
      <WindowChrome url="app.focura.com/projects/northwind-q3" />
      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
        <MockSidebar activeIndex={0} />
        <div className="min-w-0 p-3">
          <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-foreground">Product Sprint</p>
              <p className="truncate text-[8px] text-muted-foreground">8 tasks · 3 members</p>
            </div>
            <div className="hidden shrink-0 items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[8px] font-semibold text-background md:flex">
              <Plus size={9} />
              Add Task
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {PROGRESS_ROWS.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-card p-2.5">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate font-medium text-foreground" style={{ fontSize: 8.5 }}>{r.name}</p>
                  <span className={`rounded-full bg-muted px-1.5 py-px font-medium ${r.color}`} style={{ fontSize: 7 }}>{r.status}</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${r.bar}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-2 text-muted-foreground" style={{ fontSize: 7.5 }}>
            <Plus size={8} className="text-foreground/60" />
            Add a new task
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 4. Automation / workflow mock ──────────────────────────────────────── */

const RULES = [
  { title: "When a task is marked done", action: "Notify the assignee", app: "Focura", active: true, runs: "128 runs" },
  { title: "When a deadline is near", action: "Send a reminder", app: "Email", active: true, runs: "46 runs" },
  { title: "When a project ships", action: "Post to Slack", app: "Slack", active: false, runs: "12 runs" },
];

export function AutomationMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-foreground/5">
      <WindowChrome url="app.focura.com/settings/automations" />
      <div className="p-2.5 sm:p-3">
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

        <div className="mt-3 space-y-1.5">
          {RULES.map((r) => (
            <div key={r.title} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground/10 text-foreground">
                <Zap size={10} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground" style={{ fontSize: 8.5 }}>{r.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-muted-foreground" style={{ fontSize: 7.5 }}>
                  {r.action}
                  <span className="flex items-center gap-0.5 rounded-full border border-border px-1.5 py-px">
                    <span className="h-1 w-1 rounded-full bg-foreground/50" />
                    {r.app}
                  </span>
                  <span className="hidden sm:inline">· {r.runs}</span>
                </p>
              </div>
              <span className={`flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors ${r.active ? "bg-foreground" : "bg-muted"}`}>
                <span className={`h-3 w-3 rounded-full bg-background shadow-sm ${r.active ? "ml-auto" : ""}`} />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5 text-muted-foreground" style={{ fontSize: 7.5 }}>
          <CheckCircle2 size={9} className="text-green-600" />
          3 automations active · Last run 2 min ago
        </div>
      </div>
    </div>
  );
}

/* ─── 5. Workflow columns mock ───────────────────────────────────────────── */

const WORKFLOW_COLS = [
  { name: "To Do", count: 3, color: "bg-foreground/40", items: ["Brief", "Moodboard", "Draft"] },
  { name: "In Review", count: 2, color: "bg-amber-500", items: ["Copy review", "Design QA"] },
  { name: "Approved", count: 4, color: "bg-green-500", items: ["Final assets", "Handoff"] },
];

export function WorkflowMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-foreground/5">
      <WindowChrome url="app.focura.com/workflows/marketing-pipeline" />
      <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
        <MockSidebar activeIndex={3} />
        <div className="min-w-0 p-2.5 sm:p-3">
          <MockTopbar project="Marketing Pipeline" sub="Custom workflow · 6 members" />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {WORKFLOW_COLS.map((col) => (
              <div key={col.name} className="w-[150px] shrink-0 rounded-lg bg-muted/40 p-1.5 sm:w-auto sm:min-w-[150px] sm:flex-1">
                <div className="flex items-center gap-1.5 px-0.5 pb-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{col.name}</p>
                  <span className="ml-auto rounded-full bg-muted px-1 text-muted-foreground" style={{ fontSize: 7 }}>{col.count}</span>
                </div>
                <div className="space-y-1.5">
                  {col.items.map((t) => (
                    <div key={t} className="rounded-md border border-border bg-card p-1.5 shadow-sm">
                      <p className="font-medium leading-snug text-foreground" style={{ fontSize: 8.5 }}>{t}</p>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 rounded-md border border-dashed border-border px-1.5 py-1 text-muted-foreground" style={{ fontSize: 7.5 }}>
                    <Plus size={8} />
                    Add item
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
