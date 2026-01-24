"use server";

import prisma from "@/lib/prisma";
import { VirtualAssistanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Helper to enforce admin auth
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!user || (adminEmail && user.email !== adminEmail)) {
    throw new Error("Unauthorized access");
  }
}

export type AdminOrder = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  status: string;
  ai_generated: boolean;
  created_at: Date;
  ai_generated_at: Date | null;
  chapa_ref: string | null;
  pdf_url: string | null;
  language: string;
};

export async function getOrders() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { created_at: "desc" },
    take: 100,
  });

  return orders.map((order) => {
    // extract language from form_data safely
    const formData = order.form_data as Record<string, unknown> | null;
    const language =
      (formData?.language as string) || (formData?.locale as string) || "—";

    return {
      id: order.id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      status: order.status,
      ai_generated: order.ai_generated,
      created_at: order.created_at,
      ai_generated_at: order.ai_generated_at,
      chapa_ref: order.chapa_ref,
      pdf_url: order.pdf_url,
      language,
    };
  });
}

export async function getVARequests() {
  await requireAdmin();

  const requests = await prisma.virtualAssistanceRequest.findMany({
    orderBy: { created_at: "desc" },
  });
  return requests;
}

export async function updateVAStatus(
  id: string,
  status: VirtualAssistanceStatus,
) {
  try {
    await requireAdmin();

    await prisma.virtualAssistanceRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/virtual-assistance");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status", error);
    return { success: false };
  }
}
