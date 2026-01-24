import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/print/ProductCard";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { PrintProduct } from "@/types/print";

interface PageProps {
  params: { locale: string };
}

export default async function PrintOrdersPage({
  params,
}: {
  params: Promise<PageProps["params"]>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrintOrders" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/print-products`, {
    cache: "no-store",
  });

  let products: PrintProduct[] = [];
  if (response.ok) {
    const json = await response.json();
    products = json.products ?? [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="grow py-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* 2.1 Header */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t("pageTitle")}
            </h1>
            <p className="text-gray-600 text-lg">{t("subtitle")}</p>
          </div>

          {/* 2.2 Product Grid */}
          {products.length === 0 ? (
            <div className="text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl p-10">
              No products available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
