"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import type { ApiErrorResponse } from "@/lib/axios";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactFields } from "./ContactFormFields";
import { contactFormSchema, type ContactFormValues } from "./contact-form-schema";

type FormValues = ContactFormValues;

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
      <Button
        onClick={onReset}
        variant="ghost"
        className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
      >
        Send another message
      </Button>
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
    resolver: zodResolver(contactFormSchema),
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
      await api.post("/api/v1/contact", payload, { showErrorToast: false });
      setSubmitted(true);
    } catch (err) {
      const axiosErr = err as {
        response?: { status?: number; data?: ApiErrorResponse };
      };

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
      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        className="w-full gap-2 rounded-xl px-5 py-3.5 text-sm font-bold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
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
      </Button>

      {/* Rate limit notice */}
      <p className="text-center text-xs text-muted-foreground">
        Rate limited to 3 messages per hour per IP to prevent spam.
      </p>
    </form>
  );
};
