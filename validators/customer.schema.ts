import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
