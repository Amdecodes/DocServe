import { z } from "zod";

export const experienceSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().default(false),
  description: z.string().min(10, "Description is too short"),
}).refine(data => data.current || (!!data.endDate && data.endDate.length > 0), {
    message: "End date is required unless this is your current job",
    path: ["endDate"],
});

export type ExperienceSchema = z.infer<typeof experienceSchema>;
