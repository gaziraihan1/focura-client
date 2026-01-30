import { Link, Lock } from 'lucide-react'
import React from 'react'

export default function TaskDetailsPermission() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Lock className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to view this task.
        </p>
        <Link
          href="/dashboard/tasks"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Back to Tasks
        </Link>
      </div>
  )
}
