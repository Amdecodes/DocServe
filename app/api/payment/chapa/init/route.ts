
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // 1. Load order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 2. Ensure order is payable (DRAFT only)
    if (order.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Order already processed or invalid status" },
        { status: 400 }
      );
    }

    // 3. Update order to PENDING to lock it
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PENDING" },
    });

    // 4. Prepare Chapa payload
    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
    if (!CHAPA_SECRET_KEY) {
        throw new Error("CHAPA_SECRET_KEY is not defined");
    }

    // Get the base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const payload = {
      amount: "500", // Fixed amount for now as per requirement (500 ETB in UI)
      currency: "ETB",
      tx_ref: order.tx_ref,
      callback_url: `${baseUrl}/api/payment/chapa/webhook`, 
      return_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
      // We could add customer info here if we had it in the order or passed from frontend
      // For now using minimal required fields or placeholders if strictly needed
      // Chapa docs say email/first_name etc are optional but good practice. 
      // Since we don't store them in Order yet, we might skip or pass dummy if needed.
      // But the requirement said "send minimum required fields only".
      // Required: amount, currency, tx_ref
      // callback_url and return_url are highly recommended
    };

    // 5. Call Chapa Initialize API
    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status !== "success") {
      console.error("Chapa initialization failed:", data);
      
      // Revert status to FAILED so user knows something went wrong, 
      // or back to DRAFT? usage requirement says "Set order -> FAILED"
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { error: "Payment initialization failed" },
        { status: 400 }
      );
    }

    // 6. Return checkout_url
    return NextResponse.json({
      checkout_url: data.data.checkout_url,
    });

  } catch (error) {
    console.error("[API] Error processing payment init:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
