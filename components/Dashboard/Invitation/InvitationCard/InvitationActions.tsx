import { Check, Loader2 } from 'lucide-react'
import React from 'react'

interface InvitationActionsProps {
    onDecline: () => void;
    onAccept: () => void;
    isAccepting: boolean;
}

export default function InvitationActions({onDecline, onAccept, isAccepting}: InvitationActionsProps) {
  return (
    <div className="flex gap-3">
              <button
                onClick={onDecline}
                disabled={isAccepting}
                className="flex-1 px-6 py-3 rounded-lg font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                disabled={isAccepting}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Accept Invitation
                  </>
                )}
              </button>
            </div>

  )
}
