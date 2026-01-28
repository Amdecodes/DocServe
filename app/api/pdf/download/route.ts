import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrl } from "@/lib/upload";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return new Response("Missing orderId", { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.status !== "PAID") {
    return new Response("Unauthorized", { status: 403 });
  }

  // No time check needed. If file exists in DB/Storage (it should, as we stopped auto-cleanup), allow download.
  // We generate a fresh link every time.

  // 1. Determine target URL
  let targetUrl = order.pdf_url;
  const downloadName = order.service_type.startsWith("agreement:")
    ? "Agreement.pdf"
    : "CV.pdf";

  let fileBuffer: ArrayBuffer | null = null;

  // 2. Try fetching existing PDF if URL is present
  if (targetUrl) {
    try {
      const fileResponse = await fetch(targetUrl);
      if (fileResponse.ok) {
        fileBuffer = await fileResponse.arrayBuffer();
      } else {
        console.warn(`[Download] Stored PDF URL returned status ${fileResponse.status}. Attempting regeneration.`);
      }
    } catch (e) {
      console.error("[Download] Error fetching stored PDF:", e);
    }
  }

  // 3. Fallback: Regenerate if fetch failed or URL was missing
  if (!fileBuffer) {
    try {
      console.log(`[Download] Regenerating PDF for Order ${orderId}...`);
      const { processOrderPdf } = await import("@/lib/pdf/process-order");
      
      const result = await processOrderPdf(
        order.id,
        order.form_data,
        order.service_type
      );

      if (result?.pdfUrl) {
        // Fetch the newly generated PDF
        const newResponse = await fetch(result.pdfUrl);
        if (newResponse.ok) {
          fileBuffer = await newResponse.arrayBuffer();
          
          // Update order status with new URL to fix future downloads
          await prisma.order.update({
            where: { id: orderId },
            data: { 
              pdf_url: result.pdfUrl,
              expires_at: result.expiresAt
            },
          });
        }
      }
    } catch (e) {
      console.error("[Download] PDF regeneration failed:", e);
    }
  }

  // 4. Return the file if we have a buffer
  if (fileBuffer) {
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadName}"`,
      },
    });
  }

  return new Response("File not found or could not be generated.", {
    status: 404,
  });
}

