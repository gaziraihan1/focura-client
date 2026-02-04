// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as argon2 from "argon2";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import { limiter } from "@/lib/limiter";
import { Prisma } from "@prisma/client";

// Define a type for the request body
interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

// Type guard to validate the request body
function isValidRegisterBody(body: unknown): body is RegisterRequestBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    "email" in body &&
    "password" in body &&
    typeof (body as RegisterRequestBody).name === "string" &&
    typeof (body as RegisterRequestBody).email === "string" &&
    typeof (body as RegisterRequestBody).password === "string"
  );
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    
    // Validate the body
    if (!isValidRegisterBody(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { success } = await limiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (name.length < 4)
      return NextResponse.json(
        { error: "Name must be at least 4 characters" },
        { status: 400 }
      );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    if (password.length < 6)
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // not verified yet
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // expires in 24h

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires,
      },
    });

    // Send email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful! Please verify your email before logging in.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Type guard for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}