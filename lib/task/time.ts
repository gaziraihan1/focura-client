export function getTaskTimeInfo(task: {
  dueDate?: string | Date | null;
  status: string;
}) {
  if (!task.dueDate) {
    return {
      isOverdue: false,
      isDueToday: false,
      hoursUntilDue: null as number | null,
    };
  }

  const now = new Date();
  const due = new Date(task.dueDate);

  const diffMs = due.getTime() - now.getTime();
  const hoursUntilDue = Math.ceil(diffMs / (1000 * 60 * 60));

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const isCompleted =
    task.status === "DONE" || task.status === "COMPLETED";

  return {
    isOverdue: due < now && !isCompleted,
    isDueToday:
      due >= startOfToday && due <= endOfToday && !isCompleted,
    hoursUntilDue: hoursUntilDue >= 0 ? hoursUntilDue : null,
  };
}
