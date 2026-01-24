import { notFound } from "next/navigation";
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Fetch product data from our API (which includes variations now)
  const response = await fetch(
    `${baseUrl}/api/print-products?id=${productId}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    notFound();
  }

  const { product }: { product: PrintProduct } = await response.json();

  if (!product) {
    notFound();
  }

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
