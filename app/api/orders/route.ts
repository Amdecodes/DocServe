import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { service_type, form_data } = await req.json();

    console.log(
      `[Orders API] Creating order with language: ${form_data?.documentLanguage}`,
    );

    if (!service_type) {
      return NextResponse.json(
        { error: "service_type is required" },
        { status: 400 },
      );
    }

    // Generate UUID locally
    const id = crypto.randomUUID();

    // Create order with explicit UUID for both id and tx_ref
    const order = await prisma.order.create({
      data: {
        id,
        service_type,
        status: "DRAFT",
        tx_ref: id, // Guaranteed to match
        form_data: form_data || null, // Save CV data from frontend
      },
    });

    return NextResponse.json({
      orderId: order.id,
      tx_ref: order.tx_ref,
    });
  } catch (error) {
    console.error("[API] Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
