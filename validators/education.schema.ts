import { z } from "zod";

export const educationSchema = z.object({
  school: z.string().min(2, "School is required"),
  degree: z.string().min(2, "Degree is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  city: z.string().min(2, "City is required"),
});

export type EducationSchema = z.infer<typeof educationSchema>;
