"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Laptop, 
  ShoppingBag, 
  Rocket, 
  Layout, 
  Building, 
  FileText, 
  MoreHorizontal,
  CheckCircle,
  Loader2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { webDevSchema, WebDevFormValues } from "@/validators/web-dev.schema";

const PROJECT_TYPES = [
  { id: "PORTFOLIO", icon:  Layout, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "LANDING_PAGE", icon: Rocket, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "E_COMMERCE", icon: ShoppingBag, color: "text-green-500", bg: "bg-green-50" },
  { id: "SAAS", icon: Laptop, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "CORPORATE", icon: Building, color: "text-slate-500", bg: "bg-slate-50" },
  { id: "BLOG", icon: FileText, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "OTHER", icon: MoreHorizontal, color: "text-gray-500", bg: "bg-gray-50" },
];

export function WebDevForm() {
  const t = useTranslations("WebDevelopment");
  const tNav = useTranslations("CVNavigation");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<WebDevFormValues>({
    resolver: zodResolver(webDevSchema),
    defaultValues: {
      project_type: undefined,
      full_name: "",
      email: "",
      phone: "",
      budget_range: "",
      description: "",
    },
    mode: "onChange"
  });

  const selectedType = form.watch("project_type");

  const onSubmit = async (data: WebDevFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/web-development", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Submission failed");
      
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
      // Ideally show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const valid = await form.trigger("project_type");
      if (valid) setStep(2);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-12 text-center shadow-xl border border-green-100 max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("form.successTitle")}</h2>
        <p className="text-gray-600">{t("form.successMessage")}</p>
        <Button 
          className="mt-8 rounded-full" 
          variant="outline"
          onClick={() => { setIsSuccess(false); setStep(1); }}
        >
          {t("form.startNew")}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto mb-10 flex items-center gap-4">
        <div className={cn("h-2 flex-1 rounded-full transition-colors", step >= 1 ? "bg-blue-600" : "bg-gray-200")} />
        <div className={cn("h-2 flex-1 rounded-full transition-colors", step >= 2 ? "bg-blue-600" : "bg-gray-200")} />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">{t("steps.type")}</h2>
                <p className="text-gray-500 mt-2">{t("steps.typeDesc")}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  
                  return (
                    <div
                      key={type.id}
                      onClick={() => form.setValue("project_type", type.id as any, { shouldValidate: true })}
                      className={cn(
                        "cursor-pointer relative group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg",
                        isSelected 
                          ? "border-blue-500 bg-blue-50/30" 
                          : "border-gray-100 bg-white hover:border-blue-200"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", type.bg)}>
                        <Icon className={cn("w-6 h-6", type.color)} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{t(`types.${type.id}`)}</h3>
                      
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {form.formState.errors.project_type && (
                <p className="text-center text-red-500 text-sm mt-2">{form.formState.errors.project_type.message}</p>
              )}

              <div className="flex justify-end pt-8">
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={!selectedType}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-blue-200"
                >
                  {tNav("next")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-3xl mx-auto"
            >
               <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t("steps.details")}</h2>
                <p className="text-gray-500 mt-2">{t("steps.detailsDesc")}</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t("form.fullName")}</label>
                    <Input {...form.register("full_name")} placeholder="John Doe" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                    {form.formState.errors.full_name && <p className="text-red-500 text-xs">{form.formState.errors.full_name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t("form.phone")}</label>
                    <Input {...form.register("phone")} placeholder="+251..." className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                    {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t("form.email")}</label>
                    <Input {...form.register("email")} type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                    {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t("form.budget")}</label>
                    <Input {...form.register("budget_range")} placeholder="e.g. 50,000 - 100,000 ETB" className="h-12 rounded-xl bg-gray-50 border-gray-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("form.description")}</label>
                  <Textarea 
                    {...form.register("description")} 
                    placeholder={t("form.descriptionPlaceholder")}
                    className="min-h-[150px] rounded-xl bg-gray-50 border-gray-200 resize-none"
                  />
                  {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="rounded-full px-6 text-gray-500"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> {t("form.back")}
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-blue-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t("form.submitting")}
                    </>
                  ) : (
                    <>
                      {t("form.submit")} <CheckCircle className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
