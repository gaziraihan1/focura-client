// lib/auth/backendToken.ts
import jwt from "jsonwebtoken";

const BACKEND_TOKEN_EXPIRY = "7d";

export function createBackendToken(payload: {
  id: string;
  email: string;
  role?: string;
}) {
  const secret = process.env.BACKEND_JWT_SECRET;

  if (!secret) {
    throw new Error("BACKEND_JWT_SECRET is not defined in environment variables.");
  }

  console.log("🔵 [createBackendToken] Creating token for user:", payload.email);

  return jwt.sign(
    { 
      sub: payload.id, 
      email: payload.email,
      role: payload.role ?? "USER"
    },
    secret,
    { 
      expiresIn: BACKEND_TOKEN_EXPIRY,
      issuer: "focura-app",
      algorithm: 'HS256'
    }
  );
}