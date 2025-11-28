import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a password reset email has been sent.",
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); 

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires,
      },
    });

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      success: true,
      message: "If an account exists, a password reset email has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}