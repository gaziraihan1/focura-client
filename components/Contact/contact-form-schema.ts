import { z } from "zod";

// Single source of truth for the public contact form contract — shared by
// ContactForm (the form owner) and ContactFormFields (typed field groups).
// Mirrors the backend validator.
export const contactFormSchema = z.object({
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

export type ContactFormValues = z.infer<typeof contactFormSchema>;