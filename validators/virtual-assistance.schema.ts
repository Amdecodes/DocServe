import { z } from "zod";

// Simplified job categories - grouped by sector
export const jobCategories = [
  // Technology
  "technology_it",
  // Business & Finance
  "business_finance",
  // Design & Creative
  "design_creative",
  // Marketing & Sales
  "marketing_sales",
  // Healthcare
  "healthcare",
  // Education
  "education",
  // Administration
  "administration",
  // Skilled Trades
  "skilled_trades",
  // Hospitality & Service
  "hospitality_service",
  // Other
  "other",
] as const;

export const experienceLevels = [
  "entry",
  "mid",
  "senior",
  "executive",
] as const;

export const virtualAssistanceSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone_number: z.string().min(9, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  telegram_username: z.string().optional().or(z.literal("")),
  job_category: z.enum(jobCategories, {
    message: "Please select a job category",
  }),
  experience_level: z.enum(experienceLevels, {
    message: "Please select your experience level",
  }),
  location: z.string().min(2, "Location is required"),
  notes: z
    .string()
    .max(700, "Notes must be 700 characters or less")
    .optional()
    .or(z.literal("")),
  disclaimer_accepted: z.literal(true, {
    message: "You must accept the disclaimer to continue",
  }),
  language: z.enum(["en", "am"]),
  source: z.enum(["dashboard", "landing"]),
});

export type VirtualAssistanceSchema = z.infer<typeof virtualAssistanceSchema>;

export type JobCategory = (typeof jobCategories)[number];
export type ExperienceLevel = (typeof experienceLevels)[number];
