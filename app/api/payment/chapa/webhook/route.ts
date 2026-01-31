import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processOrderPdf } from "@/lib/pdf/process-order";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const secret =
      process.env.CHAPA_WEBHOOK_SECRET || process.env.CHAPA_SECRET_KEY;
    const signature =
      req.headers.get("x-chapa-signature") ||
      req.headers.get("chapa-signature");

    // We consume text() first for signature verification
    const rawBody = await req.text();

    // 1. Validate Signature
    if (secret && signature) {
      const hash = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");
      if (hash !== signature) {
        console.error("[Webhook] Invalid signature. Ignoring request.");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 403 },
        );
      }
    } else {
      console.warn(
        "[Webhook] Missing secret or signature. Proceeding with caution (DEV mode behavior).",
      );
    }

    const body = JSON.parse(rawBody);

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
    // BUT check if PDF is missing despite being PAID (retry scenario)
    if (order.status === "PAID" && order.pdf_url) {
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

    // Verify amount and currency
    const paymentAmount = Number(verifyData.data.amount);
    const expectedAmount = 500; // Fixed for premium_resume

    if (paymentAmount !== expectedAmount) {
      console.warn(
        `Amount mismatch. Expected ${expectedAmount}, got ${paymentAmount}`,
      );
    }

    if (verifyData.data.currency !== "ETB") {
      console.error(`Currency mismatch. Got ${verifyData.data.currency}`);
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Extract customer details from Chapa verification response
    const { first_name, last_name, email, phone_number, reference } =
      verifyData.data;
    const verifyName = `${first_name || ""} ${last_name || ""}`.trim();

    // 5. Initialize PDF tracking variables
    let pdfUrl = order.pdf_url; // Keep existing if present
    let expiresAt = order.expires_at;

    // 6. Generate AI Content (BEFORE PDF generation)
    let enrichedFormData = order.form_data;
    const isAgreement = order.service_type.startsWith("agreement:");

    if (!pdfUrl && !isAgreement) {
      try {
        console.log(`[Webhook] Generating AI content for Order ${order.id}`);

        // Call AI generation endpoint
        const aiResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.id }),
          },
        );

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          console.log(`[Webhook] AI generation completed:`, aiResult.aiContent);

          // Reload order to get enriched data
          const updatedOrder = await prisma.order.findUnique({
            where: { id: order.id },
          });
          enrichedFormData = updatedOrder?.form_data || order.form_data;
        } else {
          console.warn(
            `[Webhook] AI generation failed, continuing with original data`,
          );
        }
      } catch (aiError) {
        console.error("[Webhook] AI generation error:", aiError);
        // Continue with original data if AI fails
      }
    }

    // 7. Generate PDF with AI-enriched content
    if (!pdfUrl) {
      try {
        const result = await processOrderPdf(
          order.id,
          enrichedFormData,
          order.service_type,
        );
        if (result) {
          pdfUrl = result.pdfUrl;
          expiresAt = result.expiresAt;
        }
      } catch (e) {
        console.error(
          "PDF Fail in Webhook (non-blocking for payment status):",
          e,
        );
      }
    }

    // 8. Update Database
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        customer_name: verifyName || undefined,
        customer_email: email || undefined,
        customer_phone: phone_number || undefined,
        chapa_ref: reference, // Save Chapa reference
        paid_at: new Date(),
        pdf_url: pdfUrl,
        expires_at: expiresAt,
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
