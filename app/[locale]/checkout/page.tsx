"use client"

import { useState } from "react"
import Header from "@/components/landing/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/navigation"
import { CustomerDetailsForm } from "@/components/checkout/CustomerDetailsForm"

export default function CheckoutPage() {
  const t = useTranslations("CheckoutPage")
  const [formData, setFormData] = useState({
      name: "",
      phone: ""
  })
  const [touched, setTouched] = useState({
      name: false,
      phone: false
  })

  const ethPhoneRegex = /^(09|07)\d{8}$/
  const isPhoneValid = ethPhoneRegex.test(formData.phone)
  const isNameValid = formData.name.length >= 2
  
  const isFormValid = isNameValid && isPhoneValid

  const handleBlur = (field: "name" | "phone") => {
      setTouched(prev => ({ ...prev, [field]: true }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      <div className="max-w-xl mx-auto px-4">
        
        {/* Main Payment Card */}
        <Card className="border-t-4 border-t-teal-600 shadow-lg">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>

            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Order Summary Enhanced */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-gray-900">{t("serviceName")}</p>
                            <p className="text-sm text-gray-500">{t("premiumTemplate")}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                                <CheckCircle className="h-3 w-3" />
                                <span>{t("instantDelivery")}</span>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900 text-xl">500 ETB</span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">{t("fullName")} <span className="text-red-500">*</span></label>
                        <Input 
                            id="name" 
                            placeholder={t("fullName")} // Or t("placeholders.fullName") if needed
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            onBlur={() => handleBlur("name")}
                            className={`h-11 ${touched.name && !isNameValid ? "border-red-500 focus-visible:ring-red-500 bg-red-50" : "bg-white"}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">{t("phoneNumber")} <span className="text-red-500">*</span></label>
                        <Input 
                            id="phone" 
                            type="tel"
                            placeholder="09... or 07..." 
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            onBlur={() => handleBlur("phone")}
                            className={`h-11 ${touched.phone && !isPhoneValid ? "border-red-500 focus-visible:ring-red-500 bg-red-50" : "bg-white"}`}
                        />
                        {touched.phone && !isPhoneValid && (
                            <p className="text-xs text-red-500 font-medium mt-1">{t("phoneError")}</p>
                        )}
                    </div>
                </div>

                {/* Chapa Payment Button */}
                <div className="pt-2">
                    <Button 
                        className={`w-full h-14 text-lg font-bold tracking-wide transition-all shadow-md active:scale-[0.98] ${
                            isFormValid 
                            ? "bg-green-600 hover:bg-green-500 text-white shadow-green-200 hover:shadow-green-300 ring-2 ring-green-600 ring-offset-2" 
                            : "bg-teal-900/10 text-teal-800 hover:bg-teal-900/20 border border-teal-200 opacity-100" 
                        }`}
                        asChild={isFormValid}
                        disabled={!isFormValid}
                    >
                        {isFormValid ? (
                            <Link href="/checkout/success" className="flex items-center justify-center gap-3">
                                <span>{t("payWith")}</span>
                                <img src="/images/chapa-logo.png" alt="Chapa" className="h-6 object-contain opacity-90 brightness-0 invert" style={{ filter: "brightness(0) invert(1)" }} />
                            </Link>
                        ) : (
                             <span className="flex items-center justify-center gap-2 cursor-not-allowed text-teal-800/60">
                                <span>{t("payWith")}</span>
                                <img src="/images/chapa-logo.png" alt="Chapa" className="h-5 object-contain opacity-40 grayscale" />
                            </span>
                        )}
                    </Button>
                    
                    {/* Trust Badges / Info */}
                    <div className="flex items-center justify-center gap-6 mt-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                         <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle className="h-3 w-3" />
                            <span>{t("securedBy")}</span>
                         </div>
                    </div>
                </div>

            </CardContent>
        </Card>

      </div>
    </div>
  )
}
