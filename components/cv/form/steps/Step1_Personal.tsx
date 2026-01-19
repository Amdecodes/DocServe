"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { useCV } from "@/components/cv/CVContext"
import { useTranslations } from "next-intl"
import { personalSchema, type PersonalSchema } from "@/validators/personal.schema"

interface Step1Props {
  onNext: () => void
}

export function Step1_Personal({ onNext }: Step1Props) {
  const { cvData, updateCVData } = useCV()
  const t = useTranslations("PersonalInfo")

  // 1. Initialize form
  // Try to load from localStorage first, then fallback to CVContext
  const getInitialValues = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("paperless.personal")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse saved personal data", e)
        }
      }
    }
    return cvData.personalInfo
  }

  const form = useForm<PersonalSchema>({
    resolver: zodResolver(personalSchema),
    defaultValues: getInitialValues(),
    mode: "onChange" // Validate on change so we can show/hide errors live if needed (or "onBlur")
  })

  // 2. Watch for changes to sync with Preview & LocalStorage
  const formValues = form.watch()

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Sync with Context (for Preview)
      // We cast value to any because standard Partial<PersonalSchema> might miss internal Context types if they differ slightly
      // But they should match.
      updateCVData("personalInfo", value)
      
      // Persist to LocalStorage
      localStorage.setItem("paperless.personal", JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [form.watch, updateCVData])

  // Handle Valid Submission from Parent "Next" button
  const onSubmit = (data: PersonalSchema) => {
    // Double check we saved the latest valid data
    updateCVData("personalInfo", data)
    localStorage.setItem("paperless.personal", JSON.stringify(data))
    
    // Proceed
    onNext()
  }

  return (
    <form id="step1-personal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 flex items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden relative">
                    {formValues.photo ? (
                        <img src={formValues.photo} alt="Profile" className="h-full w-full object-cover" />
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
                                    const result = reader.result as string
                                    form.setValue("photo", result, { shouldDirty: true, shouldTouch: true })
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
            <Input 
                id="firstName" 
                placeholder={t("placeholders.firstName")} 
                {...form.register("firstName")}
                className={form.formState.errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {form.formState.errors.firstName && (
                <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">{t("lastName")}</label>
            <Input 
                id="lastName" 
                placeholder={t("placeholders.lastName")} 
                {...form.register("lastName")}
                className={form.formState.errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
             {form.formState.errors.lastName && (
                <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="jobTitle" className="text-sm font-medium">{t("jobTitle")}</label>
            <Input 
                id="jobTitle" 
                placeholder={t("placeholders.jobTitle")} 
                {...form.register("jobTitle")}
                className={form.formState.errors.jobTitle ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {form.formState.errors.jobTitle && (
                <p className="text-xs text-red-500">{form.formState.errors.jobTitle.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
            <Input 
                id="email" 
                type="email" 
                placeholder={t("placeholders.email")} 
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">{t("phone")}</label>
            <Input 
                id="phone" 
                type="tel" 
                placeholder={t("placeholders.phone")} 
                {...form.register("phone")}
                className={form.formState.errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {form.formState.errors.phone && (
                <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">{t("city")}</label>
            <Input 
                id="city" 
                placeholder={t("placeholders.city")} 
                {...form.register("city")}
                className={form.formState.errors.city ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {form.formState.errors.city && (
                <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">{t("country")}</label>
            <Input 
                id="country" 
                placeholder={t("placeholders.country")} 
                {...form.register("country")}
                className={form.formState.errors.country ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {form.formState.errors.country && (
                <p className="text-xs text-red-500">{form.formState.errors.country.message}</p>
            )}
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
              placeholder={t("placeholders.summary")} 
              className={`min-h-[120px] ${form.formState.errors.summary ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...form.register("summary")}
          />
           {form.formState.errors.summary && (
                <p className="text-xs text-red-500">{form.formState.errors.summary.message}</p>
            )}
        </CardContent>
      </Card>
    </form>
  )
}
