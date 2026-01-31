import { z } from "zod";

export const webDevSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  project_type: z.enum([
    "PORTFOLIO",
    "LANDING_PAGE",
    "E_COMMERCE",
    "SAAS",
    "CORPORATE",
    "BLOG",
    "OTHER",
  ]),
  budget_range: z.string().optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

export type WebDevFormValues = z.infer<typeof webDevSchema>;
