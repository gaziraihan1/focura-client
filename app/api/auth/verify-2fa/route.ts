import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, callInternal } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { verifySync as verifyTOTP } from "otplib";

// Completes the Google sign-in 2FA step. Only reachable with a PENDING
// session (the user is authenticated at the NextAuth level but has no
// backend tokens yet). Verifies the TOTP code locally for a clean error,
// then asks the backend to mint the short-lived single-use marker the jwt
// callback consumes on the next session update().
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.twoFactorPending) {
      return NextResponse.json(
        { error: "No pending 2FA session" },
        { status: 401 }
      );
    }

    const { totpCode } = (await req.json()) as { totpCode?: unknown };
    if (typeof totpCode !== "string" || !/^\d{6}$/.test(totpCode.trim())) {
      return NextResponse.json({ error: "Code must be 6 digits" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true },
    });
    if (!user?.twoFactorSecret) {
      return NextResponse.json(
        { error: "Two-factor authentication is not configured. Please contact support." },
        { status: 400 }
      );
    }

    let valid = false;
    try {
      valid = verifyTOTP({ token: totpCode.trim(), secret: user.twoFactorSecret }).valid;
    } catch {
      valid = false;
    }
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    const marker = await callInternal("/2fa-verify", {
      userId: session.user.id,
      totpCode: totpCode.trim(),
    });
    if (!marker) {
      return NextResponse.json(
        { error: "Verification service unavailable. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}
