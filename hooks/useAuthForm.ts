import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast"; // or: import toast from "react-hot-toast"
import { useState } from "react";
import { safeCallbackUrl } from "@/lib/security/sanitize";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(4, "Name must be at least 4 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type AuthFormData = LoginFormData | RegisterFormData;

interface UseAuthFormProps {
  mode: "login" | "register";
}

export function useAuthForm({ mode }: UseAuthFormProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));

  const schema = mode === "login" ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: AuthFormData) => {
    try {
      if (mode === "login") {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          toast.error("Invalid email or password. Please try again.");
          return;
        }

       if (result?.ok) {
  toast.success("Welcome back!");
  const successUrl = callbackUrl !== "/dashboard"
    ? `/authentication/success?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/authentication/success";
  router.push(successUrl);
}
      } else {
        const registerValues = values as RegisterFormData;

        const res = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: registerValues.name,
            email: registerValues.email,
            password: registerValues.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429) {
            toast.error("Too many attempts. Please try again later.");
          } else if (data.error?.toLowerCase().includes("already exists")) {
            toast.error("An account with this email already exists. Please login instead.");
          } else {
            toast.error(data.error || "Registration failed. Please try again.");
          }
          return;
        }

        toast.success("Registration successful! Please check your email to verify your account.");
        router.push("/authentication/login?verifyEmail=true");
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Something went wrong. Please check your connection and try again.");
    }
  };

 const handleGoogle = async () => {
  setIsGoogleLoading(true);
  try {
    const googleCallback = callbackUrl !== "/dashboard"
      ? `/authentication/success?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/authentication/success";
    await signIn("google", { callbackUrl: googleCallback });
  } catch (err) {
    console.error("Google sign-in error:", err);
    toast.error("Google sign-in failed. Please try again.");
    setIsGoogleLoading(false);
  }
};
  const isLoading = isSubmitting || isGoogleLoading;

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isGoogleLoading,
    isLoading,
    onSubmit,
    handleGoogle,
  };
}