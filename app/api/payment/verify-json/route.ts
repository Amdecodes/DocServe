import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processOrderPdf } from "@/lib/pdf/process-order";
import { generateAIContent, mergeAIContent } from "@/lib/ai-generator";
import { CVData } from "@/types/cv";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Call Chapa VERIFY API
  const res = await fetch(
    `https://api.chapa.co/v1/transaction/verify/${order.tx_ref}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    },
  );

  const data = await res.json();

  if (
    data.status === "success" ||
    data.status ===
      "success" /* sometimes Chapa verify returns diff structure */
  ) {
    let pdfUrl = order.pdf_url;
    let expiresAt = order.expires_at;

    // Retry PDF gen if missing
    if (!pdfUrl) {
      try {
        console.log(`[VerifyJSON] Generating missing PDF for Order ${orderId}`);

        // Step 1: Generate AI content FIRST (if not already generated)
        let formData = order.form_data as unknown as CVData;
        const isAgreement = order.service_type.startsWith("agreement:");

        console.log(
          `[VerifyJSON] Form data documentLanguage: ${formData?.documentLanguage}`,
        );
        console.log(
          `[VerifyJSON] Form data keys: ${Object.keys(formData || {}).join(", ")}`,
        );

        if (!isAgreement && !formData?.aiMetadata?.generated) {
          console.log(
            `[VerifyJSON] Generating AI content for Order ${orderId}`,
          );
          console.log(
            `[VerifyJSON] Using language: ${formData?.documentLanguage || "en (default)"}`,
          );
          try {
            const aiContent = await generateAIContent(orderId, formData);
            formData = mergeAIContent(formData, aiContent);

            // Mark as AI-generated
            formData.aiMetadata = {
              generated: true,
              generatedAt: aiContent.generatedAt,
              orderId: orderId,
            };

            // Save AI-enhanced form data
            await prisma.order.update({
              where: { id: orderId },
              data: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form_data: formData as unknown as any,
                ai_generated: true,
                ai_generated_at: new Date(aiContent.generatedAt),
              },
            });

            console.log(`[VerifyJSON] AI content generated successfully`);
          } catch (aiError) {
            console.error("[VerifyJSON] AI generation failed:", aiError);
            // Continue with original data if AI fails
          }
        }

        // Step 2: Generate PDF with AI-enriched content
        const result = await processOrderPdf(
          orderId,
          formData,
          order.service_type,
        );
        if (result) {
          pdfUrl = result.pdfUrl;
          expiresAt = result.expiresAt;
        }
      } catch (e) {
        console.error("PDF Gen failed in VerifyJSON:", e);
      }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paid_at: new Date(),
        chapa_ref: data.data?.reference, // Save Chapa reference
        pdf_url: pdfUrl,
        expires_at: expiresAt,
      },
    });
  }

  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
  });

  return NextResponse.json({
    orderId,
    status: data.status === "success" ? "PAID" : "PENDING",
    paidAt: updatedOrder?.paid_at,
    expiresAt: updatedOrder?.expires_at,
    chapa: data,
  });
}
