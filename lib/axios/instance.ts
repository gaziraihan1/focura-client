import axios from "axios";

// ─── Axios instance ───────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  // use Authorization header, not cookies.
  // withCredentials must stay false so the NextAuth session cookie is not
  // sent on API calls (backend authenticates via Bearer token only).
  withCredentials: false,
});

export default axiosInstance;
