// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";
import { createBackendToken } from "@/lib/auth/backendToken";
import { BACKEND_COOKIE_NAME, isProd } from "@/lib/auth/contants";

const nextAuthHandler = NextAuth(authOptions);

async function handleSetBackendCookie(req: Request) {
  const session = await getServerSession(req, authOptions);
  if (!session?.user?.id)
    return NextResponse.redirect(new URL("/authentication/login", req.url));

  const token = createBackendToken({
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
  });

  const res = NextResponse.redirect(
    new URL("/authentication/success", req.url)
  );
  res.cookies.set({
    name: BACKEND_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  return res;
}

async function handleClearBackendCookie(req: Request) {
  const res = NextResponse.redirect(new URL("/authentication/login", req.url));
  res.cookies.set({
    name: BACKEND_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function GET(
  req: Request,
  context: { params: { nextauth: string[] } }
) {
  const path = new URL(req.url).pathname;
  if (path.endsWith("/set-backend-cookie")) return handleSetBackendCookie(req);
  if (path.endsWith("/clear-backend-cookie"))
    return handleClearBackendCookie(req);
  return await (nextAuthHandler as any)(req, { params: context.params });
}

export async function POST(
  req: Request,
  context: { params: { nextauth: string[] } }
) {
  const path = new URL(req.url).pathname;
  if (path.endsWith("/clear-backend-cookie"))
    return handleClearBackendCookie(req);
  return await (nextAuthHandler as any)(req, { params: context.params });
}
