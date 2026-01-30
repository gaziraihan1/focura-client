import { X } from 'lucide-react'
import React from 'react'

interface LabelFormHeaderProps {
    onClose: () => void;
    title: string;
    isSubmitting: boolean
}
export default function LabelFormHeader({onClose, isSubmitting, title}: LabelFormHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
  )
}
