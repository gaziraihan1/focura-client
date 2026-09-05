// ─────────────────────────────────────────────────────────────────────────────
// Auth — HMAC exchange proof + backend token exchange
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "crypto";
import type { TokenResponse } from "./types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export function createExchangeProof(
  userId: string,
  email: string,
  role: string,
  sessionId: string,
) {
  const timestamp = Date.now();
  const payload = `${userId}${email.toLowerCase().trim()}${role}${sessionId}${timestamp}`;
  const signature = crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(payload)
    .digest("hex");
  return { timestamp, signature };
}

export async function exchangeForTokens(
  user: { id: string; email: string; role: string },
  sessionId: string,
): Promise<TokenResponse | null> {
  try {
    const { timestamp, signature } = createExchangeProof(
      user.id,
      user.email,
      user.role,
      sessionId,
    );
    const normalizedEmail = user.email.toLowerCase().trim();
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: normalizedEmail,
        role: user.role,
        sessionId,
        timestamp,
        signature,
      }),
    });
    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error("❌ Exchange failed:", res.status, errorBody);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error("❌ Exchange network error:", err);
    return null;
  }
}
