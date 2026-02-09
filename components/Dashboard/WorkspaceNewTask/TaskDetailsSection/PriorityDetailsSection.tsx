import { PRIORITY_COLORS } from '@/constant/intent.constant'
import { Flag } from 'lucide-react'
import React from 'react'

interface PriorityDetailsSectionProps {
  onPriorityChange: (priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW") => void;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
}

export default function PriorityDetailsSection({onPriorityChange,  priority}: PriorityDetailsSectionProps) {
  return (
     <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Flag size={16} className="inline mr-2" />
            Priority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((priorityLevel) => (
              <button
                key={priorityLevel}
                type="button"
                onClick={() => onPriorityChange(priorityLevel)}
                className={`px-4 py-2.5 rounded-lg border transition text-sm font-medium ${
                  priority === priorityLevel
                    ? PRIORITY_COLORS[priorityLevel]
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                {priorityLevel}
              </button>
            ))}
          </div>
        </div>
  )
}
