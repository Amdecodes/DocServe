import { z } from "zod";

export const personalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  jobTitle: z.string().optional().or(z.literal("")),
  headline: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
  photo: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export type PersonalSchema = z.infer<typeof personalSchema>;
