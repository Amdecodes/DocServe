import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPriceForService, PRICE_CURRENCY } from "@/config/pricing";

export async function POST(req: Request) {
  try {
    const { orderId, email, firstName, lastName, phone } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    // 1. Load order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Ensure order is payable
    // Allow retrying if status is FAILED or PENDING or DRAFT
    if (order.status === "PAID") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 },
      );
    }

    // 3. Update order to PENDING (Reuse existing tx_ref = id)
    // We maintain order.id === tx_ref as per requirement.
    // Ensure Chapa allows retries with same tx_ref or handle failures gracefully.

    // Construct customer name
    const customerName =
      firstName || lastName
        ? `${firstName || ""} ${lastName || ""}`.trim()
        : undefined;

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PENDING",
        // tx_ref is NOT updated, keeping it same as order.id
        // Update customer details if provided
        customer_email: email,
        customer_phone: phone,
        customer_name: customerName,
      },
    });

    // 4. Prepare Chapa payload
    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
    if (!CHAPA_SECRET_KEY) {
      throw new Error("CHAPA_SECRET_KEY is not defined");
    }

    // Get the base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Extract customer info from stored form_data to pass to Chapa
    // formatting relies on the expected structure of form_data.personal (agreements) or personalInfo (CVs)
    type ChapaFormData = {
      personal?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
      };
      personalInfo?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
      };
      [key: string]: unknown;
    };

    const formData = order.form_data as unknown as ChapaFormData;
    const personal = formData?.personal || formData?.personalInfo || {};

    // Use passed values or fallback to stored values
    const payloadEmail = email || personal.email;
    const payloadFirstName = firstName || personal.firstName;
    const payloadLastName = lastName || personal.lastName;

    // --- DATA ROBUSTNESS & SANITIZATION (FOR CHAPA PAYLOAD ONLY) ---
    // Chapa is strict about email format and phone numbers.
    // 1. Email Validation & Fallback
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // If the provided email is invalid OR contains "example.com"
    // or if it's missing entirely, we MUST provide a valid fallback for the payment gateway.
    let chapaEmail = payloadEmail;
    const isActuallyValid = chapaEmail && emailRegex.test(chapaEmail) && !chapaEmail.includes("example.com");

    if (!isActuallyValid) {
       console.warn(`[Chapa Init] Using fallback email for "${chapaEmail}" to avoid initialization failure.`);
       chapaEmail = "elaemail@gmail.com";
    }

    // 2. Phone Validation & Fallback
    // Chapa also validates phone numbers if provided. We'll sanitize and fallback if needed.
    let chapaPhone = phone || (personal as any).phone;
    // Simple check: must be at least 8 characters for Chapa to accept it generally
    if (!chapaPhone || String(chapaPhone).length < 8) {
       chapaPhone = "0913894924";
    }
    
    // 3. Name Sanitization
    const chapaFirstName = (payloadFirstName || "Valued").replace(/[^\w\s\u1200-\u137F]/gi, "").substring(0, 30);
    const chapaLastName = (payloadLastName || "Customer").replace(/[^\w\s\u1200-\u137F]/gi, "").substring(0, 30);
    // --- END SANITIZATION ---

    // Get price based on service type
    const amount = getPriceForService(order.service_type);

    // Determine Display Info for Chapa
    let title = "Service";
    let description = "Paperless Service";

    if (order.service_type === "cv_writing") {
      title = "CV Writing";
      description = "Premium CV Design Service";
    } else if (order.service_type.startsWith("agreement:")) {
      const templateId = order.service_type.split(":")[1];
      title = "Agreement";
      description = `Payment for ${templateId.replace(/-/g, " ")}`;
    }

    // Sanitize title and description for Chapa - strictly Latin/ASCII as per error
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9.\-_ ]/g, "").substring(0, 16) || "Service Pay";
    const sanitizedDescription = description.replace(/[^a-zA-Z0-9.\-_ ]/g, "").substring(0, 50) || "Paperless Digital Service";

    // Construct payload
    const payload: Record<string, unknown> = {
      amount: amount.toString(),
      currency: PRICE_CURRENCY,
      tx_ref: order.tx_ref,
      callback_url: `${baseUrl}/api/payment/chapa/webhook`,
      return_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
      email: chapaEmail,
      phone_number: chapaPhone,
      first_name: chapaFirstName,
      last_name: chapaLastName,
      customization: {
        title: sanitizedTitle,
        description: sanitizedDescription,
      },
    };

    // 5. Call Chapa Initialize API
    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

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
        { status: 400 },
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
      { status: 500 },
    );
  }
}
