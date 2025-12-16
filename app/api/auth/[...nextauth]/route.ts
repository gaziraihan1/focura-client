import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";


type NextAuthHandler = (
  req: Request,
  ctx: { params: { nextauth: string[] } }
) => Promise<Response>;

const nextAuthHandler = NextAuth(authOptions) as unknown as NextAuthHandler;

const LOGIN_MAX_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 5 * 60 * 1000; 
const loginAttempts = new Map<string, { count: number; first: number }>();

function getClientIp(req: Request) {
  const header =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  return header.split(",")[0]?.trim() || "unknown";
}

function isLoginPath(path: string) {
  return (
    path.includes("/callback") ||
    path.includes("/signin") ||
    path.endsWith("/login")
  );
}

function isRateLimited(req: Request) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    loginAttempts.set(ip, { count: 1, first: now });
    return false;
  }

  if (now - entry.first > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, first: now });
    return false;
  }

  entry.count += 1;
  loginAttempts.set(ip, entry);

  return entry.count > LOGIN_MAX_ATTEMPTS;
}


export async function GET(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  
  const params = await context.params;
  return await nextAuthHandler(req, { params });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const path = new URL(req.url).pathname;
  if (isLoginPath(path) && isRateLimited(req)) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }
  const params = await context.params;
  return await nextAuthHandler(req, { params });
}
