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

  // 1. Always generate a fresh Signed URL with "download" disposition
  // We do not rely on the cached DB URL here because we want to enforce the
  // "Content-Disposition: attachment" header which is now default in getSignedUrl()
  // and might not be present in older cached URLs.
  try {
    let freshLink;
    const downloadName = order.service_type.startsWith("agreement:")
      ? "Agreement.pdf"
      : "CV.pdf";

    // 1. Try generic document path (New standard)
    freshLink = await getSignedUrl(
      `orders/${orderId}/document.pdf`,
      downloadName,
    );

    // 2. Fallback to temp path (for files uploaded before fix)
    if (!freshLink) {
      freshLink = await getSignedUrl(
        `temp/orders/${orderId}/document.pdf`,
        downloadName,
      );
    }

    // 3. Fallback to legacy path (Old CVs)
    if (!freshLink) {
      freshLink = await getSignedUrl(`orders/${orderId}/cv.pdf`, downloadName);
    }
    
    // 4. Fallback to temp legacy path
    if (!freshLink) {
      freshLink = await getSignedUrl(`temp/orders/${orderId}/cv.pdf`, downloadName);
    }

    if (freshLink) {
      // Update DB with the latest valid link (optional but good for caching elsewhere)
      await prisma.order.update({
        where: { id: orderId },
        data: { pdf_url: freshLink.signedUrl, expires_at: freshLink.expiresAt },
      });
      return NextResponse.redirect(freshLink.signedUrl);
    }
  } catch (e) {
    console.log("Could not generate fresh link", e);
  }

  // 2. Fallback (if generating failed but we have a DB link?) - unlikely to help if generator failed.
  // ...

  return new Response("File not found or could not be accessed.", {
    status: 404,
  });
}
