import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingState() {
  return (
    <>
      <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Verifying Your Email
      </h1>
      <p className="text-foreground/60">Please wait...</p>
    </>
  );
}
