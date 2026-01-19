import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { service_type } = await req.json();

    if (!service_type) {
      return NextResponse.json(
        { error: "service_type is required" },
        { status: 400 }
      );
    }

    // Create order with auto-generated UUID
    const order = await prisma.order.create({
      data: {
        service_type,
        status: "DRAFT",
        tx_ref: "", // temporary, will be updated
      },
    });

    // Update tx_ref to match order.id for consistency
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { tx_ref: order.id },
    });

    return NextResponse.json({
      orderId: updatedOrder.id,
      tx_ref: updatedOrder.tx_ref,
    });
  } catch (error) {
    console.error("[API] Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
