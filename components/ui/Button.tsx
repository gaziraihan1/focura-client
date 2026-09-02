"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared Button primitive.
 *
 * Visual language is taken from the existing codebase conventions:
 * - primary   → solid `bg-primary` CTA (as used on the auth form)
 * - secondary → `bg-accent` soft surface button
 * - outline   → bordered transparent button (OAuth/secondary CTAs)
 * - ghost     → borderless hover-surface button (toolbars, icon triggers)
 * - destructive → `bg-destructive` for delete/confirm actions
 *
 * All classes are merged with `cn()` so any className passed by a caller
 * overrides the defaults (tailwind-merge resolves conflicts), which keeps
 * migration incremental without visual regressions.
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:brightness-110 active:scale-[0.98]",
  secondary: "bg-accent text-foreground hover:bg-accent/70",
  outline:
    "border border-border/70 bg-transparent text-foreground hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]",
  ghost: "text-foreground hover:bg-accent hover:text-foreground",
  destructive:
    "bg-destructive text-white shadow-sm hover:brightness-110 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-sm rounded-xl gap-2",
  icon: "h-9 w-9 p-2 rounded-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  /** Optional element rendered before the label. */
  leftIcon?: ReactNode;
  /** Optional element rendered after the label. */
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none",
          "transition-[color,background-color,border-color,box-shadow,transform,opacity,filter] duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

/**
 * Class-string helper for elements that are NOT buttons but should look like
 * one (e.g. next/link anchors). Usage:
 *
 *   <Link href="..." className={buttonVariants({ variant: "primary", size: "md" })}>
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center font-medium select-none",
    "transition-[color,background-color,border-color,box-shadow,transform,opacity,filter] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export default Button;
