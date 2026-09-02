import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface InvitationActionsProps {
    onDecline: () => void;
    onAccept: () => void;
    isAccepting: boolean;
}

export default function InvitationActions({onDecline, onAccept, isAccepting}: InvitationActionsProps) {
  return (
    <div className="flex gap-3">
              <Button
                onClick={onDecline}
                disabled={isAccepting}
                variant="outline"
                className="flex-1 px-6 py-3 rounded-lg bg-background hover:bg-muted"
              >
                Decline
              </Button>
              <Button
                onClick={onAccept}
                disabled={isAccepting}
                className="flex-1 px-6 py-3 rounded-lg hover:bg-primary/90 gap-2"
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
              </Button>
            </div>

  )
}
