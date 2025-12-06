"use client";

import { ThemeProvider } from "@/context/providers/theme-provider";
import { SessionProvider } from "next-auth/react";
import LayoutWrapper from "../Wrapper/LayoutWrapper";
import ToastProvider from "@/context/providers/ToastProvider";
import { QueryProvider } from "@/context/providers/query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <QueryProvider>
      
    <ThemeProvider
    attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
          <LayoutWrapper>
            {children}
            <ToastProvider />
          </LayoutWrapper>
        </ThemeProvider>
    </QueryProvider>
  </SessionProvider>;
}