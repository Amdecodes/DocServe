import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import prisma from "@/lib/prisma";
import { CvPdf } from "@/lib/pdf/templates/cv-basic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order || order.status !== "PAID") {
    return NextResponse.json({ error: "Payment required" }, { status: 403 });
  }

  const stream = await renderToStream(
    <CvPdf data={order.form_data} />
  );

  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=cv.pdf"
    }
  });
}
