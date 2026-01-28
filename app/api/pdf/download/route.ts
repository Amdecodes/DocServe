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

  // 1. Use the stored PDF URL if available (This is the correct path for UploadThing)
  let targetUrl = order.pdf_url;
  let downloadName = order.service_type.startsWith("agreement:")
    ? "Agreement.pdf"
    : "CV.pdf";

  // 2. Fallbacks for legacy files or failed updates
  if (!targetUrl) {
    try {
      // Try generic document path (New standard)
      const freshLink = await getSignedUrl(
        `orders/${orderId}/document.pdf`,
        downloadName,
      );
      if (freshLink) targetUrl = freshLink.signedUrl;
      
      // Fallback: Check older paths if needed, but for now we try the main one.
      // If we really need legacy support we can restore the other checks here.
    } catch (e) {
      console.log("Could not generate fresh link", e);
    }
  }

  if (targetUrl) {
    try {
      // Proxy the file to enforce download
      const fileResponse = await fetch(targetUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file from storage: ${fileResponse.statusText}`);
      }
      const fileBuffer = await fileResponse.arrayBuffer();

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${downloadName}"`,
        },
      });
    } catch (e) {
      console.error("Proxy download failed", e);
      return new NextResponse("Failed to download file", { status: 500 });
    }
  }

  // 2. Fallback (if generating failed but we have a DB link?) - unlikely to help if generator failed.
  // ...

  return new Response("File not found or could not be accessed.", {
    status: 404,
  });
}
