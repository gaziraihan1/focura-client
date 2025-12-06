import Link from "next/link";

export default function TaskCard({ task }: any) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
      {/* Status */}
      <p className="text-xs font-medium text-gray-500">{task.status}</p>

      {/* Title */}
      <h3 className="text-lg font-semibold mt-1">{task.title}</h3>

      {/* Project Badge */}
      {task.project && (
        <span
          className="inline-block text-xs px-2 py-1 rounded mt-2"
          style={{ backgroundColor: task.project.color + "20" }}
        >
          {task.project.name}
        </span>
      )}

      {/* Priority */}
      <p className="text-xs mt-3">
        Priority: <b>{task.priority}</b>
      </p>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs">
          Due:{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </p>

        <Link
          href={`/tasks/${task.id}`}
          className="text-blue-600 text-sm font-medium"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
