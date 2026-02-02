import React from 'react'
interface InvitationErrorProps {
    localError: string;
}

export default function InvitationError({localError}: InvitationErrorProps) {
  return (
    <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">
                  {localError}
                </p>
              </div>
  )
}
