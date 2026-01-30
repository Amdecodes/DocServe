"use server";

import prisma from "@/lib/prisma";
import {
  VirtualAssistanceStatus,
  PrintOrderStatus,
  WebDevStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { deleteFileFromUrl } from "@/lib/upload";

// Helper to enforce admin auth
async function requireAdmin() {
  const user = await currentUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  console.log(`[Auth Check] User: ${user?.emailAddresses[0]?.emailAddress}, Admin: ${adminEmail}`);

  if (!user || !adminEmail) {
    throw new Error("Unauthorized access: User not logged in or admin email not configured");
  }

  const isEmailMatch = user.emailAddresses.some(
    (e) => e.emailAddress.toLowerCase() === adminEmail.toLowerCase()
  );

  if (!isEmailMatch) {
    console.error(`[Auth Check] Access Denied. User email(s): ${user.emailAddresses.map(e => e.emailAddress).join(', ')} do not match ${adminEmail}`);
    throw new Error("Unauthorized access: Not an admin");
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

export async function getResumeOrders() {
  try {
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
  } catch (error: any) {
    console.error("Database Error in getResumeOrders:", error);
    if (error.message?.includes("Can't reach database server")) {
      throw new Error(
        "Unable to connect to the database. The server may be unreachable.",
      );
    }
    throw error;
  }
}

export async function getPrintOrders() {
  try {
    await requireAdmin();
    const orders = await prisma.printOrder.findMany({
      orderBy: { created_at: "desc" },
    });
    return orders;
  } catch (error: any) {
    console.error("Database Error in getPrintOrders:", error);
    if (error.message?.includes("Can't reach database server")) {
      throw new Error(
        "Unable to connect to the database. The server may be unreachable.",
      );
    }
    throw error;
  }
}

export async function updatePrintOrderStatus(
  id: string,
  status: PrintOrderStatus,
) {
  try {
    await requireAdmin();
    await prisma.printOrder.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/print-orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update print order status", error);
    return { success: false };
  }
}

export async function getVARequests() {
  try {
    await requireAdmin();

    const requests = await prisma.virtualAssistanceRequest.findMany({
      orderBy: { created_at: "desc" },
    });
    return requests;
  } catch (error: any) {
    console.error("Database Error in getVARequests:", error);
    if (error.message?.includes("Can't reach database server")) {
      throw new Error(
        "Unable to connect to the database. The server may be unreachable.",
      );
    }
    throw error;
  }
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
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status", error);
    return { success: false };
  }
}

export async function getWebDevRequests() {
  try {
    await requireAdmin();
    const requests = await prisma.webDevRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return requests;
  } catch (error: any) {
    console.error("Database Error in getWebDevRequests:", error);
    return [];
  }
}

export async function updateWebDevRequestStatus(
  id: string,
  status: WebDevStatus,
) {
  try {
    await requireAdmin();
    await prisma.webDevRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/web-development");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update web dev request status", error);
    return { success: false };
  }
}

// --- Print Products Management ---

export async function getProducts() {
  await requireAdmin();

  const products = await prisma.printProduct.findMany({
    orderBy: { created_at: "desc" },
    include: {
      _count: {
        select: { orders: true },
      },
      variations: true,
    },
  });

  return products.map((p) => ({
    ...p,
    base_price: p.base_price.toNumber(),
  }));
}

export async function createProduct(data: {
  name: string;
  description?: string;
  base_price: number;
  image_url?: string;
  category?: string;
  sub_category?: string;
  active?: boolean;
  variations?: { name: string; image_url: string }[];
}) {
  await requireAdmin();

  const product = await prisma.printProduct.create({
    data: {
      name: data.name,
      description: data.description,
      base_price: data.base_price,
      image_url: data.image_url,
      category: data.category ?? "Marketing",
      sub_category: data.sub_category,
      active: data.active ?? true,
      variations: {
        create: data.variations,
      },
    },
    include: { variations: true },
  });

  revalidatePath("/admin/products");
  revalidatePath("/api/print-products");
  return {
    success: true,
    product: { ...product, base_price: product.base_price.toNumber() },
  };
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    base_price?: number;
    image_url?: string;
    category?: string;
    sub_category?: string;
    active?: boolean;
    variations?: { id?: string; name: string; image_url: string }[];
  },
) {
  try {
    await requireAdmin();

    const { variations, ...productData } = data;

    // Fetch current state to handle image cleanups
    const currentProduct = await prisma.printProduct.findUnique({
      where: { id },
      include: { variations: true },
    });

    if (currentProduct) {
      const imagesToDelete: string[] = [];

      // 1. Check if main product image changed
      if (
        data.image_url &&
        currentProduct.image_url &&
        data.image_url !== currentProduct.image_url
      ) {
        imagesToDelete.push(currentProduct.image_url);
      }

      // 2. Check variations
      if (variations) {
        const incomingIds = variations
          .map((v) => v.id)
          .filter(Boolean) as string[];

        // A. Identify deleted variations => Request deletion of their images
        const varsToDelete = currentProduct.variations.filter(
          (v) => !incomingIds.includes(v.id),
        );
        varsToDelete.forEach((v) => {
          if (v.image_url) imagesToDelete.push(v.image_url);
        });

        // B. Identify updated variations => Check if image changed
        variations.forEach((newVar) => {
          if (newVar.id) {
            const oldVar = currentProduct.variations.find(
              (v) => v.id === newVar.id,
            );
            // If image URL differs, delete the old one
            if (
              oldVar &&
              oldVar.image_url &&
              oldVar.image_url !== newVar.image_url
            ) {
              imagesToDelete.push(oldVar.image_url);
            }
          }
        });
      }

      // Process file system deletions
      if (imagesToDelete.length > 0) {
        // We don't await this to block the UI, but we log errors inside the helper
        Promise.all(imagesToDelete.map((url) => deleteFileFromUrl(url)));
      }
    }

    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.printProduct.update({
        where: { id },
        data: productData,
      });

      if (variations) {
        const existingVars = await tx.printProductVariation.findMany({
          where: { product_id: id },
        });
        const existingIds = existingVars.map((v) => v.id);
        const incomingIds = variations
          .map((v) => v.id)
          .filter(Boolean) as string[];

        // Delete removed variations from DB
        const toDelete = existingIds.filter(
          (eid) => !incomingIds.includes(eid),
        );
        if (toDelete.length > 0) {
          await tx.printProductVariation.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        // Update or Create rest
        for (const v of variations) {
          if (v.id) {
            await tx.printProductVariation.update({
              where: { id: v.id },
              data: { name: v.name, image_url: v.image_url },
            });
          } else {
            await tx.printProductVariation.create({
              data: { product_id: id, name: v.name, image_url: v.image_url },
            });
          }
        }
      }
      return p;
    });

    revalidatePath("/admin/products");
    revalidatePath("/api/print-products");
    return {
      success: true,
      product: { ...product, base_price: product.base_price.toNumber() },
    };
  } catch (error) {
    console.error("Failed to update product", error);
    return { success: false };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();

    // 1. Fetch product and variations to get image URLs
    const product = await prisma.printProduct.findUnique({
      where: { id },
      include: { variations: true },
    });

    if (!product) {
      return { success: false };
    }

    // 2. Delete files from storage
    const urlsToDelete: string[] = [];
    if (product.image_url) urlsToDelete.push(product.image_url);
    product.variations.forEach((v) => {
      if (v.image_url) urlsToDelete.push(v.image_url);
    });

    // Execute deletions in parallel (fire and forget mostly, but we await to be nice)
    await Promise.all(urlsToDelete.map((url) => deleteFileFromUrl(url)));

    // 3. Delete from DB
    await prisma.printProduct.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product", error);
    return { success: false };
  }
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  return updateProduct(id, { active: !currentStatus });
}
