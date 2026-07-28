import { z } from "zod";

export const ProviderTypeEnum = z.enum(["navigator", "counselor", "peer"]);
export const ApplicationStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const ProviderApplySchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name is too long").trim(),
  type: ProviderTypeEnum,
  cost: z.string().min(1, "Cost is required").max(120, "Cost is too long").trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long")
    .trim(),
  tags: z
    .array(z.string().max(50).trim().toLowerCase())
    .default([])
    .transform((tags) => tags.filter(Boolean)),
});

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/\S/, "Password cannot contain only whitespace"),
});

const LocaleRegex = /^[A-Z]{2}(-[A-Z]{2})?$/;

export const ProviderConnectSchema = z.object({
  user_locale: z
    .string()
    .min(2, "Locale is required")
    .max(10, "Locale is too long")
    .toUpperCase()
    .refine((val) => LocaleRegex.test(val), {
      message: "Locale must be in ISO format (e.g., US or US-NY)",
    }),
  provider_type: ProviderTypeEnum,
});

export const ResourceNeedSchema = z.object({
  locale: z.string().max(10).optional().default("US"),
  need: z.enum(["hotline", "sponsor", "community"]).optional().default("community"),
});

export const EscrowSchema = z.object({
  donor_name: z.string().max(120).optional().default("Anonymous Donor"),
  donor_type: z.string().max(120).optional().default("Individual"),
  amount: z.coerce.number().min(0, "Amount must be zero or greater").optional().default(0),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]).optional().default("USD"),
  specific_use_case: z.string().max(500).optional().default(""),
  prefer_general_purpose: z.boolean().optional().default(true),
  open_to_growth_strategy: z.boolean().optional().default(true),
});

export const PartnerOutreachSchema = z.object({
  org_name: z.string().min(1, "Organization name is required").max(200).trim(),
  org_type: z.string().min(1, "Organization type is required").max(120).trim(),
  alignment_focus: z.string().min(1, "Alignment focus is required").max(500).trim(),
  org_recent_initiative: z.string().max(1000).trim().optional().default(""),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(4000).trim(),
});

export const HotlineSchema = z.object({
  locale: z
    .string()
    .min(2, "Locale is required")
    .max(10, "Locale is too long")
    .toUpperCase()
    .refine((val) => LocaleRegex.test(val), {
      message: "Locale must be in ISO format (e.g., US or US-NY)",
    }),
  name: z.string().min(1, "Name is required").max(120).trim(),
  number: z.string().min(1, "Number is required").max(120).trim(),
  text: z.string().min(1, "Text is required").max(500).trim(),
});

export const GrantSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).trim(),
  description: z.string().min(1, "Description is required").max(2000).trim(),
  amount: z.string().min(1, "Amount is required").max(120).trim(),
  coverage: z.string().min(1, "Coverage is required").max(120).trim(),
  featured: z.boolean().optional().default(false),
  rolling: z.boolean().optional().default(false),
  tags: z
    .array(z.string().max(50).trim().toLowerCase())
    .default([])
    .transform((tags) => tags.filter(Boolean)),
});

export const ApplicationUpdateSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
  status: ApplicationStatusEnum,
});

export function formatValidationError<T>(result: { success: false; error: z.ZodError<T> }) {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    return { message: "Invalid request data", issues: result.error.format() };
  }
  const firstIssue = result.error.issues[0];
  return {
    message: firstIssue ? `${firstIssue.path.join(".") || "request"}: ${firstIssue.message}` : "Invalid request data",
  };
}
