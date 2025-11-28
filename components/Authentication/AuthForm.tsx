"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, Mail, Lock, User, Chrome, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AuthFormProps {
  mode: "login" | "register";
}

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(4, "Name must be at least 4 characters"),
});

export default function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const schema = mode === "login" ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema) as any,
  });

  const onSubmit = async (values: Record<string, string>) => {
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
          window.location.assign("/dashboard");
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (res.ok) {
          setError("");
          alert(
            "Registration successful! Please check your email to verify your account."
          );
          window.location.assign("/authentication/login");
          return;
        }

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

        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          setError(
            "Registration successful, but login failed. Please try logging in manually."
          );
          return;
        }

        if (result?.ok) {
          window.location.assign("/dashboard");
        }
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
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const isLoading = isSubmitting || isGoogleLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border shadow-lg"
    >
      <h1 className="text-3xl font-bold text-foreground text-center">
        {mode === "login" ? "Welcome Back" : "Create Your Account"}
      </h1>

      <p className="text-foreground/60 text-center mt-2">
        {mode === "login" ? "Login to continue" : "Join Focura for free"}
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-red-500 text-sm">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {mode === "register" && (
          <div className="relative">
            <User
              className="absolute left-3 top-3.5 text-foreground/50"
              size={18}
            />
            <input
              {...register("name")}
              placeholder="Full Name"
              disabled={isLoading}
              className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
                errors.name ? "border-red-500" : "border-border"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.name.message as string}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          <Mail
            className="absolute left-3 top-3.5 text-foreground/50"
            size={18}
          />
          <input
            {...register("email")}
            type="email"
            placeholder="Email Address"
            disabled={isLoading}
            className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
              errors.email ? "border-red-500" : "border-border"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <div className="relative">
          <Lock
            className="absolute left-3 top-3.5 text-foreground/50"
            size={18}
          />
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            disabled={isLoading}
            className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
              errors.password ? "border-red-500" : "border-border"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.password.message as string}
            </p>
          )}
        </div>

        {mode === "login" && (
          <div className="text-right -mt-2">
            <Link
              href="/authentication/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {mode === "login" ? "Login" : "Register"}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative bg-background/40 px-4">
            <span className="text-foreground/50 text-sm">or</span>
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogle}
          className="w-full py-3 rounded-xl bg-background text-foreground border border-border hover:bg-primary/10 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Chrome size={18} />
          )}
          Continue with Google
        </button>
      </form>

      <p className="text-center text-foreground/60 mt-6 text-sm">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <Link
          href={
            mode === "login"
              ? "/authentication/registration"
              : "/authentication/login"
          }
          className="text-primary ml-1 font-medium hover:underline"
        >
          {mode === "login" ? "Register" : "Login"}
        </Link>
      </p>
    </motion.div>
  );
}
