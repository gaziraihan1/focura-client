import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button';

interface LabelFormHeaderProps {
    onClose: () => void;
    title: string;
    isSubmitting: boolean
}
export default function LabelFormHeader({onClose, isSubmitting, title}: LabelFormHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <Button aria-label="Close"
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="p-1 rounded"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
  )
}
