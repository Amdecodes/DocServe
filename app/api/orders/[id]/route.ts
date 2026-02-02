import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPriceForService, PRICE_CURRENCY } from "@/config/pricing";
import { AGREEMENT_TEMPLATES } from "@/config/agreements";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Calculate Price
    const amount = getPriceForService(order.service_type);

    // Determine Display Info
    let title = "Service";
    let description = "Paperless Service";

    if (order.service_type === "cv_writing") {
      title = "Premium CV Service";
      description = "Professional CV Design & Formatting";
    } else if (order.service_type.startsWith("agreement:")) {
      const templateId = order.service_type.split(":")[1];
      const template = AGREEMENT_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        title = template.title;
        description = template.description;
      } else {
        title = "Agreement Service";
        description = "Legal Document Preparation";
      }
    }

    return NextResponse.json({
      id: order.id,
      service_type: order.service_type,
      status: order.status,
      // Pricing
      amount,
      currency: PRICE_CURRENCY,
      // Display
      title,
      description,
      // Meta
      created_at: order.created_at,
    });
  } catch (error) {
    console.error("[API] Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
