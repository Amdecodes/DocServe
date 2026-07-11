import { after } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processOrderPdf } from "@/lib/pdf/process-order";
import crypto from "crypto";
import { getPriceForService } from "@/config/pricing";

async function processOrderAsync(
  orderId: string,
  formData: unknown,
  serviceType: string,
  baseUrl: string,
) {
  // Generate AI content (skip for agreements)
  let enrichedFormData = formData;
  const isAgreement = serviceType.startsWith("agreement:");

  if (!isAgreement) {
    try {
      console.log(`[Webhook] Generating AI content for Order ${orderId}`);
      const aiResponse = await fetch(`${baseUrl}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (aiResponse.ok) {
        const updatedOrder = await prisma.order.findUnique({
          where: { id: orderId },
        });
        enrichedFormData = updatedOrder?.form_data || formData;
      } else {
        console.warn(`[Webhook] AI generation failed, using original data`);
      }
    } catch (aiError) {
      console.error("[Webhook] AI generation error:", aiError);
    }
  }

  // Generate PDF
  try {
    const result = await processOrderPdf(
      orderId,
      enrichedFormData,
      serviceType,
    );
    if (result) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          pdf_url: result.pdfUrl,
          expires_at: result.expiresAt,
        },
      });
    }
  } catch (e) {
    console.error("[Webhook] PDF generation failed:", e);
  }
}

export async function POST(req: Request) {
  try {
    const secret =
      (process.env.CHAPA_WEBHOOK_SECRET || process.env.CHAPA_SECRET_KEY)?.trim();
    if (secret) {
      console.log(
        `[Webhook] Loaded secret: length=${secret.length}, prefix="${secret.substring(0, 13)}..."`
      );
    }
    const signature =
      req.headers.get("x-chapa-signature") ||
      req.headers.get("chapa-signature");

    const rawBody = await req.text();

    // 1. Validate Signature - Strict enforcement
    if (!secret || !signature) {
      console.error("[Webhook] Missing secret or signature. Rejecting webhook request.");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

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

    const body = JSON.parse(rawBody);
    const { tx_ref, status } = body;

    if (status !== "success") {
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

    if (order.status === "PAID" && order.pdf_url) {
      return NextResponse.json({ ok: true, message: "Already processed" });
    }

    // 3. Verify with Chapa API
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

    if (verifyData.data.currency !== "ETB") {
      console.error(`Currency mismatch. Got ${verifyData.data.currency}`);
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // 4. Validate Amount Paid Integrity
    const expectedAmount = getPriceForService(order.service_type);
    const paidAmount = Number(verifyData.data.amount);

    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      console.error(`[Webhook] Amount mismatch: Paid ${paidAmount}, Expected ${expectedAmount}`);
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    const { first_name, last_name, email, phone_number, reference } =
      verifyData.data;
    const verifyName = `${first_name || ""} ${last_name || ""}`.trim();

    // 5. Mark order as PAID immediately
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        customer_name: verifyName || undefined,
        customer_email: email || undefined,
        customer_phone: phone_number || undefined,
        chapa_ref: reference,
        paid_at: new Date(),
      },
    });

    console.log(`Order ${order.id} marked as PAID via webhook`);

    // 5. Schedule AI + PDF generation to run after the response is sent
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    after(
      processOrderAsync(order.id, order.form_data, order.service_type, baseUrl),
    );

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
  return NextResponse.json({ ok: true });
}
