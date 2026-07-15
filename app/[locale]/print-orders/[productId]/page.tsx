import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { PrintProduct } from "@/types/print";
import { ProductPageContainer } from "@/components/print/ProductPageContainer";

interface PageProps {
  params: {
    locale: string;
    productId: string;
  };
}

export default async function PrintOrderProductPage({
  params,
}: {
  params: Promise<PageProps["params"]>;
}) {
  const { productId } = await params;

  const productData = await prisma.printProduct.findFirst({
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

  if (!productData) {
    notFound();
  }

  const product: PrintProduct = {
    ...productData,
    base_price: Number(productData.base_price),
    created_at: productData.created_at.toISOString(),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />

      <main className="grow py-8 px-4 md:px-8">
        <ProductPageContainer product={product} />
      </main>

      <Footer />
    </div>
  );
}
