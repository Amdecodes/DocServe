import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");

  try {
    if (productId) {
      const product = await prisma.printProduct.findFirst({
        where: { id: productId, active: true },
        include: {
          variations: {
            select: {
              id: true,
              product_id: true,
              name: true,
              image_url: true,
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ product });
    }

    const products = await prisma.printProduct.findMany({
      where: { active: true },
      include: {
        variations: {
          select: {
            id: true,
            product_id: true,
            name: true,
            image_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("/api/print-products GET error", error);
    return NextResponse.json({ products: [] }, { status: 503 });
  }
}
