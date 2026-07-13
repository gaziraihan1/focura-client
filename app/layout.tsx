import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { cookies } from "next/headers";
import Providers from "@/components/Providers/SessionProvider";
import { themeScript } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focura – Focus Smarter. Manage Workspaces, Projects & Teams",
  description:
    "Focura helps teams stay focused with smart workspaces, task management, real-time collaboration, and productivity insights—all in one platform.",

  keywords: [
    "productivity platform",
    "workspace management",
    "task management",
    "team collaboration",
    "project tracking",
    "focura",
  ],

  applicationName: "Focura",
  category: "productivity",

  openGraph: {
    title: "Focura – Focus Smarter. Work Better.",
    description:
      "Organize workspaces, manage tasks, collaborate with your team, and track productivity—all in one focused platform.",
    url: "https://focura-client.vercel.app",
    siteName: "Focura",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focura productivity platform dashboard",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Focura – Focus Smarter. Work Better.",
    description:
      "Manage workspaces, tasks, and teams with clarity. Stay focused with Focura.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: "https://focura-client.vercel.app",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isDark = cookieStore.get("theme")?.value === "dark";

  return (
    <html lang="en" className={isDark ? "dark" : ""} suppressHydrationWarning data-scroll-behavior="smooth">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>{children}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
