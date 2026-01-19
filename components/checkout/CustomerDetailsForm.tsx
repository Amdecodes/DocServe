"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { useTranslations } from "next-intl"
import { customerSchema, type CustomerSchema } from "@/validators/customer.schema"

interface CustomerDetailsFormProps {
  onValidityChange: (isValid: boolean) => void
}

export function CustomerDetailsForm({ onValidityChange }: CustomerDetailsFormProps) {
  const t = useTranslations("CustomerForm") // Assuming translation key exists or we fallback
  
  // 1. Initialize logic
  const getInitialValues = () => {
    if (typeof window !== "undefined") {
      // 1. Try to load existing customer data
      const savedCustomer = localStorage.getItem("paperless.customer")
      if (savedCustomer) {
        try {
          return JSON.parse(savedCustomer)
        } catch (e) { console.error("Error parsing customer data", e) }
      }

      // 2. If no customer data, try auto-fill from Personal data (ONE WAY SYNC)
      const savedPersonal = localStorage.getItem("paperless.personal")
      if (savedPersonal) {
        try {
           const personal = JSON.parse(savedPersonal)
           // Only map shared fields
           return {
             firstName: personal.firstName || "",
             lastName: personal.lastName || "",
             email: personal.email || "",
             phone: personal.phone || "",
           }
        } catch (e) {
          console.error("Auto-fill error", e)
        }
      }
    }
    
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    }
  }

  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: getInitialValues(),
    mode: "onChange"
  })

  // Watch for changes to persist
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Persist to local storage
      localStorage.setItem("paperless.customer", JSON.stringify(value))
      
      // Notify parent about validity
      // We use form.trigger() to check validity or rely on formState.isValid
      // But formState.isValid might be false initially if untouched. 
      // We want to block payment if invalid.
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Effect to report validity to parent
  useEffect(() => {
      onValidityChange(form.formState.isValid)
  }, [form.formState.isValid, onValidityChange])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardDescription>{t("description", { defaultMessage: "We need this information for the receipt." })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input 
                    id="firstName" 
                    {...form.register("firstName")}
                    className={form.formState.errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                 {form.formState.errors.firstName && (
                    <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                )}
            </div>
            <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input 
                    id="lastName" 
                    {...form.register("lastName")}
                    className={form.formState.errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                 {form.formState.errors.lastName && (
                    <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>
                )}
            </div>
        </div>
        
        <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input 
                id="email" 
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
             {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
        </div>

        <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
            <Input 
                id="phone" 
                type="tel"
                {...form.register("phone")}
                className={form.formState.errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
             {form.formState.errors.phone && (
                <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
