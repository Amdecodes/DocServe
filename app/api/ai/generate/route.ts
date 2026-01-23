import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAIContent, mergeAIContent } from "@/lib/ai-generator";
import { CVData } from "@/types/cv";

/**
 * AI Content Generation Endpoint
 * POST /api/ai/generate
 *
 * Generates AI content for paid orders only
 * Called by payment webhook after successful payment
 */
export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

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

    // 2. Verify payment (AI generation only for PAID orders)
    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: "Order must be paid before AI generation" },
        { status: 403 },
      );
    }

    // 3. Check if AI already generated (prevent duplicate generation)
    const formData = order.form_data as unknown as CVData;
    if (formData?.aiMetadata?.generated) {
      return NextResponse.json({
        message: "AI content already generated",
        alreadyGenerated: true,
      });
    }

    // 4. Generate AI content
    console.log(`[AI Generator] Starting generation for Order ${orderId}`);

    const cvData = formData as CVData;
    const aiContent = await generateAIContent(orderId, cvData);

    // 5. Merge AI content into form data
    const enrichedData = mergeAIContent(cvData, aiContent);

    // Mark as AI-generated
    enrichedData.aiMetadata = {
      generated: true,
      generatedAt: aiContent.generatedAt,
      orderId: orderId,
    };

    // 6. Update order with enriched data
    await prisma.order.update({
      where: { id: orderId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form_data: enrichedData as unknown as any,
      },
    });

    console.log(`[AI Generator] Completed for Order ${orderId}`);

    return NextResponse.json({
      success: true,
      aiContent: {
        summaryGenerated: !!aiContent.professionalSummary,
        coverLetterGenerated: !!aiContent.coverLetterBody,
        bulletsOptimized: aiContent.optimizedBullets.length,
      },
    });
  } catch (error) {
    console.error("[AI Generator] Error:", error);
    return NextResponse.json(
      {
        error: "AI generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
