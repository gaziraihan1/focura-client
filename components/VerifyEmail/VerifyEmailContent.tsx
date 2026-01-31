"use client";

import { useSearchParams } from "next/navigation";
import { VerifyEmailContainer } from "./VerifyEmailContainer";
import ErrorState from "./ErrorState";
import SuccessState from "./SuccessState";
import LoadingState from "./LoadingState";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { status, message } = useVerifyEmail({ token });

  return (
    <VerifyEmailContainer>
      {status === "loading" && <LoadingState />}
      {status === "success" && <SuccessState message={message} />}
      {status === "error" && <ErrorState message={message} />}
    </VerifyEmailContainer>
  );
}