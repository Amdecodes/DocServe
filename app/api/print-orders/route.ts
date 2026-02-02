import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { uploadTempFile } from "@/lib/upload";

const payloadSchema = z.object({
  product_id: z.string().uuid(),
  variation_id: z.string().uuid().optional().nullable(),
  full_name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().nullable(),
  location: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  notes: z.string().optional().nullable(),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: any = {};
    const files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {
        product_id: formData.get("product_id"),
        variation_id: formData.get("variation_id") || null,
        full_name: formData.get("full_name"),
        phone: formData.get("phone"),
        email: formData.get("email") || null,
        location: formData.get("location"),
        quantity: formData.get("quantity"),
        notes: formData.get("notes") || null,
      };

      // Extract files
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("file_") && value instanceof File) {
          files.push(value);
        }
      }
    } else {
      data = await request.json();
    }

    const parsed = payloadSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    // Confirm product exists and is active
    const product = await prisma.printProduct.findFirst({
      where: {
        id: payload.product_id,
        active: true,
      },
      select: {
        id: true,
        name: true,
        category: true,
        sub_category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Handle File Uploads
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean strings for safe paths
        const safeCategory = (product.category || "Uncategorized").replace(
          /[^a-zA-Z0-9-_]/g,
          "_",
        );
        const safeSubCategory = (product.sub_category || "General").replace(
          /[^a-zA-Z0-9-_]/g,
          "_",
        );
        // Construct fileName with folders: Category/SubCategory/Filename
        const fileName = `${safeCategory}/${safeSubCategory}/${file.name}`;

        try {
          const uploadResult = await uploadTempFile(
            buffer,
            fileName,
            file.type,
          );
          // Depending on the implementation of uploadTempFile, publicUrl might be null if strictly private,
          // but usually SignedUrl is returned.
          uploadedUrls.push(
            uploadResult.publicUrl || uploadResult.signedUrl || "",
          );
        } catch (err) {
          console.error("Upload error", err);
        }
      }
    }

    // Append URLs to notes
    let finalNotes = payload.notes || "";
    if (uploadedUrls.length > 0) {
      finalNotes += "\n\n--- Attached Files ---\n" + uploadedUrls.join("\n");
    }

    let variationName = null;
    if (payload.variation_id) {
      const variation = await prisma.printProductVariation.findUnique({
        where: { id: payload.variation_id },
        select: { name: true },
      });
      if (variation) {
        variationName = variation.name;
      }
    }

    await prisma.printOrder.create({
      data: {
        id: crypto.randomUUID(),
        product_id: payload.product_id,
        product_name: product.name,
        variation_id: payload.variation_id ?? null,
        variation_name: variationName,
        full_name: payload.full_name,
        phone: payload.phone,
        email: payload.email ?? null,
        location: payload.location,
        quantity: payload.quantity,
        notes: finalNotes || null,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/print-orders POST error", error);
    return NextResponse.json(
      { error: "Failed to submit order" },
      { status: 500 },
    );
  }
}
