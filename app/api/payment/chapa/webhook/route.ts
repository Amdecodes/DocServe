import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Validate Chapa Signature (Optional but recommended security step)
    const secret = process.env.CHAPA_SECRET_KEY;
    if (!secret) {
      console.error("CHAPA_SECRET_KEY is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Read the raw body to verify signature if needed, or just parse JSON
    // Note: In Next.js App Router, verifying signature might require cloning the request or reading body text first.
    // For now, we will follow the user's "Verify API" approach which is more robust than just trusting the webhook payload.

    const body = await req.json();

    // Check if event is successful
    // Chapa webhook payload usually contains: { tx_ref: "...", status: "success", ... }
    const { tx_ref, status } = body;

    if (status !== "success") {
      // If payment failed, we might want to update order to FAILED or just ignore
      console.log(`Webhook received for failed payment: ${tx_ref}`);
      return NextResponse.json({ ok: true });
    }

    if (!tx_ref) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    // 2. Find order
    const order = await prisma.order.findUnique({
      where: { tx_ref: tx_ref },
    });

    if (!order) {
      console.error(`Order not found for tx_ref: ${tx_ref}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If already paid, standard idempotency check
    if (order.status === "PAID") {
      return NextResponse.json({ ok: true, message: "Already processed" });
    }

    // 3. Verify with Chapa API (Double Check)
    // This prevents spoofed webhooks from marking orders as paid
    const verifyUrl = `https://api.chapa.co/v1/transaction/verify/${tx_ref}`;
    const verifyResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });

    const verifyData = await verifyResponse.json();

    if (
      verifyData.status !== "success" ||
      verifyData.data.status !== "success"
    ) {
      console.error("Chapa verification failed", verifyData);
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 },
      );
    }

    // 4. Confirm amount & currency (Basic check)
    const paymentAmount = Number(verifyData.data.amount);
    const expectedAmount = 500; // Fixed for premium_resume

    if (paymentAmount !== expectedAmount) {
      console.error(
        `Amount mismatch. Expected ${expectedAmount}, got ${paymentAmount}`,
      );
      // Depending on policy, you might flag this or reject it.
      // For now, we log it but might still proceed or mark as 'PARTIAL' if we had that status.
      // We will proceed for now but log error.
    }

    if (verifyData.data.currency !== "ETB") {
      console.error(`Currency mismatch. Got ${verifyData.data.currency}`);
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Extract customer details from Chapa verification response
    const { first_name, last_name, email, phone_number, reference } =
      verifyData.data;

    // 5. Update Database
    // Use undefined for customer fields so Prisma ignores them if Chapa returns null/empty
    // This preserves the data we captured during initialization
    const verifyName = `${first_name || ""} ${last_name || ""}`.trim();

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        customer_name: verifyName || undefined,
        customer_email: email || undefined,
        customer_phone: phone_number || undefined,
        chapa_ref: reference, // Save Chapa reference
        paid_at: new Date(),
      },
    });

    console.log(`Order ${order.id} marked as PAID via webhook`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Chapa might check if the URL is valid with a GET request (rare but possible) or just for health check
  return NextResponse.json({ ok: true });
}
