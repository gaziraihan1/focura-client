import crypto from "crypto";

export function generateToken(length = 48) {
  return crypto.randomBytes(length).toString("hex");
}

export function tokenExpiry(hours = 1) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
