// 'use client';

// import React, { memo, useState, useMemo } from 'react';
// import {
//   Plus, LayoutGrid, List, Search, SlidersHorizontal,
//   ChevronDown, GripVertical, Calendar, MessageSquare,
//   CheckCircle2, Clock, Circle, AlertCircle, X,
// } from 'lucide-react';
// import { cn }              from '@/lib/utils';
// import { useTasks }        from '@/hooks/useTask';
// import { ProjectDetails }  from '@/hooks/useProjects';
// import { Task }            from '@/hooks/useTask';
// import CreateTaskModal     from './CreateTaskModal';
// import { TaskCard } from '../AllTasks/WorkspaceTasks/TaskCard';

// // ─── Types ────────────────────────────────────────────────────────────────────

// type ViewMode    = 'board' | 'list';
// type TaskStatus  = Task['status'];
// type TaskPriority = Task['priority'];

// interface TasksTabProps {
//   project:           ProjectDetails;
//   showCreateTask:    boolean;
//   setShowCreateTask: (v: boolean) => void;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const COLUMNS: {
//   status: TaskStatus;
//   label:  string;
//   icon:   React.ReactNode;
//   color:  string;
// }[] = [
//   { status: 'TODO',        label: 'To Do',       icon: <Circle       className="size-3.5" />, color: 'text-muted-foreground' },
//   { status: 'IN_PROGRESS', label: 'In Progress',  icon: <Clock        className="size-3.5" />, color: 'text-blue-500'         },
//   { status: 'IN_REVIEW',   label: 'In Review',    icon: <AlertCircle  className="size-3.5" />, color: 'text-amber-500'        },
//   { status: 'COMPLETED',   label: 'Completed',    icon: <CheckCircle2 className="size-3.5" />, color: 'text-emerald-500'      },
// ];

// const PRIORITY_CONFIG: Record<TaskPriority, { label: string; dot: string }> = {
//   LOW:    { label: 'Low',    dot: 'bg-slate-400'  },
//   MEDIUM: { label: 'Medium', dot: 'bg-blue-500'   },
//   HIGH:   { label: 'High',   dot: 'bg-amber-500'  },
//   URGENT: { label: 'Urgent', dot: 'bg-red-500'    },
// };

// // ─── Board Column ─────────────────────────────────────────────────────────────

// const BoardColumn = memo(function BoardColumn({
//   status, label, icon, color, tasks, workspaceSlug, onAddTask,
// }: {
//   status:        TaskStatus;
//   label:         string;
//   icon:          React.ReactNode;
//   color:         string;
//   tasks:         Task[];
//   workspaceSlug: string;
//   onAddTask:     () => void;
// }) {
//   return (
//     // data-column-status → future DnD droppable anchor
//     <div data-column-status={status} className="flex flex-col gap-3 min-w-[272px] max-w-[310px] w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-1">
//         <div className="flex items-center gap-2">
//           <span className={cn('flex items-center', color)}>{icon}</span>
//           <span className="text-sm font-semibold text-foreground">{label}</span>
//           <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
//             {tasks.length}
//           </span>
//         </div>
//         <button
//           onClick={onAddTask}
//           aria-label={`Add task to ${label}`}
//           className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//         >
//           <Plus className="size-3.5" />
//         </button>
//       </div>

//       {/* Drop zone — DnD library attaches droppable listeners here */}
//       <div className="flex flex-col gap-2.5 min-h-[120px] rounded-xl p-2 bg-muted/40 border border-dashed border-transparent transition-colors">
//         {tasks.length === 0 ? (
//           <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
//             <span className={cn('opacity-50', color)}>{icon}</span>
//             <p className="text-xs text-muted-foreground">No tasks</p>
//           </div>
//         ) : (
//           tasks.map((task) => (
//             // data-task-id → future DnD draggable anchor
//             <div key={task.id} data-task-id={task.id} className="cursor-grab active:cursor-grabbing">
//               <TaskCard task={task} workspaceSlug={workspaceSlug} />
//             </div>
//           ))
//         )}

//         <button
//           onClick={onAddTask}
//           className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-auto"
//         >
//           <Plus className="size-3.5" />
//           Add task
//         </button>
//       </div>
//     </div>
//   );
// });

// // ─── List Row wrapper (adds drag grip + uses existing TaskCard) ───────────────

// const ListRow = memo(function ListRow({
//   task, workspaceSlug,
// }: {
//   task:          Task;
//   workspaceSlug: string;
// }) {
//   const col      = COLUMNS.find((c) => c.status === task.status);
//   const priCfg   = PRIORITY_CONFIG[task.priority];
//   const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

//   return (
//     // data-task-id → future DnD draggable anchor
//     <div
//       data-task-id={task.id}
//       className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_130px_100px_90px_auto] items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
//     >
//       {/* Drag handle */}
//       <GripVertical className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors cursor-grab active:cursor-grabbing shrink-0" />

//       {/* Title */}
//       <p className="text-sm font-medium text-foreground truncate">{task.title}</p>

//       {/* Status — desktop */}
//       {col && (
//         <div className={cn('hidden sm:flex items-center gap-1.5 text-xs font-medium truncate', col.color)}>
//           {col.icon}
//           <span>{col.label}</span>
//         </div>
//       )}

//       {/* Priority — desktop */}
//       <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
//         <span className={cn('size-2 rounded-full shrink-0', priCfg.dot)} />
//         {priCfg.label}
//       </div>

//       {/* Due date — desktop */}
//       <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium">
//         {task.dueDate ? (
//           <span className={cn('flex items-center gap-1', isOverdue ? 'text-red-500' : 'text-muted-foreground')}>
//             <Calendar className="size-3 shrink-0" />
//             {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
//           </span>
//         ) : (
//           <span className="text-muted-foreground/40">—</span>
//         )}
//       </div>

//       {/* Comment count + assignees */}
//       <div className="flex items-center gap-2 shrink-0">
//         {task._count.comments > 0 && (
//           <span className="hidden sm:flex items-center gap-0.5 text-[11px] text-muted-foreground">
//             <MessageSquare className="size-3" />
//             {task._count.comments}
//           </span>
//         )}
//         <div className="flex -space-x-1.5">
//           {task.assignees.slice(0, 3).map(({ user }) =>
//             user.image ? (
//               <img
//                 key={user.id}
//                 src={user.image}
//                 alt={user.name}
//                 className="size-6 rounded-full object-cover ring-1 ring-background"
//               />
//             ) : (
//               <span
//                 key={user.id}
//                 className="size-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center ring-1 ring-background"
//               >
//                 {user.name.charAt(0).toUpperCase()}
//               </span>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

// // ─── Toolbar ──────────────────────────────────────────────────────────────────

// function Toolbar({
//   viewMode, setViewMode,
//   search, setSearch,
//   priorityFilter, setPriorityFilter,
//   onAddTask, totalCount, isFetching,
// }: {
//   viewMode:          ViewMode;
//   setViewMode:       (v: ViewMode) => void;
//   search:            string;
//   setSearch:         (v: string) => void;
//   priorityFilter:    TaskPriority | 'ALL';
//   setPriorityFilter: (v: TaskPriority | 'ALL') => void;
//   onAddTask:         () => void;
//   totalCount:        number;
//   isFetching:        boolean;
// }) {
//   const [filterOpen, setFilterOpen] = useState(false);

//   return (
//     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//       {/* Left */}
//       <div className="flex items-center gap-2 flex-1 min-w-0">
//         {/* Search */}
//         <div className="relative flex-1 max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tasks…"
//             className="w-full rounded-lg border border-border bg-background pl-8 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch('')}
//               className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//             >
//               <X className="size-3.5" />
//             </button>
//           )}
//         </div>

//         {/* Priority filter */}
//         <div className="relative">
//           <button
//             onClick={() => setFilterOpen((p) => !p)}
//             className={cn(
//               'flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground',
//               priorityFilter !== 'ALL' && 'border-primary/50 text-primary bg-primary/5',
//             )}
//           >
//             <SlidersHorizontal className="size-3.5" />
//             <span className="hidden sm:inline">
//               {priorityFilter === 'ALL' ? 'Filter' : PRIORITY_CONFIG[priorityFilter as TaskPriority].label}
//             </span>
//             <ChevronDown className={cn('size-3.5 transition-transform', filterOpen && 'rotate-180')} />
//           </button>

//           {filterOpen && (
//             <div className="absolute top-full left-0 mt-1.5 z-30 min-w-[150px] rounded-xl border border-border bg-popover shadow-[0_8px_24px_0_rgb(0_0_0_/_0.12)] py-1 overflow-hidden">
//               {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => { setPriorityFilter(p); setFilterOpen(false); }}
//                   className={cn(
//                     'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors',
//                     priorityFilter === p && 'bg-muted font-medium',
//                   )}
//                 >
//                   {p !== 'ALL' && <span className={cn('size-2 rounded-full shrink-0', PRIORITY_CONFIG[p].dot)} />}
//                   {p === 'ALL' ? 'All priorities' : PRIORITY_CONFIG[p].label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <span className="hidden sm:inline text-xs text-muted-foreground whitespace-nowrap">
//           {totalCount} task{totalCount !== 1 ? 's' : ''}
//           {isFetching && <span className="ml-1 opacity-50">(syncing…)</span>}
//         </span>
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-2 shrink-0">
//         {/* View toggle */}
//         <div className="flex items-center rounded-lg border border-border bg-background p-0.5 gap-0.5">
//           {(['board', 'list'] as const).map((mode) => (
//             <button
//               key={mode}
//               onClick={() => setViewMode(mode)}
//               aria-label={`${mode} view`}
//               className={cn(
//                 'flex items-center justify-center rounded-md px-2.5 py-1.5 transition-all',
//                 viewMode === mode
//                   ? 'bg-muted text-foreground shadow-sm'
//                   : 'text-muted-foreground hover:text-foreground',
//               )}
//             >
//               {mode === 'board' ? <LayoutGrid className="size-3.5" /> : <List className="size-3.5" />}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={onAddTask}
//           className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
//         >
//           <Plus className="size-4" />
//           <span className="hidden sm:inline">New Task</span>
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function TasksSkeleton({ mode }: { mode: ViewMode }) {
//   if (mode === 'board') {
//     return (
//       <div className="flex gap-4 overflow-x-auto pb-4">
//         {COLUMNS.map((col) => (
//           <div key={col.status} className="flex flex-col gap-2.5 min-w-[272px]">
//             <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
//             <div className="flex flex-col gap-2.5 rounded-xl bg-muted/40 p-2 min-h-[160px]">
//               {[1, 2].map((i) => (
//                 <div key={i} className="h-[80px] rounded-xl bg-muted animate-pulse" />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }
//   return (
//     <div className="flex flex-col gap-2">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
//       ))}
//     </div>
//   );
// }

// function EmptyTasks({ onAddTask }: { onAddTask: () => void }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//       <div className="flex size-14 items-center justify-center rounded-2xl bg-muted border border-border">
//         <CheckCircle2 className="size-6 text-muted-foreground" />
//       </div>
//       <div className="space-y-1">
//         <p className="text-sm font-semibold text-foreground">No tasks found</p>
//         <p className="text-xs text-muted-foreground max-w-[220px]">
//           Adjust the filters or create the first task for this project.
//         </p>
//       </div>
//       <button
//         onClick={onAddTask}
//         className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
//       >
//         <Plus className="size-4" />
//         Create task
//       </button>
//     </div>
//   );
// }

// function ErrorState() {
//   return (
//     <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
//       <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
//         <AlertCircle className="size-6 text-destructive" />
//       </div>
//       <p className="text-sm font-semibold text-foreground">Failed to load tasks</p>
//       <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
//     </div>
//   );
// }

// // ─── Main Export ──────────────────────────────────────────────────────────────

// export default function TasksTab({
//   project,
//   showCreateTask,
//   setShowCreateTask,
// }: TasksTabProps) {
//   const [viewMode,       setViewMode]       = useState<ViewMode>('board');
//   const [search,         setSearch]         = useState('');
//   const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');

//   const workspaceSlug = project.workspace?.slug ?? '';

//   // ── Fetch tasks via the real useTasks hook ────────────────────────────────
//   // projectId filter scopes the request to this project.
//   // placeholderData in useTasks already prevents loading flash on filter changes.
//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//   } = useTasks(
//     { projectId: project.id },
//     1,
//     200, // load all tasks for this project — pagination can be added later
//   );

//   const allTasks: Task[] = data?.data ?? [];

//   // ── Client-side filter (search + priority) — no extra network call ────────
//   const filteredTasks = useMemo(() => {
//     let result = allTasks;

//     if (search.trim()) {
//       const q = search.toLowerCase();
//       result = result.filter(
//         (t) =>
//           t.title.toLowerCase().includes(q) ||
//           t.description?.toLowerCase().includes(q),
//       );
//     }

//     if (priorityFilter !== 'ALL') {
//       result = result.filter((t) => t.priority === priorityFilter);
//     }

//     return result;
//   }, [allTasks, search, priorityFilter]);

//   // ── Render body ───────────────────────────────────────────────────────────
//   const renderBody = () => {
//     if (isLoading)               return <TasksSkeleton mode={viewMode} />;
//     if (isError)                 return <ErrorState />;
//     if (filteredTasks.length === 0) return <EmptyTasks onAddTask={() => setShowCreateTask(true)} />;

//     if (viewMode === 'board') {
//       return (
//         <div className="flex gap-4 overflow-x-auto pb-4 items-start scrollbar-hide">
//           {COLUMNS.map((col) => (
//             <BoardColumn
//               key={col.status}
//               {...col}
//               tasks={filteredTasks.filter((t) => t.status === col.status)}
//               workspaceSlug={workspaceSlug}
//               onAddTask={() => setShowCreateTask(true)}
//             />
//           ))}
//         </div>
//       );
//     }

//     return (
//       <div className="flex flex-col gap-2">
//         {/* List header — desktop */}
//         <div className="hidden sm:grid grid-cols-[auto_1fr_130px_100px_90px_auto] items-center gap-3 px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
//           <span className="size-4" />
//           <span>Task</span>
//           <span>Status</span>
//           <span>Priority</span>
//           <span>Due</span>
//           <span />
//         </div>
//         {filteredTasks.map((task) => (
//           <ListRow key={task.id} task={task} workspaceSlug={workspaceSlug} />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-4">
//       <Toolbar
//         viewMode={viewMode}
//         setViewMode={setViewMode}
//         search={search}
//         setSearch={setSearch}
//         priorityFilter={priorityFilter}
//         setPriorityFilter={setPriorityFilter}
//         onAddTask={() => setShowCreateTask(true)}
//         totalCount={filteredTasks.length}
//         isFetching={isFetching && !isLoading}
//       />

//       {renderBody()}

//       {showCreateTask && (
//         <CreateTaskModal
//           workspaceId={project.workspaceId}
//           projectId={project.id}
//           projectMembers={project.members}
//           onClose={() => setShowCreateTask(false)}
//         />
//       )}
//     </div>
//   );
// }