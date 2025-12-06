"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthSuccess() {
  const router = useRouter();
  const [status, setStatus] = useState("Setting up your session...");

  useEffect(() => {
    const setBackendCookie = async () => {
      try {
        console.log("🔵 Setting backend cookie...");
        
        const response = await fetch("/api/auth/set-backend-cookie", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("🔵 Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Backend cookie set:", data);
          
          setStatus("Success! Redirecting...");
          
          // Small delay to ensure cookie is set
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        } else {
          console.error("❌ Failed to set backend cookie:", response.status);
          setStatus("Session setup failed. Redirecting to login...");
          
          setTimeout(() => {
            router.push("/authentication/login");
          }, 2000);
        }
      } catch (error) {
        console.error("❌ Error setting backend cookie:", error);
        setStatus("An error occurred. Redirecting to login...");
        
        setTimeout(() => {
          router.push("/authentication/login");
        }, 2000);
      }
    };

    setBackendCookie();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin mx-auto text-primary" size={48} />
        <h2 className="text-xl font-semibold text-foreground">{status}</h2>
        <p className="text-foreground/60 text-sm">Please wait...</p>
      </div>
    </div>
  );
}