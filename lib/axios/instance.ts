import axios from "axios";
import { PUBLIC_API_BASE_URL } from "@/lib/config/api";

// ─── Axios instance ──────────────────────────────────────────────────────────

if (!PUBLIC_API_BASE_URL) throw new Error("API_BASE_URL is not set");

export const axiosInstance = axios.create({
  baseURL: PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  // use Authorization header, not cookies.
  // withCredentials must stay false so the NextAuth session cookie is not
  // sent on API calls (backend authenticates via Bearer token only).
  withCredentials: false,
});

export default axiosInstance;
