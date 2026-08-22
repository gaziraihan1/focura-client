import { type QueryClient } from "@tanstack/react-query";
import { Task } from "../useTask";
import { taskKeys } from "../taskKeys";
import { ProjectDetails, projectKeys } from "../useProjects";

const MUTATION_RETRY_DELAY = 1000;
const MAX_RETRY_ATTEMPTS = 2;

type ProjectTask = ProjectDetails["tasks"][number];

export function getRetryDelay(attempt: number): number {
  return MUTATION_RETRY_DELAY * Math.pow(2, attempt);
}

export { MAX_RETRY_ATTEMPTS };

/**
 * Response-first cache write shared by task mutations: the mutation response
 * embeds the stored recurrence (and other server-normalized fields), so it is
 * written into the detail cache, every list cache, and every project detail
 * cache immediately — refetches remain only as a background consistency net.
 */
export function propagateTaskResponse(qc: QueryClient, data: Task): void {
  qc.setQueryData(taskKeys.detail(data.id), data);

  qc.getQueriesData({ queryKey: taskKeys.lists() }).forEach(([queryKey, listData]) => {
    if (!listData || typeof listData !== "object" || !("data" in listData)) return;
    const tasks = (listData as { data: Task[] }).data;
    qc.setQueryData(queryKey, { ...listData, data: tasks.map((t) => (t.id === data.id ? data : t)) });
  });

  const serverTask = data as unknown as ProjectTask;
  qc.getQueriesData<ProjectDetails>({ queryKey: projectKeys.details() }).forEach(([queryKey, projectData]) => {
    if (!projectData?.tasks || !projectData.tasks.some((t) => t.id === data.id)) return;
    const tasks = projectData.tasks.map((t) => (t.id === data.id ? serverTask : t));
    qc.setQueryData<ProjectDetails>(queryKey, { ...projectData, tasks });
  });
}
