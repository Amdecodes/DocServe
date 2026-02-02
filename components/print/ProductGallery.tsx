"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PrintProduct } from "@/types/print";

interface ProductGalleryProps {
  product: PrintProduct;
  selectedVariationId?: string | null;
}

export function ProductGallery({
  product,
  selectedVariationId,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(product.image_url);
  const [prevVariationId, setPrevVariationId] = useState(selectedVariationId);
  const [prevProductId, setPrevProductId] = useState(product.id);

  // Sync active image when variation or product changes (derived state)
  // This pattern (adjusting state during rendering) is recommended over useEffect for prop-to-state sync
  if (selectedVariationId !== prevVariationId || product.id !== prevProductId) {
    setPrevVariationId(selectedVariationId);
    setPrevProductId(product.id);

    const variation = product.variations?.find(
      (v) => v.id === selectedVariationId,
    );
    if (variation?.image_url) {
      setActiveImage(variation.image_url);
    } else {
      setActiveImage(product.image_url);
    }
  }

  const images = [
    { id: "main", src: product.image_url, alt: product.name },
    ...(product.variations?.map((v) => ({
      id: v.id,
      src: v.image_url,
      alt: v.name,
    })) || []),
  ].filter((img) => img.src); // Filter out empty images

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails (Left on desktop, Bottom on mobile) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-20 shrink-0 scrollbar-hide">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setActiveImage(img.src)}
            className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
              activeImage === img.src
                ? "border-teal-600 ring-1 ring-teal-600"
                : "border-gray-200 hover:border-gray-300",
            )}
          >
            {img.src && (
              <Image
                src={img.src}
                alt={img.alt || "Product thumbnail"}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square md:aspect-auto md:h-125 grow rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
      </div>
    </div>
  );
}
