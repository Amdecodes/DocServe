"use client"

import Header from "@/components/landing/Header"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/navigation"

import { PaymentSuccessHandler } from "@/components/checkout/PaymentSuccessHandler"

export default function PaymentSuccessPage() {
  const t = useTranslations("PaymentSuccess")

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <PaymentSuccessHandler />
      <Header />
      
      <div className="max-w-md mx-auto px-4 mt-12 text-center">
         <div className="mb-6 flex justify-center">
             <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center relative">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        d="M5 13l4 4L19 7" 
                    />
                </svg>
             </div>
         </div>
         
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
         >
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{t("title")}</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <p className="text-gray-500 text-sm mb-1">{t("orderId")}</p>
                <p className="text-xl font-mono font-bold text-gray-800 tracking-wider">#8829-ET</p>
                <hr className="my-4" />
                <p className="text-gray-600 mb-4">
                    {t("message")}
                </p>
                
                <Button className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg gap-2">
                    <Download className="h-5 w-5" /> {t("download")}
                </Button>
            </div>
            
            <p className="text-sm text-gray-500">
                {t("needChanges")} <a href="#" className="text-teal-600 underline">{t("contactUs")}</a> {t("withOrderId")}
            </p>
            

            <div className="mt-8">
                <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">{t("returnHome")}</Link>
            </div>
         </motion.div>
      </div>
    </div>
  )
}
