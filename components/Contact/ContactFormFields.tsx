import { useWatch } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors outline-none focus:ring-2";

const inputNormal =
  "border-border focus:border-ring focus:ring-ring/30";

const inputError =
  "border-destructive focus:ring-destructive/30";

const categories = [
  { value: "GENERAL", label: "General Enquiry" },
  { value: "BILLING", label: "Billing & Subscriptions" },
  { value: "TECHNICAL", label: "Technical Issue" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "SECURITY", label: "Security" },
  { value: "OTHER", label: "Other" },
] as const;

interface FieldWrapProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function FieldWrap({
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
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface ContactFieldsProps {
  register: any;
  control: any;
  errors: any;
}

export function ContactFields({ register, control, errors }: ContactFieldsProps) {
  const messageValue = useWatch({
    control,
    name: "message",
    defaultValue: "",
  });

  return (
    <>
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
          <span className="absolute bottom-3 right-3 text-[11px] text-muted-foreground pointer-events-none">
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
            className="mt-0.5 w-4 h-4 shrink-0 rounded border-input accent-primary cursor-pointer"
            aria-invalid={!!errors.consent}
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            I agree to Focura&apos;s{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 decoration-muted-foreground/40 hover:decoration-foreground transition-colors"
            >
              Privacy Policy
            </a>
            . I understand my message and contact details will be stored and
            used to respond to my enquiry.
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-destructive flex items-center gap-1 pl-7">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.consent.message}
          </p>
        )}
      </div>
    </>
  );
}
