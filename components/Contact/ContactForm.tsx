"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ContactFields } from "./ContactFormFields";

// ─── Zod schema (mirrors the backend validator) ───────────────────────────────
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be under 255 characters"),
  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be under 200 characters"),
  category: z.enum([
    "GENERAL",
    "BILLING",
    "TECHNICAL",
    "FEATURE_REQUEST",
    "PARTNERSHIP",
    "SECURITY",
    "OTHER",
  ]),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be under 5000 characters"),
  consent: z.boolean().refine((v) => v === true, {
    message: "You must agree to our Privacy Policy to submit this form.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Success state ────────────────────────────────────────────────────────────
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mb-5">
        <CheckCircle2
          className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
          strokeWidth={1.8}
        />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        Message sent!
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-1">
        We received your message and sent a confirmation to your email. Expect a
        reply within{" "}
        <strong className="font-semibold text-foreground">
          2 business days
        </strong>
        .
      </p>
      <p className="text-xs text-muted-foreground mb-8">
        Didn&apos;t get the confirmation? Check your spam folder.
      </p>
      <button
        onClick={onReset}
        className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
      >
        Send another message
      </button>
    </div>
  );
}

// ─── Main form component ──────────────────────────────────────────────────────
export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "GENERAL",
      consent: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { consent, ...payload } = values;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/v1/contact`,
        payload,
        { withCredentials: true }
      );
      setSubmitted(true);
    } catch (err) {
      const axiosErr = err as AxiosError<{
        message?: string;
        error?: string;
      }>;

      if (axiosErr.response?.status === 429) {
        setServerError(
          axiosErr.response.data?.message ??
            "Too many requests. Please try again later."
        );
      } else if (axiosErr.response?.status === 422) {
        setServerError("Please check your form — some fields have errors.");
      } else {
        setServerError(
          "Something went wrong on our end. Please try again or email us directly at focurabusiness@gmail.com."
        );
      }
    }
  };

  if (submitted) {
    return <SuccessState onReset={() => { reset(); setSubmitted(false); }} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact form"
      className="space-y-5"
    >
      {/* Server-level error */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3.5 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
          <p>{serverError}</p>
        </div>
      )}

      <ContactFields register={register} control={control} errors={errors} />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 py-3.5 text-sm font-bold transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 shrink-0" strokeWidth={2} />
            Send Message
          </>
        )}
      </button>

      {/* Rate limit notice */}
      <p className="text-center text-xs text-muted-foreground">
        Rate limited to 3 messages per hour per IP to prevent spam.
      </p>
    </form>
  );
};
