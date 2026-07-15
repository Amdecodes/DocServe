"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { PrintProduct } from "@/types/print";
import { cn } from "@/lib/utils";

interface VariationSelectorProps {
  product: PrintProduct;
  selectedVariationId: string | null;
  onSelect: (id: string | null) => void;
}

export function VariationSelector({
  product,
  selectedVariationId,
  onSelect,
}: VariationSelectorProps) {
  if (!product.variations || product.variations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Select Design</h3>
        {selectedVariationId && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Clear Selection
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {product.variations.map((variation) => (
          <div
            key={variation.id}
            onClick={() =>
              onSelect(
                selectedVariationId === variation.id ? null : variation.id,
              )
            }
            className={cn(
              "relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 group aspect-square",
              selectedVariationId === variation.id
                ? "border-teal-600 ring-2 ring-teal-600/20 bg-teal-50 shadow-md transform scale-[1.02]"
                : "border-gray-100 hover:border-teal-200 hover:shadow-sm bg-white",
            )}
          >
            <div className="absolute inset-0 bg-gray-50">
              {variation.image_url ? (
                <Image
                  src={variation.image_url}
                  alt={variation.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                  No Img
                </div>
              )}
            </div>

            {/* Overlay Gradient for Text */}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2 pt-6">
              <div className="text-white text-[10px] sm:text-xs font-semibold truncate text-center leading-tight">
                {variation.name}
              </div>
            </div>

            {selectedVariationId === variation.id && (
              <div className="absolute top-2 right-2 bg-teal-600 text-white rounded-full p-1 shadow-lg animate-in zoom-in spin-in-12">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
