import { signOut } from "next-auth/react";

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
  backendToken?: string
) {
  const res = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: backendToken ? `Bearer ${backendToken}` : "",
    },
  });

  if (res.status === 401) {
    await signOut({ callbackUrl: "/authentication/login" });
    return;
  }

  return res;
}