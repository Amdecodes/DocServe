import Image from "next/image";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PrintProduct } from "@/types/print";

interface ProductCardProps {
  product: PrintProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("PrintOrders");

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
        {/* Placeholder if image loads fail - handled by Next.js Image usually, but we can style the bg */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
          <span className="text-4xl">🖼️</span>
        </div>
        {product.image_url && (
          <Image
            src={product.image_url ?? ""}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">
          {product.description || t("subtitle")}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
          <div className="text-sm">
            <span className="text-gray-500 block text-xs">
              {t("basePrice")}
            </span>
            <span className="font-semibold text-teal-700">
              {product.base_price} ETB
            </span>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm shrink-0"
          >
            <Link href={`/print-orders/${product.id}`}>{t("orderNow")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
