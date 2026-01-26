import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const payloadSchema = z.object({
  product_id: z.string().uuid(),
  variation_id: z.string().uuid().optional().nullable(),
  full_name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().nullable(),
  location: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().optional().nullable(),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);

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
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
        notes: payload.notes ?? null,
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
