import type { Metadata } from "next";
import ApiDocsContent from "./api-docs-content";

export const metadata: Metadata = {
  title: "API Documentation | Gablura",
  description:
    "Complete API reference for Gablura. Learn about authentication, rate limits, server-sent events, error handling, and available endpoints.",
  keywords: [
    "gablura api",
    "gablura api documentation",
    "gablura rest api",
    "gablura developer docs",
    "gablura api reference",
  ],
  openGraph: {
    title: "Gablura API Documentation – Developer Reference",
    description:
      "Complete API reference for Gablura. Authentication, rate limits, SSE, errors, and endpoints.",
    url: "https://gablura-client.vercel.app/api-docs",
    siteName: "Gablura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura API Documentation – Developer Reference",
    description:
      "Complete API reference for Gablura. Authentication, rate limits, SSE, errors, and endpoints.",
  },
  alternates: {
    canonical: "https://gablura-client.vercel.app/api-docs",
  },
};

export default function ApiDocsPage() {
  return <ApiDocsContent />;
}
