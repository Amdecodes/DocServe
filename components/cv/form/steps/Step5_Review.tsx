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

        <Card className="border-teal-500 border-2">
            <CardHeader className="bg-teal-50">
                <CardTitle className="text-teal-900">{t("cardTitle")}</CardTitle>
                <CardDescription className="text-teal-700">
                    {t("cardDescription")}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">{t("firstName")}</label>
                        <Input 
                            id="firstName" 
                            name="firstName" 
                            value={cvData.personalInfo.firstName} 
                            onChange={handleCustomerChange}
                            placeholder={t("firstName")}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">{t("lastName")}</label>
                        <Input 
                            id="lastName" 
                            name="lastName" 
                            value={cvData.personalInfo.lastName} 
                            onChange={handleCustomerChange}
                            placeholder={t("lastName")}
                            required
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">{t("phone")}</label>
                    <Input 
                        id="phone" 
                        name="phone" 
                        type="tel"
                        value={cvData.personalInfo.phone} 
                        onChange={handleCustomerChange} 
                        placeholder="+251..." 
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
                    <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={cvData.personalInfo.email} 
                        onChange={handleCustomerChange} 
                        placeholder="example@mail.com" 
                    />
                </div>
            </CardContent>
        </Card>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-lg text-sm">
             <strong>{t("noteLabel")}</strong> {t("noteText")}
        </div>
        
        <div className="flex justify-end pt-4">
             {/* The button is in page.tsx, so we don't need it here, but page.tsx needs updates too */}
        </div>
    </div>
  )
}
