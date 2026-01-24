"use server";

import { z } from "zod";

const printOrderSchema = z.object({
  productId: z.string(),
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(9, "Valid phone number required"),
  location: z.string().min(2, "Location is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type PrintOrderState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitPrintOrder(
  prevState: PrintOrderState,
  formData: FormData
): Promise<PrintOrderState> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const validatedFields = printOrderSchema.safeParse({
    productId: formData.get("productId"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    quantity: formData.get("quantity"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      error: "Validation failed",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Here you would save to DB or send email/telegram
  // For now, we just log it as per UI build spec
  console.log("Print Order Received:", validatedFields.data);

  return { success: true };
}
