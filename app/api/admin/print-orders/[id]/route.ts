import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { PrintOrderStatus } from "@prisma/client";

const statusSchema = z.enum(["pending", "contacted", "completed", "cancelled"]);

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  try {
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!user || !user.emailAddresses.some(e => e.emailAddress === adminEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = statusSchema.safeParse(body.status);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await prisma.printOrder.update({
      where: { id: params.id },
      data: { status: parsed.data as PrintOrderStatus },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`/api/admin/print-orders/${params.id} PATCH error`, error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
