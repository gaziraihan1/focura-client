import Link from 'next/link'
import React from 'react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Workspace not found
        </h2>
        <Link
          href="/dashboard/workspaces"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Back to Workspaces
        </Link>
      </div>
  )
}
