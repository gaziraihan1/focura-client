export const isProd = process.env.NODE_ENV === "production";

export const BACKEND_COOKIE_NAME = isProd
  ? "__Secure-focura.backend"
  : "focura.backend";
