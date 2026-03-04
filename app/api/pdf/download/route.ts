import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return new Response("Missing orderId", { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return new Response(`Order ${orderId} not found in database.`, {
      status: 404,
    });
  }

  if (order.status !== "PAID") {
    return new Response(
      `Order status is "${order.status}", not PAID. Payment may still be pending.`,
      { status: 403 },
    );
  }

  const downloadName = order.service_type.startsWith("agreement:")
    ? "Agreement.pdf"
    : "CV.pdf";

  let fileBuffer: ArrayBuffer | null = null;
  let diagnostics: string[] = [];

  // 1. Try fetching existing stored PDF
  if (order.pdf_url) {
    diagnostics.push(`Stored pdf_url found: ${order.pdf_url}`);
    try {
      const fileResponse = await fetch(order.pdf_url);
      if (fileResponse.ok) {
        fileBuffer = await fileResponse.arrayBuffer();
        diagnostics.push("Fetched stored PDF successfully.");
      } else {
        diagnostics.push(
          `Stored PDF fetch returned HTTP ${fileResponse.status}.`,
        );
      }
    } catch (e) {
      diagnostics.push(`Stored PDF fetch threw: ${String(e)}`);
    }
  } else {
    diagnostics.push(
      "No pdf_url in DB — PDF was never generated (background task may have failed).",
    );
  }

  // 2. Fallback: regenerate
  if (!fileBuffer) {
    diagnostics.push("Attempting on-the-fly PDF regeneration...");
    try {
      const { processOrderPdf } = await import("@/lib/pdf/process-order");
      const result = await processOrderPdf(
        order.id,
        order.form_data,
        order.service_type,
      );

      if (result?.pdfUrl) {
        diagnostics.push(`PDF regenerated. URL: ${result.pdfUrl}`);
        const newResponse = await fetch(result.pdfUrl);
        if (newResponse.ok) {
          fileBuffer = await newResponse.arrayBuffer();

          await prisma.order.update({
            where: { id: orderId },
            data: { pdf_url: result.pdfUrl, expires_at: result.expiresAt },
          });
        } else {
          diagnostics.push(
            `Regenerated PDF URL fetch returned HTTP ${newResponse.status}.`,
          );
        }
      } else {
        diagnostics.push("processOrderPdf returned null/no URL.");
      }
    } catch (e) {
      diagnostics.push(`PDF regeneration threw: ${String(e)}`);
      console.error("[Download] PDF regeneration error:", e);
    }
  }

  if (fileBuffer) {
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadName}"`,
      },
    });
  }

  // Return detailed diagnostics so the failure reason is visible without needing Vercel logs
  const errorBody = [
    "PDF generation failed. Diagnostics:",
    ...diagnostics,
  ].join("\n");
  console.error("[Download] Final failure:", errorBody);
  return new Response(errorBody, { status: 404 });
}
