import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function TaskEmpty() {
  return (
     <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-foreground">Task not found</h2>
        <p className="text-muted-foreground">
          The task you&apos;re looking for doesn&apos;t exist.
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
