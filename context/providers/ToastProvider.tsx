// components/providers/ToastProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <div className="fixed inset-0 pointer-events-none z-9999">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 4000,
          className: "pointer-events-auto",
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(8px)",
          },
          // Success style
          success: {
            duration: 3000,
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--primary)",
              borderRadius: "var(--radius-lg)",
            },
            iconTheme: {
              primary: "var(--primary)",
              secondary: "var(--primary-foreground)",
            },
          },
          // Error style
          error: {
            duration: 4000,
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--destructive)",
              borderRadius: "var(--radius-lg)",
            },
            iconTheme: {
              primary: "var(--destructive)",
              secondary: "#fff",
            },
          },
          // Loading style
          loading: {
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
            },
            iconTheme: {
              primary: "var(--primary)",
              secondary: "var(--primary-foreground)",
            },
          },
        }}
      />
    </div>
  );
}