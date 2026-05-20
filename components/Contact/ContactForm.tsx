"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

const categories = [
  { value: "GENERAL", label: "General Enquiry" },
  { value: "BILLING", label: "Billing & Subscriptions" },
  { value: "TECHNICAL", label: "Technical Issue" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "SECURITY", label: "Security" },
  { value: "OTHER", label: "Other" },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────
interface FieldWrapProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

function FieldWrap({
  label,
  htmlFor,
  error,
  required,
  children,
  hint,
}: FieldWrapProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors outline-none focus:ring-2";

const inputNormal =
  "border-neutral-200 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-neutral-200 dark:focus:ring-neutral-700";

const inputError =
  "border-red-300 dark:border-red-700 focus:border-red-400 dark:focus:border-red-600 focus:ring-red-100 dark:focus:ring-red-900/30";

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
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        Message sent!
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed mb-1">
        We received your message and sent a confirmation to your email. Expect a
        reply within{" "}
        <strong className="font-semibold text-neutral-700 dark:text-neutral-300">
          2 business days
        </strong>
        .
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-8">
        Didn&apos;t get the confirmation? Check your spam folder.
      </p>
      <button
        onClick={onReset}
        className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 underline underline-offset-2 transition-colors"
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

const messageValue = useWatch({
  control,
  name: "message",
  defaultValue: "",
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
          className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 px-4 py-3.5 text-sm text-red-800 dark:text-red-300"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
          <p>{serverError}</p>
        </div>
      )}

      {/* Name + Email row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrap
          label="Full Name"
          htmlFor="name"
          error={errors.name?.message}
          required
        >
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            {...register("name")}
            className={cn(inputBase, errors.name ? inputError : inputNormal)}
            aria-invalid={!!errors.name}
          />
        </FieldWrap>

        <FieldWrap
          label="Email Address"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className={cn(inputBase, errors.email ? inputError : inputNormal)}
            aria-invalid={!!errors.email}
          />
        </FieldWrap>
      </div>

      {/* Category */}
      <FieldWrap
        label="Category"
        htmlFor="category"
        error={errors.category?.message}
        required
      >
        <select
          id="category"
          {...register("category")}
          className={cn(
            inputBase,
            "cursor-pointer",
            errors.category ? inputError : inputNormal
          )}
          aria-invalid={!!errors.category}
        >
          {categories.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FieldWrap>

      {/* Subject */}
      <FieldWrap
        label="Subject"
        htmlFor="subject"
        error={errors.subject?.message}
        required
      >
        <input
          id="subject"
          type="text"
          placeholder="Briefly describe your enquiry"
          {...register("subject")}
          className={cn(inputBase, errors.subject ? inputError : inputNormal)}
          aria-invalid={!!errors.subject}
        />
      </FieldWrap>

      {/* Message */}
      <FieldWrap
        label="Message"
        htmlFor="message"
        error={errors.message?.message}
        required
        hint="Minimum 20 characters. The more detail you provide, the faster we can help."
      >
        <div className="relative">
          <textarea
            id="message"
            rows={6}
            placeholder="Describe your question or issue in detail…"
            {...register("message")}
            className={cn(
              inputBase,
              "resize-none",
              errors.message ? inputError : inputNormal
            )}
            aria-invalid={!!errors.message}
          />
          <span className="absolute bottom-3 right-3 text-[11px] text-neutral-400 dark:text-neutral-500 pointer-events-none">
            {messageValue.length}/5000
          </span>
        </div>
      </FieldWrap>

      {/* Consent */}
      <div className="space-y-1.5">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-0.5 w-4 h-4 shrink-0 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
            aria-invalid={!!errors.consent}
          />
          <span className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            I agree to Focura&apos;s{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-700 transition-colors"
            >
              Privacy Policy
            </a>
            . I understand my message and contact details will be stored and
            used to respond to my enquiry.
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 pl-7">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-xl px-5 py-3.5 text-sm font-bold transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
      <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
        Rate limited to 3 messages per hour per IP to prevent spam.
      </p>
    </form>
  );
};