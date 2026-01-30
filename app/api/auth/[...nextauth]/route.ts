import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";
import { limiter } from "@/lib/limiter";


type NextAuthHandler = (
  req: Request,
  ctx: { params: { nextauth: string[] } }
) => Promise<Response>;

const nextAuthHandler = NextAuth(authOptions) as unknown as NextAuthHandler;

function getClientIp(req: Request): string {
  const header =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "";

  return header.split(",")[0]?.trim() || "unknown";
}


function isLoginPath(path: string): boolean {
  return (
    path.includes("/callback/credentials") ||
    path.endsWith("/signin") ||
    path.endsWith("/login")
  );
}


export async function GET(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const params = await context.params;
  return nextAuthHandler(req, { params });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (isLoginPath(path)) {
    const ip = getClientIp(req);

    // Optional: scope by email + IP (stronger protection)
    let email: string | null = null;
    try {
      const body = await req.clone().formData();
      email = body.get("email")?.toString().toLowerCase() || null;
    } catch {}

    const key = email
      ? `login:${ip}:${email}`
      : `login:${ip}`;

    const result = await limiter.limit(key);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
          headers: result.reset
            ? {
                "Retry-After": Math.ceil(
                  (result.reset - Date.now()) / 1000
                ).toString(),
              }
            : {},
        }
      );
    }
  }

  const params = await context.params;
  return nextAuthHandler(req, { params });
}
