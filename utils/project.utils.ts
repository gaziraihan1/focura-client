export const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLANNING: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      ACTIVE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      ON_HOLD: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      COMPLETED: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      ARCHIVED: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500";
  };

 export const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENT: "bg-red-500/10 text-red-600 dark:text-red-400",
      HIGH: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      MEDIUM: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      LOW: "bg-green-500/10 text-green-600 dark:text-green-400",
    };
    return colors[priority] || "bg-gray-500/10 text-gray-500";
  };