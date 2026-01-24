import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");

  // Guard against missing Supabase config in development to avoid noisy ECONNRESET errors
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from("print_products")
      .select("id,name,description,base_price,image_url,active,created_at, variations:print_product_variations(id, product_id, name, image_url)")
      .eq("active", true);

    if (productId) {
      query = query.eq("id", productId);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    if (productId) {
      const product = data?.[0];
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    console.error("/api/print-products GET error", error);
    return NextResponse.json({ products: [] }, { status: 503 });
  }
}
