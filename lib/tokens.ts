import crypto from "crypto";


export function generateRawToken(size = 48) {
return crypto.randomBytes(size).toString("hex");
}


export function hashToken(token: string) {
return crypto.createHash("sha256").update(token).digest("hex");
}