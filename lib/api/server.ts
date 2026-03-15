import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_URL;

export async function serverApi<T = unknown>(
  endpoint: string,
): Promise<T | null> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.backendToken;
    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? json) as T;
  } catch {
    return null;
  }
}