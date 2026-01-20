import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Call Chapa VERIFY API
  const res = await fetch(
    `https://api.chapa.co/v1/transaction/verify/${order.tx_ref}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
      }
    }
  );

  const data = await res.json();

  if (data.status === "success") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" }
    });
  }

  return NextResponse.json({
    orderId,
    status: data.status === "success" ? "PAID" : "PENDING",
    chapa: data
  });
}
