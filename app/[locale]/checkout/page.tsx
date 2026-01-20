"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Loader2, ShieldCheck, ShoppingBag, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const t = useTranslations("CheckoutPage");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Order state
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(true);

  // Helper function to gather all CV data from localStorage
  const gatherCVFormData = () => {
    if (typeof window === "undefined") return null;

    try {
      return {
        personal: JSON.parse(
          localStorage.getItem("paperless.personal") || "{}",
        ),
        education: JSON.parse(
          localStorage.getItem("paperless.education") || "[]",
        ),
        experience: JSON.parse(
          localStorage.getItem("paperless.experience") || "[]",
        ),
        skills: JSON.parse(localStorage.getItem("paperless.skills") || "[]"),
      };
    } catch (e) {
      console.error("Failed to gather CV data:", e);
      return null;
    }
  };

  // Create Order on Mount or Retrieve from Storage
  useEffect(() => {
    const initOrder = async () => {
      // 1. Try to get existing order from storage
      const storedOrderId = localStorage.getItem("paperless.orderId");

      if (storedOrderId) {
        setOrderId(storedOrderId);
        setIsCreatingOrder(false);
        return;
      }

      // 2. Create new if none exists
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_type: "premium_resume",
            form_data: gatherCVFormData(), // Include CV data
          }),
        });

        if (!res.ok) throw new Error("Failed to create order");

        const data = await res.json();
        setOrderId(data.orderId);

        // Persist
        localStorage.setItem("paperless.orderId", data.orderId);
      } catch (error) {
        console.error("Error creating draft order:", error);
        setPaymentError("Failed to initialize order. Please refresh.");
      } finally {
        setIsCreatingOrder(false);
      }
    };

    initOrder();
  }, []);

  const handlePay = async () => {
    if (!orderId) return;

    setIsProcessing(true);
    setPaymentError(null);
    try {
      // Initialize Chapa Payment
      const initPaymentRes = await fetch("/api/payment/chapa/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!initPaymentRes.ok) {
        const err = await initPaymentRes.json();
        throw new Error(err.error || "Payment initialization failed");
      }

      const { checkout_url } = await initPaymentRes.json();

      // Redirect
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Payment processing failed. Please try again.";
      setPaymentError(message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="container max-w-lg mx-auto px-4 pt-12 pb-24">
        <Card className="border-0 shadow-xl ring-1 ring-gray-200 overflow-hidden bg-white">
          {/* Header Section */}
          <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600"></div>

            <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <ShoppingBag className="w-6 h-6 text-teal-300" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {t("title", { defaultMessage: "Complete Your Order" })}
            </h1>
            <p className="text-slate-400 text-sm">Secure Payment Gateway</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-900">
                    Premium CV Service
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {/* <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                      PD
                    </span> */}
                    <span>Professional Design</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-slate-900">
                    500{" "}
                    <span className="text-sm font-medium text-slate-500">
                      ETB
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-slate-500 text-xs uppercase tracking-widest mb-2 font-medium">
                  Order Reference
                </span>
                <span className="font-mono text-3xl font-bold text-slate-900 tracking-tight block">
                  {isCreatingOrder ? (
                    <Loader2 className="h-8 w-8 animate-spin inline text-teal-600" />
                  ) : (
                    `#${orderId?.slice(0, 8).toUpperCase()}`
                  )}
                </span>
              </div>
            </div>

            {/* Features List */}
            <ul className="space-y-3 pt-2">
              {["Instant PDF Download", "Premium Templates Access"].map(
                (feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ),
              )}
            </ul>

            {/* Payment Action */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Button
                onClick={handlePay}
                disabled={isProcessing || isCreatingOrder || !orderId}
                className="w-full h-14 bg-[#2D2D2D] hover:bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
              >
                {/* Abstract sheen effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-semibold text-lg">Pay with</span>
                    <div className="h-6 w-auto relative flex items-center">
                      <Image
                        src="/images/chapa-logo.png"
                        alt="Chapa"
                        width={80}
                        height={24}
                        className="h-6 w-auto object-contain brightness-0 invert"
                      />
                    </div>
                  </div>
                )}
              </Button>

              {paymentError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center animate-in fade-in">
                  {paymentError}
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secured by Chapa Payment Gateway</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
