"use client";

import { CodeBlock, IC, Prose, RowList, SectionH, Tip } from "../";
export function ApiLayerSection() {
  return (
    <div>
      <Prose>
        All HTTP calls on the client go through a single Axios instance defined in <IC>lib/axios.ts</IC>. Never import Axios directly in a hook or component — always use this instance.
      </Prose>

      <SectionH>Axios instance</SectionH>
      <CodeBlock label="lib/axios.ts">{`import axios from "axios";

// NEXT_PUBLIC_API_URL for browser, BACKEND_URL for server — never mix them
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Attach Bearer token from NextAuth session
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = \`Bearer \${session.accessToken}\`;
  }
  return config;
});

// On 401: refresh tokens and retry original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await refreshSession();
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;`}</CodeBlock>

      <SectionH>env var rule — critical</SectionH>
      <RowList items={[
        { label: "NEXT_PUBLIC_API_URL", desc: "Used in lib/axios.ts (browser). Prefixed so Next.js bundles it into client JS" },
        { label: "BACKEND_URL", desc: "Used in server components and NextAuth callbacks only. Never referenced client-side" },
      ]} />

      <SectionH>Response unwrapping pattern</SectionH>
      <Prose>The backend returns data directly (not nested under a <IC>data</IC> key). Axios already wraps the HTTP response in <IC>res.data</IC>, so the correct access pattern is:</Prose>
      <CodeBlock label="hooks/useSomething.ts">{`// ✅ Correct — backend returns { isAdmin: true }
const isAdmin = res?.isAdmin;

// ❌ Wrong — double-unwrapping
const isAdmin = res?.data?.isAdmin;`}</CodeBlock>

      <Tip>
        If you see <IC>undefined</IC> when data should exist, double-unwrapping is the most common cause. Check what the backend actually returns before assuming the shape.
      </Tip>
    </div>
  );
}
