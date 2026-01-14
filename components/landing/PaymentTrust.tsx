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

          <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
             {/* Payment Logos Placeholders */}
             <div className="h-8 w-24 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">Chapa</div>
             <div className="h-8 w-24 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">Telebirr</div>
             <div className="h-8 w-24 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">CBE</div>
          </div>

        </div>
      </div>
    </section>
  );
}
