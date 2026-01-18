"use client"

import { useState } from "react"
import Header from "@/components/landing/Header"
import { Button } from "@/components/ui/button"
import { XCircle, RefreshCcw, Edit, HelpCircle, Loader2, ShieldCheck, ArrowRightCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

type RetryStatus = 'idle' | 'verifying' | 'connecting' | 'redirecting'

import { Link, useRouter } from "@/lib/navigation"



export default function PaymentFailedPage() {
  const [retryStatus, setRetryStatus] = useState<RetryStatus>('idle')
  const t = useTranslations("PaymentFailed")
  const router = useRouter()

  const handleRetry = () => {
    setRetryStatus('verifying')
    
    // Simulate Verifying
    setTimeout(() => {
        setRetryStatus('connecting')
        // Simulate Connecting
        setTimeout(() => {
            setRetryStatus('redirecting')
            // Simulate Redirect
            setTimeout(() => {
                router.push("/checkout") // Redirect logic
            }, 800)
        }, 1500)
    }, 1500)
  }

  // ...



  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 relative overflow-hidden">
      <Header />
      
      <div className="max-w-md mx-auto px-4 mt-12 text-center">
         <div className="mb-6 flex justify-center">
             <XCircle className="h-24 w-24 text-red-500" />
         </div>
         
         <h1 className="text-3xl font-bold mb-4 text-gray-900">{t("title")}</h1>
         
         <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 mb-8">
             <p className="text-gray-500 text-sm mb-1">{t("orderId")}</p>
             <p className="text-xl font-mono font-bold text-gray-800 tracking-wider mb-4">#8829-ET</p>
             
             <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-6">
                 {t("message")}
             </div>
             
             <div className="space-y-3">
                <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 gap-2 relative overflow-hidden" 
                    onClick={handleRetry}
                    disabled={retryStatus !== 'idle'}
                >
                    {retryStatus === 'idle' ? (
                        <>
                            <RefreshCcw className="h-4 w-4" /> {t("retry")}
                        </>
                    ) : (
                         <>
                            <Loader2 className="h-4 w-4 animate-spin" /> {t("processing")}
                         </>
                    )}
                </Button>
                
                <Link href="/form/cv" className="block w-full">
                    <Button variant="outline" className="w-full gap-2">
                        <Edit className="h-4 w-4" /> {t("changeDetails")}
                    </Button>
                </Link>
             </div>
         </div>
         
         <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
             <HelpCircle className="h-4 w-4" />
             <span>{t("trouble")} <a href="#" className="text-teal-600 underline">{t("contactSupport")}</a></span>
         </div>
      </div>

      {/* Full Screen Overlay for Retry Animation */}
      <AnimatePresence>
        {retryStatus !== 'idle' && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
            >
                {retryStatus === 'verifying' && (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <Loader2 className="h-16 w-16 text-teal-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">{t("verifyingTitle")}</h2>
                        <p className="text-gray-500 mt-2">{t("verifyingText")}</p>
                    </motion.div>
                )}

                {retryStatus === 'connecting' && (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <ShieldCheck className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
                        <h2 className="text-2xl font-bold text-gray-800">{t("connectingTitle")}</h2>
                        <p className="text-gray-500 mt-2">{t("connectingText")}</p>
                    </motion.div>
                )}

                 {retryStatus === 'redirecting' && (
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <ArrowRightCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">{t("redirectingTitle")}</h2>
                        <p className="text-gray-500 mt-2">{t("redirectingText")}</p>
                    </motion.div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
