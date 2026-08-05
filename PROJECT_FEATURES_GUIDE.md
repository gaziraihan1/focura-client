# Focura — Project Features Guide (Sections · Sprints · Milestones · Views)

A practical, user-facing guide to the four project-organisation features and the
workspace-level section filter. Everything here is implemented and reachable in
the dashboard — this doc explains **why** each feature exists and **how** to use it.

---

## Where to find these features

| Feature | Where it lives |
|---|---|
| **Sections** | Project sidebar → **Sections**, or the project Overview page → **Quick Access → Sections** |
| **Milestones** | Project sidebar → **Milestones**, or Overview → **Quick Access → Milestones** |
| **Sprints** | Project sidebar → **Sprints**, or Overview → **Quick Access → Sprints** |
| **Views** | Project sidebar → **Views**, or Overview → **Quick Access → Views** |
| **Sprint / Milestone / Section filters** | Project → **Tasks** → toolbar dropdowns |
| **Section filter (workspace)** | Workspace → **Tasks** → **Filters** → **Section** dropdown |

Every project page also has its own **left sidebar menu** inside the project
(Overview · Tasks · Milestones · Sprints · Sections · Views · Analytics ·
Announcements · Favorites · Settings), and the Overview page shows **Quick
Access** cards with live counts for one-click navigation.

---

## 1. Sections — organise tasks & customise the board

### What they are
Sections are named, colour-coded groups inside a project (e.g. *Backend*,
*Frontend*, *Design*, *Research*). Every new project is auto-seeded with 5
default board columns (Backlog → In Progress → Review → Blocked → Done) so the
board is never empty.

### The key concept: sections ↔ board columns
A section is **status-driven**: the moment you give a section a **task status**
(To Do / In Progress / In Review / Blocked / Completed / Cancelled), it becomes a
**column on that project's Kanban board**. One column per status per project.

- A section **with** a task status → a board column (membership = task status).
- A section **without** a status ("No status") → a plain folder for organising
  tasks, **without** touching the board. It still appears as a section tag on
  cards and rows.

### How to use it (Project → Sections)
1. **Create** — "Add Section" → name, description, colour, optional task status,
   WIP limit. A fresh section defaults to *No status* so it never claims a
   column until you want it to.
2. **Rename / recolor** — the edit (⋮) button on each card.
3. **Map to a status** — pick a status from the dropdown. A status already used
   by another section is disabled (one column per status).
4. **Set a WIP limit** — enter a number in the WIP box. 0 = no limit. The board
   highlights columns near/over their limit (red warning + bottleneck hints).
5. **Reorder** — the ▲/▼ buttons move the section (and its board column) up/down.
6. **Delete** — the delete button opens a **confirmation modal** first. Tasks are
   **not** deleted: cards keep their status and stay visible in List/Calendar
   views.

### Why it's useful
- The board reflects **your** workflow instead of a fixed template.
- WIP limits stop columns from clogging up and surface bottlenecks.
- Folder-style sections (no status) organise tasks without breaking the board.

---

## 2. Milestones — track key checkpoints & health

### What they are
Milestones are significant project checkpoints (e.g. *Beta release*, *Client
sign-off*) with a due date, a health status and a progress %.

### Health statuses
| Status | Meaning |
|---|---|
| **On Track** | Everything is on schedule |
| **At Risk** | Needs attention — likely to slip without intervention |
| **Delayed** | Already slipped past expectations |
| **Completed** | Done ✅ |

### Linking tasks to a milestone
A milestone is no longer a standalone label — it now **drives task planning**:

- When creating a task, pick a **Milestone** in the task form (Create Task →
  **Milestone** dropdown).
- Tasks linked to a milestone show a **milestone chip/badge** on their board
  card and list row.
- The milestone card shows a **linked-tasks summary** (`X/Y linked tasks done`)
  and its **progress % is auto-derived from the linked tasks** whenever tasks
  are attached — keep the linked tasks moving and the milestone progress updates
  itself.
- Click **View tasks** on a milestone card to jump to the project Tasks page
  pre-filtered to that milestone.

### How to use it (Project → Milestones)
1. **Add Milestone** — title + optional due date.
2. **Assign tasks** — set the Milestone field on the tasks that belong to this
   checkpoint. The milestone card now lists them and tracks completion.
3. **Set progress** — tap 0 / 25 / 50 / 75 / 100 % (or use the slider's buttons)
   for milestones with no linked tasks, or to override the auto-derived value.
4. The page shows an **overall progress bar** and stat cards (Total / On Track /
   At Risk / Delayed / Completed).
5. **Delete** via the delete button — a **confirmation modal** opens first and
   reassures you that linked tasks stay untouched.

### Why it's useful
- One glance at the stats bar tells you the *health* of the whole project, not
  just how many tasks are done.
- At-risk/delayed milestones act as an early-warning signal for stakeholders.
- Linking tasks means progress is **honest** — it reflects real completion.

---

## 3. Sprints — time-boxed iterations with velocity

### What they are
Sprints are fixed-date work cycles (classic scrum: "Sprint 1", "Sprint 2", …)
with a goal, start/end dates, point totals and a retrospective.

### Planning tasks into a sprint
- When creating a task, pick a **Sprint** in the task form (Create Task →
  **Sprint** dropdown) to commit the work to an iteration.
- Sprint members show a **sprint chip/badge** on their board card and list row.
- Each sprint card shows its **task count** live, plus a **View tasks** link that
  jumps to the project Tasks page pre-filtered to that sprint.

### How to use it (Project → Sprints)
1. **New Sprint** — name, optional goal, start date, end date.
2. The first sprint you start is shown in the **Active Sprint** banner. The card
   tracks **day X of Y** and a time-based progress bar.
3. **Complete Sprint** (from the banner or the card menu) — optionally write a
   retrospective ("what went well / what could improve"). Completed sprints
   store their retro (expandable on the card) and stop counting progress.
4. **Velocity** — the page shows average points per sprint once sprints have
   completed points.
5. **Delete** via the delete button — a **confirmation modal** opens first.
   Tasks assigned to the sprint are **not** deleted; they simply lose their
   sprint assignment.

### Why it's useful
- Creates a predictable cadence: plan → work → review, repeatedly.
- The active-sprint banner keeps the team focused on *this* iteration.
- Velocity (avg pts/sprint) lets you forecast how much work fits in future
  sprints.
- The task count + "View tasks" link make the sprint card the honest status
  report of the iteration.

---

## 4. Views — save & apply your favourite perspectives

### What they are
Saved views are named, per-project configurations of how you look at the
project (type: **Kanban · List · Calendar · Timeline**), with visibility
(Private / Shared) and a default flag.

### How views control the Tasks page
Views aren't just labels anymore — they **actually apply**:

- Every saved view appears as a **chip in the project Tasks page toolbar**.
  Click a chip to instantly switch the task list to that view's mode
  (board ↔ list) — the URL updates to `?view=<id>` so the perspective is
  shareable.
- The chip for the active view is highlighted; click **Reset view** to clear it.
- Mark a view as **Default** and it **auto-applies** every time you open the
  project Tasks page.
- From the Views page, each card's **Apply** link opens the Tasks page with that
  view already active.

> Calendar / Timeline view types are captured for future use; applying them
> currently opens the Tasks page in board mode. Kanban and List types switch
> between board and list layouts.

### How to use it (Project → Views)
1. **New View** — name it (e.g. "My Kanban", "Launch Timeline") and pick a type.
2. Saved views appear as cards; **Default** views are tagged and auto-apply.
3. Set / clear **Default** from the card menu.
4. **Apply** a view from its card, or pick a chip on the Tasks page toolbar.
5. **Delete** via the delete button — a **confirmation modal** opens first.

### Why it's useful
- Bookmark the exact perspective you use every day so you don't rebuild it.
- Shared views give the whole team one consistent starting point.
- A Default view means your team always lands on the same layout.

---

## 5. Filtering tasks by sprint, milestone & section

The project **Tasks** page toolbar now has three grouping filters alongside the
existing search/status/priority/assignee filters:

| Filter | What it does |
|---|---|
| **Sprint** | Show only tasks committed to the selected sprint |
| **Milestone** | Show only tasks linked to the selected milestone |
| **Section** | Show only tasks in the selected section |

Pick a value, and the task list (board or list) narrows instantly. This is the
same page the **View tasks** links from Sprint/Milestone cards deep-link into
(`?sprint=`, `?milestone=`, `?view=` URL params), so every link you click lands
on a pre-filtered, shareable URL.

On the **Workspace → Tasks** page the Filters panel includes a **Section**
dropdown listing every section from every project in the workspace, grouped by
project — pick one to see only the tasks in that section across all projects
(server-side filtering — works with search, status, priority, project, assignee,
labels and focus filters combined).

> Tip: combine **Project + Section** to zero in on one section of one project,
> or pick a section with no project filter to see it across the workspace.

---

## 6. Deletion safety

Every destructive action on the Sections, Sprints, Milestones and Views pages
goes through a **confirmation modal** before anything is removed — no more
one-click mistakes. In all cases the underlying **tasks are never deleted**:
they simply lose their section/sprint/milestone assignment.

---

## Suggested workflow (putting it together)

1. **Sections** first — define your board columns + folder sections.
2. **Milestones** — mark the big checkpoints, then link the tasks that deliver them.
3. **Sprints** — slice the work into 1–2 week iterations and assign tasks to them.
4. **Views** — save the board/list you check daily and set a Default so it auto-applies.
5. Use the **sprint / milestone / section filters** on the Tasks page to review
   one slice of work, and the **workspace task filter** to keep an eye on any
   section across projects.
