"use client"

import { useCV } from "@/components/cv/CVContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export function Step5_Review() {
  const { cvData, updateCVData } = useCV()
  const t = useTranslations("ReviewStep")

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target
     updateCVData("personalInfo", { [name]: value })
  }

  return (
    <div className="space-y-6">
        <div className="text-center py-4">
            <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold">{t("title")}</h2>
            <p className="text-gray-600 max-w-md mx-auto">
                {t("subtitle")}
            </p>
        </div>


        
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-lg text-sm">
             <strong>{t("noteLabel")}</strong> {t("noteText")}
        </div>
        
        <div className="flex justify-end pt-4">
             {/* The button is in page.tsx, so we don't need it here, but page.tsx needs updates too */}
        </div>
    </div>
  )
}
