# hooks/ — Layer Contract

This folder is the logic layer of the app. Components stay presentational;
everything that touches data, routing state, or orchestration lives here.

## File categories

| Kind | Naming | Examples | Rules |
|------|--------|----------|-------|
| Query hooks | `use<Domain>Queries.ts` or `useXxx` returning `useQuery` | `useTaskQueries.ts`, `useWorkspaceQueries.ts` | TanStack Query only. Never call `api.*` from components. |
| Mutation hooks | `useXxxMutations.ts` (+ split modules re-exported via barrel) | `useTaskMutations.ts` → `taskMutations.ts` | Invalidate/update caches in `onSuccess`. |
| Page controllers | `use<XxxPage>.ts` | `useKanbanPage.ts`, `useMeetingPage.ts` | Compose queries/mutations + local UI state; return a plain controller object `{ data, error, refetch, ... }`. |
| Key factories | `<domain>Keys.ts` | `taskKeys.ts`, `projectKeys.ts` | Hierarchical `as const` structures only. |
| Utility hooks | `use<Thing>.ts` | `useDebouncedValue.ts`, `useFocusTrap.ts`, `useRouteParams.ts` | No API calls inside. |

## Hard rules

1. **API contract knowledge lives ONLY in `lib/axios`.**
   Use `unwrap()` / `unwrapList()` from `@/lib/axios` — never hand-roll
   envelope sniffing (`"success" in response && "data" in response`) or
   ad-hoc `.data || []` chains with shape guessing.
2. **Domain types belong in `types/*.types.ts`.**
   Do not define new shared domain interfaces inside hook files, and do not
   import domain types from another hook file. Legacy exports
   (e.g. `Task` in `useTask.ts`) are kept for compatibility — do not add more.
3. **Route params come from `useRouteParams.ts`** — never `useParams() as string`.
4. **Errors are normalized with `normalizeError()`** — never `catch (err: any)`.
5. **File names must be spelled correctly** — hook names fossilize into
   imports fast (see git history for `useCalenderDayView` / `useFileManagemetPage`).
