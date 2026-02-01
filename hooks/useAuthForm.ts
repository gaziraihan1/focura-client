import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const schema = mode === "login" ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: AuthFormData) => {
    setError("");

    try {
      if (mode === "login") {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
          return;
        }

        if (result?.ok) {
          console.log("✅ Login successful");
          router.push("/dashboard");
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
          if (res.status === 400 && data.error?.includes("already exists")) {
            setError(
              "An account with this email already exists. Please login instead."
            );
          } else {
            setError(data.error || "Registration failed. Please try again.");
          }
          return;
        }

        alert(
          "Registration successful! Please check your email to verify your account."
        );
        router.push("/authentication/login?verifyEmail=true");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    }
  };

  const handleGoogle = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/authentication/success",
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const isLoading = isSubmitting || isGoogleLoading;

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    error,
    isGoogleLoading,
    isLoading,
    onSubmit,
    handleGoogle,
  };
}