"use client";

import { useState } from "react";
import { Link } from "@/lib/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import { PrintProduct } from "@/types/print";
import { ProductGallery } from "@/components/print/ProductGallery";
import { OrderForm } from "@/components/print/OrderForm";
import { VariationSelector } from "@/components/print/VariationSelector";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

interface ProductPageContainerProps {
  product: PrintProduct;
}

export function ProductPageContainer({ product }: ProductPageContainerProps) {
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6">
        <Link
          href="/print-orders"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
             <ProductGallery 
                product={product} 
                selectedVariationId={selectedVariationId ?? undefined}
             />
          </div>
          
          {/* Trust Badges / Extra Info visible on Desktop */}
          <div className="hidden lg:grid grid-cols-3 gap-4">
             <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-blue-900">Quality Guaranteed</div>
             </div>
             <div className="bg-amber-50 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                   <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-amber-900">Vibrant Colors</div>
             </div>
             <div className="bg-teal-50 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                   <Truck className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-teal-900">Fast Delivery</div>
             </div>
          </div>
        </div>

        {/* Right Column: Key Info & Actions */}
        <div className="lg:col-span-5">
           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 md:p-8 space-y-8">
                  {/* Header Info */}
                  <div className="border-b border-gray-100 pb-6">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h1>
                      <div className="flex items-center justify-between mb-4">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-sm font-medium text-teal-700">Available Now</span>
                         </div>
                         <div className="text-2xl font-bold text-gray-900">
                            {product.base_price} <span className="text-sm font-normal text-gray-500">ETB</span>
                         </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                  </div>

                  {/* Variation Selector (Always Visible) */}
                  <VariationSelector 
                    product={product} 
                    selectedVariationId={selectedVariationId} 
                    onSelect={setSelectedVariationId} 
                  />
                  
                  {/* Order Button */}
                  <div className="pt-2">
                      <Button
                        onClick={() => setIsOrderModalOpen(true)}
                        className="w-full py-6 text-lg font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-700/20 rounded-2xl transition-all active:scale-[0.98] group"
                      >
                         <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                         Order Now
                      </Button>
                      <p className="text-center text-xs text-gray-400 mt-3">
                         No payment required today. Submit order to get started.
                      </p>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Order Modal */}
      <Modal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)}
        title="Complete Your Order"
      >
         <OrderForm product={product} selectedVariationId={selectedVariationId} />
      </Modal>
    </div>
  );
}
