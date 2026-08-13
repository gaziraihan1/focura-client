import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import crypto from "crypto";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// Ask the Express backend to revoke every session after a password reset.
// Best-effort and fire-and-forget: the password has already been rotated, so
// the reset must succeed even if the backend is unreachable (lingering
// sessions then die with their 7-day token/session expiry).
function revokeAllSessions(email: string): void {
  // Unit tests have no backend to talk to — skip the network call entirely.
  if (process.env.NODE_ENV === "test") return;
  void (async () => {
    try {
      const timestamp = Date.now();
      const signature = crypto
        .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
        .update(JSON.stringify({ email }))
        .digest("hex");
      await fetch(`${BACKEND_URL}/api/v1/internal/revoke-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp, signature }),
        signal: AbortSignal.timeout(4000),
      });
    } catch (err) {
      if (process.env.NODE_ENV !== "test") {
        console.error("Failed to revoke sessions after password reset:", err);
      }
    }
  })();
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await argon2.hash(password);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword, lastPasswordChange: new Date() },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    revokeAllSessions(resetToken.email);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}