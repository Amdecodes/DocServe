"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

export default function PaymentTrust() {
  const t = useTranslations("Payment");

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left">
          
          <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-semibold">{t("text")}</span>
          </div>

             {/* Payment Logos */}
             <div className="h-16 bg-white rounded flex items-center justify-center p-2 border border-gray-100 shadow-sm">
                <img src="/images/chapa-logo.png" alt="Chapa" className="h-full object-contain" />
             </div>

        </div>
      </div>
    </section>
  );
}
