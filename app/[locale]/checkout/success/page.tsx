"use client";

import Header from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

import { PaymentSuccessHandler } from "@/components/checkout/PaymentSuccessHandler";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const t = useTranslations("PaymentSuccess");
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsVerifying(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 5; // Poll for 10 seconds (5 * 2s)

    const pollVerification = async () => {
      try {
        attempts++;
        const res = await fetch(`/api/payment/verify-json?orderId=${orderId}`);
        const data = await res.json();

        if (data.status === "PAID" || data.status === "success") {
          setIsVerifying(false); // Success!
          return;
        }

        // If explicitly failed, stop and redirect
        if (data.status !== "PENDING" && data.status !== "PAID") {
          router.push(`/checkout/failed?orderId=${orderId}`);
          return;
        }

        // If still PENDING, retry or finish
        if (attempts < maxAttempts) {
          setTimeout(pollVerification, 2000); // Retry in 2s
        } else {
          // Timeout reached: Stop loading, but don't force fail.
          // Just show the page - the webhook might arrive later.
          // Or allow user to manually "Check Again" via UI.
          setIsVerifying(false);
        }
      } catch (e) {
        console.error("Verification check failed", e);
        setIsVerifying(false);
      }
    };

    pollVerification();
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PaymentSuccessHandler />
      <Header />

      <div className="max-w-md mx-auto px-4 mt-12 text-center">
        <div className="mb-6 flex justify-center">
          {isVerifying ? (
            <div className="h-24 w-24 bg-teal-50 rounded-full flex items-center justify-center relative">
              <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            </div>
          ) : (
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center relative">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {isVerifying ? "Verifying Payment..." : t("title")}
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <p className="text-gray-500 text-sm mb-1">{t("orderId")}</p>
            <p className="text-xl font-mono font-bold text-gray-800 tracking-wider">
              {orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : "#8829-ET"}
            </p>
            <hr className="my-4" />

            {/* Show different message if we timed out but didn't fail explicitly */}
            <p className="text-gray-600 mb-4">
              {isVerifying ? "Confirming your transaction..." : t("message")}
            </p>

            <Button className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg gap-2">
              <Download className="h-5 w-5" /> {t("download")}
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            {t("needChanges")}{" "}
            <a href="#" className="text-teal-600 underline">
              {t("contactUs")}
            </a>{" "}
            {t("withOrderId")}
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              {t("returnHome")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
