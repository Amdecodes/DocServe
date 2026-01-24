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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Extract customer info from stored form_data to pass to Chapa
    // formatting relies on the expected structure of form_data.personal
    type ChapaFormData = {
      personal?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    const formData =
      typeof order.form_data === "object" && order.form_data !== null
        ? (order.form_data as ChapaFormData)
        : undefined;
    const personal = formData?.personal || {};

    // Use passed values or fallback to stored values
    const payloadEmail = email || personal.email;
    const payloadFirstName = firstName || personal.firstName;
    const payloadLastName = lastName || personal.lastName;
    const payloadPhone = phone || personal.phone;

    // Get price based on service type
    const amount = getPriceForService(order.service_type);

    const payload = {
      amount: amount.toString(),
      currency: PRICE_CURRENCY,
      email: payloadEmail,
      first_name: payloadFirstName,
      last_name: payloadLastName,
      phone_number: payloadPhone,
      tx_ref: order.tx_ref, // Use the existing tx_ref (which is order.id)
      callback_url: `${baseUrl}/api/payment/chapa/webhook`,
      return_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
      customization: {
        title: "CV Service",
        description: "Premium CV Design",
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
