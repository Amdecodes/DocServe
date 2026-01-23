"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Download, Home } from "lucide-react";
import { PaymentSuccessHandler } from "@/components/checkout/PaymentSuccessHandler";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Link } from "@/lib/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );

  useEffect(() => {
    if (!orderId) {
      setStatus("success"); // fallback if accessed without ID, though unlikely
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;
    let intervalId: NodeJS.Timeout;

    const checkPayment = async () => {
      try {
        attempts++;
        const res = await fetch(`/api/payment/verify-json?orderId=${orderId}`);
        const data = await res.json();

        if (data.status === "PAID" || data.status === "success") {
          setStatus("success");
          clearInterval(intervalId);
        } else if (data.status === "failed") {
          router.push(`/checkout/failed?orderId=${orderId}`);
          clearInterval(intervalId);
        } else if (attempts >= maxAttempts) {
          // Timeout: stop polling, let them try manual download
          setStatus("success");
          clearInterval(intervalId);
        }
      } catch (e) {
        console.error("Verification error", e);
      }
    };

    intervalId = setInterval(checkPayment, 2000);
    checkPayment();

    return () => clearInterval(intervalId);
  }, [orderId, router]);

  useEffect(() => {
    if (status === "success" && orderId) {
      // Clear Storage
      localStorage.removeItem("cv-form");
      localStorage.removeItem("order-draft");
      localStorage.removeItem("paperless.personal");
      localStorage.removeItem("paperless.education");
      localStorage.removeItem("paperless.experience");
      localStorage.removeItem("paperless.orderId");

      // Auto Download (Only Once)
      const key = `pdf-downloaded-${orderId}`;
      const alreadyDownloaded = sessionStorage.getItem(key);

      if (!alreadyDownloaded) {
        const link = document.createElement("a");
        link.href = `/api/pdf/download?orderId=${orderId}`;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        sessionStorage.setItem(key, "true");
      }
    }
  }, [status, orderId]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Confirming your transaction...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we secure your order.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-6 mb-16">
        <PaymentSuccessHandler />

        <div className="rounded-full bg-green-100 p-3 mb-2">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Payment Successful 🎉
        </h1>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() =>
              window.open(`/api/pdf/download?orderId=${orderId}`, "_blank")
            }
          >
            <Download className="w-4 h-4" />
            Download PDF Again
          </Button>

          <Button variant="outline" size="lg" className="w-full gap-2" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
