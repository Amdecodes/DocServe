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
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setStatus("success");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10; // Increased attempts
    const intervalHandle: { current: NodeJS.Timeout | null } = {
      current: null,
    };

    const checkPayment = async () => {
      try {
        attempts++;
        const res = await fetch(`/api/payment/verify-json?orderId=${orderId}`);
        const data = await res.json();

        if (data.status === "PAID" || data.status === "success") {
          setStatus("success");
          if (data.expiresAt) {
            setExpiresAt(new Date(data.expiresAt));
          } else if (data.paidAt) {
            // Fallback if expiresAt not yet set but we know paidAt: 6 hours
            setExpiresAt(
              new Date(new Date(data.paidAt).getTime() + 6 * 60 * 60 * 1000),
            );
          }
          if (intervalHandle.current) clearInterval(intervalHandle.current);
        } else if (data.status === "failed") {
          router.push(`/checkout/failed?orderId=${orderId}`);
          if (intervalHandle.current) clearInterval(intervalHandle.current);
        } else if (attempts >= maxAttempts) {
          setStatus("success"); // Give benefit of doubt, download link will enforce checks
          if (intervalHandle.current) clearInterval(intervalHandle.current);
        }
      } catch (e) {
        console.error("Verification error", e);
      }
    };

    intervalHandle.current = setInterval(checkPayment, 2000);
    checkPayment();

    return () => {
      if (intervalHandle.current) clearInterval(intervalHandle.current);
    };
  }, [orderId, router]);

  // Countdown Logic
  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiresAt.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

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
        <main className="grow flex flex-col items-center justify-center p-4">
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
      <main className="grow flex flex-col items-center justify-center p-4 space-y-6 mb-16">
        <PaymentSuccessHandler />

        <div className="rounded-full bg-green-100 p-3 mb-2">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Payment Successful 🎉
        </h1>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {!isExpired ? (
            <>
              <div className="text-center mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Download Available For
                </p>
                <p className="text-2xl font-bold text-blue-800 font-mono">
                  {timeLeft || "..."}
                </p>
              </div>

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
            </>
          ) : (
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-red-600 font-bold mb-2">
                Download Period Expired
              </p>
              <p className="text-sm text-red-500 mb-4">
                Your 6-hour download window has closed. Need a copy?
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Create New Resume</Link>
              </Button>
            </div>
          )}

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
