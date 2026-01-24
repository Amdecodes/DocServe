import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("admin print-orders auth error", userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user || user.email !== process.env.SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("print_orders")
      .select(
        "id,product_id,product_name,full_name,phone,email,location,quantity,notes,status,created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ orders: data ?? [] });
  } catch (error) {
    console.error("/api/admin/print-orders GET error", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
