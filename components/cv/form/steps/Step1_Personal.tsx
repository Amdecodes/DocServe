"use client"

import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { useCV } from "@/components/cv/CVContext"
import { useTranslations } from "next-intl"

export function Step1_Personal() {
  const { cvData, updateCVData } = useCV()
  const t = useTranslations("PersonalInfo")

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateCVData("personalInfo", { [name]: value })
  }

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCVData("summary", e.target.value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden relative">
                    {cvData.personalInfo.photo ? (
                        <img src={cvData.personalInfo.photo} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-gray-400 text-xs text-center p-2">{t("noPhoto")}</span>
                    )}
                </div>
                <div className="flex-1">
                    <label htmlFor="photo" className="text-sm font-medium block mb-1">{t("photoLabel")}</label>
                    <Input 
                        id="photo" 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                    updateCVData("personalInfo", { photo: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                            }
                        }}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t("photoHint")}</p>
                </div>
            </div>
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">{t("firstName")}</label>
            <Input id="firstName" name="firstName" value={cvData.personalInfo.firstName} onChange={handlePersonalChange} placeholder={t("placeholders.firstName")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">{t("lastName")}</label>
            <Input id="lastName" name="lastName" value={cvData.personalInfo.lastName} onChange={handlePersonalChange} placeholder={t("placeholders.lastName")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="jobTitle" className="text-sm font-medium">{t("jobTitle")}</label>
            <Input id="jobTitle" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalChange} placeholder={t("placeholders.jobTitle")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
            <Input id="email" name="email" type="email" value={cvData.personalInfo.email} onChange={handlePersonalChange} placeholder={t("placeholders.email")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">{t("phone")}</label>
            <Input id="phone" name="phone" type="tel" value={cvData.personalInfo.phone} onChange={handlePersonalChange} placeholder={t("placeholders.phone")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">{t("city")}</label>
            <Input id="city" name="city" value={cvData.personalInfo.city} onChange={handlePersonalChange} placeholder={t("placeholders.city")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">{t("country")}</label>
            <Input id="country" name="country" value={cvData.personalInfo.country} onChange={handlePersonalChange} placeholder={t("placeholders.country")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("summaryTitle")}</CardTitle>
          <CardDescription>
              {t("summaryDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
              value={cvData.summary} 
              onChange={handleSummaryChange} 
              placeholder={t("placeholders.summary")} 
              className="min-h-[120px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
