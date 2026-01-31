"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { useTranslations, useLocale } from "next-intl";
import { virtualAssistanceSchema } from "@/validators/virtual-assistance.schema";
import {
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type FormValues = z.infer<typeof virtualAssistanceSchema>;

interface VirtualAssistanceFormProps {
  source?: "dashboard" | "landing";
}

export function VirtualAssistanceForm({
  source = "dashboard",
}: VirtualAssistanceFormProps) {
  const t = useTranslations("VirtualAssistance");
  const locale = useLocale() as "en" | "am";
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const STEPS = [t("steps.contact"), t("steps.job"), t("steps.confirm")];

  const form = useForm<FormValues>({
    resolver: zodResolver(virtualAssistanceSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      telegram_username: "",
      job_category: undefined as unknown as FormValues["job_category"],
      experience_level: undefined as unknown as FormValues["experience_level"],
      location: "",
      notes: "",
      disclaimer_accepted: undefined as unknown as true,
      language: locale,
      source: source,
    },
    mode: "onChange",
  });

  const disclaimerAccepted = form.watch("disclaimer_accepted");
  const notesValue = form.watch("notes") || "";

  // Validate current step before proceeding
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (step) {
      case 0: // Contact Info
        fieldsToValidate = ["full_name", "phone_number"];
        break;
      case 1: // Job Details
        fieldsToValidate = ["job_category", "experience_level", "location"];
        break;
      case 2: // Confirmation
        fieldsToValidate = ["disclaimer_accepted"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/virtual-assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitStatus("success");
      form.reset();
    } catch (error) {
      console.error("Error submitting virtual assistance request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (submitStatus === "success") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("successTitle")}</h3>
          <p className="text-muted-foreground">{t("successMessage")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={currentStep} className="mb-8" />

      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Contact Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  {t("steps.contactTitle")}
                </h3>

                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="full_name" className="text-sm font-medium">
                    {t("fullName")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="full_name"
                    {...form.register("full_name")}
                    placeholder={t("fullNamePlaceholder")}
                    className={
                      form.formState.errors.full_name ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.full_name && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone_number" className="text-sm font-medium">
                    {t("phoneNumber")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone_number"
                    type="tel"
                    {...form.register("phone_number")}
                    placeholder={t("phoneNumberPlaceholder")}
                    className={
                      form.formState.errors.phone_number ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.phone_number && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.phone_number.message}
                    </p>
                  )}
                </div>

                {/* Email - Optional */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t("email")}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({t("optional")})
                    </span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder={t("emailPlaceholder")}
                    className={
                      form.formState.errors.email ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Telegram Username - Optional */}
                <div className="space-y-2">
                  <label
                    htmlFor="telegram_username"
                    className="text-sm font-medium"
                  >
                    {t("telegramUsername")}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({t("optional")})
                    </span>
                  </label>
                  <Input
                    id="telegram_username"
                    {...form.register("telegram_username")}
                    placeholder={t("telegramUsernamePlaceholder")}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t("steps.jobTitle")}</h3>

                {/* Job Category */}
                <div className="space-y-2">
                  <label htmlFor="job_category" className="text-sm font-medium">
                    {t("jobCategory")} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    id="job_category"
                    {...form.register("job_category")}
                    className={
                      form.formState.errors.job_category ? "border-red-500" : ""
                    }
                  >
                    <option value="">{t("selectJobCategory")}</option>
                    <option value="technology_it">
                      {t("jobs.technology_it")}
                    </option>
                    <option value="business_finance">
                      {t("jobs.business_finance")}
                    </option>
                    <option value="design_creative">
                      {t("jobs.design_creative")}
                    </option>
                    <option value="marketing_sales">
                      {t("jobs.marketing_sales")}
                    </option>
                    <option value="healthcare">{t("jobs.healthcare")}</option>
                    <option value="education">{t("jobs.education")}</option>
                    <option value="administration">
                      {t("jobs.administration")}
                    </option>
                    <option value="skilled_trades">
                      {t("jobs.skilled_trades")}
                    </option>
                    <option value="hospitality_service">
                      {t("jobs.hospitality_service")}
                    </option>
                    <option value="other">{t("jobs.other")}</option>
                  </Select>
                  {form.formState.errors.job_category && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.job_category.message}
                    </p>
                  )}
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label
                    htmlFor="experience_level"
                    className="text-sm font-medium"
                  >
                    {t("experienceLevel")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    id="experience_level"
                    {...form.register("experience_level")}
                    className={
                      form.formState.errors.experience_level
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <option value="">{t("selectExperienceLevel")}</option>
                    <option value="entry">{t("experienceLevels.entry")}</option>
                    <option value="mid">{t("experienceLevels.mid")}</option>
                    <option value="senior">
                      {t("experienceLevels.senior")}
                    </option>
                    <option value="executive">
                      {t("experienceLevels.executive")}
                    </option>
                  </Select>
                  {form.formState.errors.experience_level && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.experience_level.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    {t("location")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    placeholder={t("locationPlaceholder")}
                    className={
                      form.formState.errors.location ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.location && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>

                {/* Additional Notes - Optional */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    {t("additionalNotes")}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({t("optional")})
                    </span>
                  </label>
                  <Textarea
                    id="notes"
                    {...form.register("notes")}
                    placeholder={t("additionalNotesPlaceholder")}
                    rows={4}
                    maxLength={700}
                    className={
                      form.formState.errors.notes ? "border-red-500" : ""
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{form.formState.errors.notes?.message}</span>
                    <span>{notesValue.length}/700</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  {t("steps.confirmTitle")}
                </h3>

                {/* Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {t("fullName")}:
                    </span>
                    <span className="font-medium">
                      {form.getValues("full_name")}
                    </span>

                    <span className="text-muted-foreground">
                      {t("phoneNumber")}:
                    </span>
                    <span className="font-medium">
                      {form.getValues("phone_number")}
                    </span>

                    {form.getValues("email") && (
                      <>
                        <span className="text-muted-foreground">
                          {t("email")}:
                        </span>
                        <span className="font-medium">
                          {form.getValues("email")}
                        </span>
                      </>
                    )}

                    {form.getValues("telegram_username") && (
                      <>
                        <span className="text-muted-foreground">
                          {t("telegramUsername")}:
                        </span>
                        <span className="font-medium">
                          {form.getValues("telegram_username")}
                        </span>
                      </>
                    )}

                    <span className="text-muted-foreground">
                      {t("jobCategory")}:
                    </span>
                    <span className="font-medium">
                      {t(`jobs.${form.getValues("job_category")}`)}
                    </span>

                    <span className="text-muted-foreground">
                      {t("experienceLevel")}:
                    </span>
                    <span className="font-medium">
                      {t(
                        `experienceLevels.${form.getValues("experience_level")}`,
                      )}
                    </span>

                    <span className="text-muted-foreground">
                      {t("location")}:
                    </span>
                    <span className="font-medium">
                      {form.getValues("location")}
                    </span>
                  </div>

                  {form.getValues("notes") && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground text-sm">
                        {t("additionalNotes")}:
                      </span>
                      <p className="text-sm mt-1">{form.getValues("notes")}</p>
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    {/* <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" /> */}
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {t("disclaimerText")}
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disclaimerAccepted === true}
                      onChange={(e) => {
                        form.setValue(
                          "disclaimer_accepted",
                          e.target.checked
                            ? true
                            : (undefined as unknown as true),
                          { shouldValidate: true },
                        );
                      }}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">
                      {t("disclaimerAccept")}{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {form.formState.errors.disclaimer_accepted && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.disclaimer_accepted.message}
                    </p>
                  )}
                </div>

                {/* Error State */}
                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {t("errorMessage")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("back")}
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  {t("next")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !disclaimerAccepted}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
