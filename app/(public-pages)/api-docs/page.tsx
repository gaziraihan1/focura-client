import type { Metadata } from "next";
import ApiDocsContent from "./api-docs-content";

export const metadata: Metadata = {
  title: "API Documentation | Focura",
  description:
    "Complete API reference for Focura. Learn about authentication, rate limits, server-sent events, error handling, and available endpoints.",
  keywords: [
    "focura api",
    "focura api documentation",
    "focura rest api",
    "focura developer docs",
    "focura api reference",
  ],
  openGraph: {
    title: "Focura API Documentation – Developer Reference",
    description:
      "Complete API reference for Focura. Authentication, rate limits, SSE, errors, and endpoints.",
    url: "https://focura-client.vercel.app/api-docs",
    siteName: "Focura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focura API Documentation – Developer Reference",
    description:
      "Complete API reference for Focura. Authentication, rate limits, SSE, errors, and endpoints.",
  },
  alternates: {
    canonical: "https://focura-client.vercel.app/api-docs",
  },
};

export default function ApiDocsPage() {
  return <ApiDocsContent />;
}
