import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { PrintProduct } from "@/types/print";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PrintCatalog } from "@/components/print/PrintCatalog";

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

  const productsData = await prisma.printProduct.findMany({
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

  const products: PrintProduct[] = productsData.map((p) => ({
    ...p,
    base_price: Number(p.base_price),
    created_at: p.created_at.toISOString(),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="grow py-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              asChild
              className="pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Link href="/services" className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                {t("success.backButton")}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t("pageTitle")}
            </h1>
            <p className="text-gray-600 text-lg">{t("subtitle")}</p>
          </div>

          {/* Catalog UI */}
          <PrintCatalog products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
