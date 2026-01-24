"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { PrintProduct } from "@/types/print";
import { Minus, Plus, User, Phone, MapPin, Mail, Sparkles } from "lucide-react";

interface OrderFormProps {
  product: PrintProduct;
  selectedVariationId?: string | null;
}

export function OrderForm({ product, selectedVariationId }: OrderFormProps) {
  const t = useTranslations("PrintOrders.form");
  const tErrors = useTranslations("PrintOrders.errors");
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      product_id: product.id,
      variation_id: selectedVariationId ?? null,
      full_name: (formData.get("fullName") as string) ?? "",
      phone: (formData.get("phone") as string) ?? "",
      email: ((formData.get("email") as string) || "").trim() || null,
      location: (formData.get("location") as string) ?? "",
      quantity: quantity,
      notes: ((formData.get("notes") as string) || "").trim() || null,
    };

    try {
      const response = await fetch("/api/print-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Print order submit failed", await response.text());
        setError(tErrors("generic"));
        setPending(false);
        return;
      }

      router.push("/print-orders/success");
    } catch (err) {
      console.error("Print order submit error", err);
      setError(tErrors("generic"));
    } finally {
      setPending(false);
    }
  }

  // Find selected variation name for display
  const selectedVariation = product.variations?.find(v => v.id === selectedVariationId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected Item Summary */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
        <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Product</div>
            <div className="font-semibold text-gray-900">{product.name}</div>
            {selectedVariation && (
                <div className="text-sm text-teal-600 font-medium flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3" />
                    {selectedVariation.name}
                </div>
            )}
        </div>
        <div className="text-right">
             <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</div>
             <div className="font-bold text-gray-900 text-lg">
                {(product.base_price * quantity).toLocaleString()} <span className="text-sm font-normal text-gray-500">ETB</span>
             </div>
        </div>
      </div>

      {/* Quantity */}
      <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            {t("quantity")}
          </label>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => adjustQuantity(-1)}
              className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all text-gray-600 shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="w-20 text-center font-bold text-2xl text-gray-900">
              {quantity}
            </div>
            <button 
              type="button" 
              onClick={() => adjustQuantity(1)}
              className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all text-gray-600 shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
      </div>

      {/* Customer Form Fields */}
      <div className="space-y-4">
          <Input 
            id="fullName" 
            name="fullName" 
            required 
            placeholder={t("fullName")}
            startIcon={<User className="w-4 h-4" />}
            className="bg-white"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                id="phone" 
                name="phone" 
                type="tel"
                required 
                placeholder={t("phone")}
                startIcon={<Phone className="w-4 h-4" />}
                className="bg-white"
              />
              <Input 
                id="location" 
                name="location" 
                required 
                placeholder={t("location")}
                startIcon={<MapPin className="w-4 h-4" />}
                className="bg-white"
              />
          </div>

          <Input 
            id="email" 
            name="email" 
            type="email"
            placeholder={t("email")}
            startIcon={<Mail className="w-4 h-4" />}
            className="bg-white"
          />

          <Textarea 
            id="notes" 
            name="notes" 
            placeholder={t("notesPlaceholder")}
            rows={3}
            className="bg-white resize-none"
          />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Submit Action */}
      <Button
        type="submit"
        disabled={pending}
        className="w-full py-6 text-lg font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-700/20 rounded-2xl transition-all active:scale-[0.98]"
      >
        {pending ? t("submitting") : (
            <span className="flex items-center gap-2">
                Confirm Order
            </span>
        )}
      </Button>

      <p className="text-center text-xs text-gray-400 mt-2 px-4">
        {t("disclaimer")}
      </p>
    </form>
  );
}
