import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  const t = useTranslations("PrintOrders.success");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>

          <p className="text-gray-600 mb-8">{t("message")}</p>

          <Button asChild className="w-full" size="lg">
            <Link href="/print-orders">{t("backButton")}</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
