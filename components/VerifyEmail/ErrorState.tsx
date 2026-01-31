import { XCircle } from 'lucide-react'
import Link from 'next/link'

interface ErrorStateProps {
    message: string;
}
export default function ErrorState({message}: ErrorStateProps) {
  return (
    <>
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Verification Failed
            </h1>
            <p className="text-foreground/60 mb-6">{message}</p>
            <Link
              href="/authentication/login"
              className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Go to Login
            </Link>
          </>
  )
}
