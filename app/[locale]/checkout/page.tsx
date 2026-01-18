"use client"

import Header from "@/components/landing/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/navigation"

export default function CheckoutPage() {
  const t = useTranslations("CheckoutPage")

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            
            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("orderSummary")}</CardTitle>
                    <CardDescription>{t("reviewOrder")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">{t("service")}</span>
                        <span>{t("serviceName")}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">{t("documentId")}</span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">#8829-ET</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">{t("template")}</span>
                        <span>Modern</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-xl font-bold text-teal-700">
                        <span>{t("total")}</span>
                        <span>500 ETB</span>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-teal-500 border-2">
                <CardHeader className="bg-teal-50">
                    <CardTitle className="text-teal-900">{t("payment")}</CardTitle>
                    <CardDescription className="text-teal-700">
                        {t("securePayment")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="bg-white p-4 border rounded-lg flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-auto flex items-center justify-center overflow-hidden">
                                <img src="/images/chapa-logo.png" alt="Chapa" className="h-8 object-contain" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Chapa</p>
                                <p className="text-xs text-gray-500">{t("payWithChapa")}</p>
                            </div>
                         </div>
                         <CheckCircle className="h-5 w-5 text-teal-600" />
                    </div>



// ... 

                    <Link href="/checkout/success" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-primary-foreground hover:bg-green-700 h-11 rounded-md px-8">
                        {t("payButton", { amount: "500 ETB" })}
                    </Link>
                    
                    <p className="text-xs text-center text-gray-500">
                        {t("terms")}
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
