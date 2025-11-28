"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, Mail, Lock, User, Chrome } from "lucide-react";

type Props = { mode: "login" | "register" };

export default function AuthForm({ mode }: Props) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    if (mode === "login") {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password: pass,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password: pass }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password: pass,
      });

      if (result?.error) {
        setError("Login failed after registration");
      } else {
        window.location.href = "/dashboard";
      }
    }
  } catch (err) {
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full max-w-md p-8 rounded-3xl
        bg-background/40 backdrop-blur-xl 
        border border-border shadow-lg
      "
    >
      <h1 className="text-3xl font-bold text-foreground text-center">
        {mode === "login" ? "Welcome Back" : "Create Your Account"}
      </h1>

      <p className="text-foreground/60 text-center mt-2">
        {mode === "login" ? "Login to continue" : "Join Focura for free"}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        {mode === "register" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
            <input
              required
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full py-3 pl-10 pr-4 rounded-xl bg-background/60
                border border-border text-foreground placeholder:text-foreground/50
                focus:ring-2 ring-primary outline-none
              "
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
          <input
            required
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full py-3 pl-10 pr-4 rounded-xl bg-background/60
              border border-border text-foreground placeholder:text-foreground/50
              focus:ring-2 ring-primary outline-none
            "
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
          <input
            required
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="
              w-full py-3 pl-10 pr-4 rounded-xl bg-background/60
              border border-border text-foreground placeholder:text-foreground/50
              focus:ring-2 ring-primary outline-none
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium
            hover:opacity-90 transition flex items-center justify-center gap-2
          "
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          onClick={() => signIn("google")}
          className="
            w-full py-3 rounded-xl bg-background text-foreground border border-border
            hover:bg-primary/10 transition flex items-center justify-center gap-2
          "
        >
          <Chrome size={18} /> Continue with Google
        </button>
      </form>

      <p className="text-center text-foreground/60 mt-6 text-sm">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="text-primary ml-1 font-medium hover:underline"
        >
          {mode === "login" ? "Register" : "Login"}
        </Link>
      </p>
    </motion.div>
  );
}
