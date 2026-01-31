import { CheckCircle } from 'lucide-react'
import React from 'react'

interface SuccessStateProps {
    message: string
}

export default function SuccessState({message}: SuccessStateProps) {
  return (
    <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Email Verified!
            </h1>
            <p className="text-foreground/60 mb-6">{message}</p>
            <p className="text-sm text-foreground/50">
              Redirecting to login page...
            </p>
          </>
  )
}
