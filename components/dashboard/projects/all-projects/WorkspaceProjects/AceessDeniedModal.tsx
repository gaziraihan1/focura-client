// AccessDeniedModal.tsx
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessDeniedModal({ isOpen, onClose }: AccessDeniedModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close modal"
        >
          <X size={20} />
        </Button>

        <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
        <p className="text-muted-foreground mb-4">
          You don&apos;t have access to view this project. Please contact the
          project owner or workspace administrator to request access.
        </p>

        <Button onClick={onClose} className="w-full py-2 rounded-lg">
          Close
        </Button>
      </div>
    </div>
  );
}