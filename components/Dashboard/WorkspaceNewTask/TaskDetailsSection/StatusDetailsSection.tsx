import { CreateTaskDto } from '@/hooks/useTask'
import React from 'react'

interface StatusDetailsSectionProps {
    status: CreateTaskDto["status"];
    onStatusChange: (v: CreateTaskDto["status"]) => void;
}

export default function StatusDetailsSection({status, onStatusChange}: StatusDetailsSectionProps) {
  return (
    <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  onStatusChange(e.target.value as CreateTaskDto["status"])
                }
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
    
  )
}
