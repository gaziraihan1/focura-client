import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/providers/theme-provider";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focura",
  description: "Focura is a next-generation productivity platform designed to help individuals and teams stay focused, organized, and efficient. With smart tools and automation, Focura turns daily tasks into measurable progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LayoutWrapper>
            {children}
            <SpeedInsights />
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
