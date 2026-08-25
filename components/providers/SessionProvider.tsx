"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LazyMotion, domMax } from "framer-motion";
import LayoutWrapper from "@/components/wrapper/LayoutWrapper";
import ToastProvider from "@/context/providers/ToastProvider";
import { QueryProvider } from "@/context/providers/query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <QueryProvider>
          <LazyMotion features={domMax}>
            <LayoutWrapper>
              {children}
              <ToastProvider />
            </LayoutWrapper>
          </LazyMotion>
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}