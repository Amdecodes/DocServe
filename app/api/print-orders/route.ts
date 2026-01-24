import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

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

    const supabase = await createClient();
    const payload = parsed.data;

    // Confirm product exists and is active
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("print_products")
      .select("id,name")
      .eq("id", payload.product_id)
      .eq("active", true)
      .maybeSingle();

    if (productError) {
      console.error("print-orders product lookup error", productError);
      return NextResponse.json({ error: "Unable to verify product" }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let variationName = null;
    if (payload.variation_id) {
       const { data: variation } = await supabase
         .from("print_product_variations")
         .select("name")
         .eq("id", payload.variation_id)
         .maybeSingle();
       if (variation) {
         variationName = variation.name;
       }
    }

    const { error: insertError } = await supabase.from("print_orders").insert({
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
    });

    if (insertError) {
      console.error("print-orders insert error", insertError);
      return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/print-orders POST error", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
