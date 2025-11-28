"use client";

import { ThemeProvider } from "@/context/providers/theme-provider";
import { SessionProvider } from "next-auth/react";
import LayoutWrapper from "../Wrapper/LayoutWrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <ThemeProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
  </SessionProvider>;
}