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

  // STRICT TIME CHECK: If payment was > 6 hours ago, deny access permanently.
  // This ensures that even if the cleanup job hasn't run yet, the file is inaccessible.
  if (order.paid_at) {
    const hoursSincePaid =
      (Date.now() - new Date(order.paid_at).getTime()) / (1000 * 60 * 60);
    if (hoursSincePaid > 6) {
      return new Response("This download link has expired (6 hour limit).", {
        status: 410,
      });
    }
  }

  // 1. Always generate a fresh Signed URL with "download" disposition
  // We do not rely on the cached DB URL here because we want to enforce the
  // "Content-Disposition: attachment" header which is now default in getSignedUrl()
  // and might not be present in older cached URLs.
  try {
    const predictablePath = `orders/${orderId}/cv.pdf`;
    const freshLink = await getSignedUrl(predictablePath);

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
