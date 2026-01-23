import { z } from "zod";

export const coverLetterSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  companyName: z.string().min(2, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  letterBody: z
    .string()
    .min(50, "Letter body should be at least 50 characters"),
  tone: z.enum(["Formal", "Neutral", "Confident"]),
  senderName: z.string().min(2, "Your name is required"),
  senderEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  senderPhone: z.string().optional(),
  senderAddress: z.string().optional(),
});

export type CoverLetterSchema = z.infer<typeof coverLetterSchema>;
