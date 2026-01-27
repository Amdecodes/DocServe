import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!user || !user.emailAddresses.some(e => e.emailAddress === adminEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const orders = await prisma.printOrder.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("/api/admin/print-orders GET error", error);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 },
    );
  }
}
