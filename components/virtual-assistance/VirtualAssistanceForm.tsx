"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { virtualAssistanceSchema } from "@/validators/virtual-assistance.schema";
import {
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  CheckSquare,
  Sparkles,
  MapPin,
  AtSign,
  Phone,
  Send,
  Upload,
  FileText,
  X,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";

type FormValues = z.infer<typeof virtualAssistanceSchema>;

interface VirtualAssistanceFormProps {
  source?: "dashboard" | "landing";
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export function VirtualAssistanceForm({
  source = "dashboard",
}: VirtualAssistanceFormProps) {
  const t = useTranslations("VirtualAssistance");
  const locale = useLocale() as "en" | "am";
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const STEPS = [
    { id: 0, label: t("steps.contact"), icon: User },
    { id: 1, label: t("steps.job"), icon: Briefcase },
    { id: 2, label: t("steps.confirm"), icon: CheckSquare },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(virtualAssistanceSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      telegram_username: "",
      job_category: undefined as unknown as FormValues["job_category"],
      experience_level: undefined as unknown as FormValues["experience_level"],
      education_level: undefined as unknown as FormValues["education_level"],
      location: "",
      notes: "",
      resume_url: "",
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
        fieldsToValidate = [
          "job_category",
          "experience_level",
          "education_level",
          "location",
        ];
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
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Success view
  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12 border border-green-50"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          {t("successTitle")}
        </h3>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          {t("successMessage")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => (window.location.href = "/services")}
            variant="outline"
            className="rounded-full px-8 py-6 h-auto text-lg flex-1 border-gray-200"
          >
            {t("back")}
          </Button>
          <Button
            asChild
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-6 h-auto text-lg flex-1 shadow-lg shadow-blue-100"
          >
            <a
              href="https://t.me/senedx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {t("telegramJoin")}
            </a>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100 text-teal-600 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          {t("description")}
        </p>
      </div>

      {/* Modern Stepper */}
      <div className="flex items-center justify-center mb-12">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 inline-flex gap-2">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-teal-50 text-teal-700 font-semibold shadow-xs"
                    : isCompleted
                      ? "text-teal-600 bg-transparent"
                      : "text-gray-400",
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "animate-pulse")} />
                <span
                  className={cn("text-sm", !isActive && "hidden md:inline")}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white overflow-hidden backdrop-blur-xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-10">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-8"
            >
              {/* Step 1: Contact Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">
                        {t("fullName")} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                        <Input
                          {...form.register("full_name")}
                          placeholder={t("fullNamePlaceholder")}
                          className={cn(
                            "pl-10 pb-2.5 pt-2.5 h-11 border-gray-200 focus-visible:ring-teal-500 focus-visible:border-teal-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200",
                            form.formState.errors.full_name &&
                              "border-red-500 bg-red-50/50",
                          )}
                        />
                      </div>
                      {form.formState.errors.full_name && (
                        <p className="text-xs text-red-500 ml-1">
                          {form.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">
                        {t("phoneNumber")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          {...form.register("phone_number")}
                          placeholder={t("phoneNumberPlaceholder")}
                          className={cn(
                            "pl-10 h-11 border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all",
                            form.formState.errors.phone_number &&
                              "border-red-500 bg-red-50/50",
                          )}
                        />
                      </div>
                      {form.formState.errors.phone_number && (
                        <p className="text-xs text-red-500 ml-1">
                          {form.formState.errors.phone_number.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1 flex justify-between">
                        {t("email")}
                        <span className="text-gray-400 text-xs font-normal">
                          {t("optional")}
                        </span>
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          {...form.register("email")}
                          placeholder={t("emailPlaceholder")}
                          className="pl-10 h-11 border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all"
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-500 ml-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Telegram */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1 flex justify-between">
                        {t("telegramUsername")}
                        <span className="text-gray-400 text-xs font-normal">
                          {t("optional")}
                        </span>
                      </label>
                      <div className="relative">
                        <Send className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...form.register("telegram_username")}
                          placeholder={t("telegramUsernamePlaceholder")}
                          className="pl-10 h-11 border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Job Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">
                        {t("jobCategory")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        {...form.register("job_category")}
                        className={cn(
                          "h-11 border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white",
                          form.formState.errors.job_category &&
                            "border-red-500 bg-red-50/50",
                        )}
                      >
                        <option value="">{t("selectJobCategory")}</option>
                        {[
                          "technology_it",
                          "business_finance",
                          "design_creative",
                          "marketing_sales",
                          "healthcare",
                          "education",
                          "administration",
                          "skilled_trades",
                          "hospitality_service",
                          "other",
                        ].map((job) => (
                          <option key={job} value={job}>
                            {t(`jobs.${job}`)}
                          </option>
                        ))}
                      </Select>
                      {form.formState.errors.job_category && (
                        <p className="text-xs text-red-500 ml-1">
                          {form.formState.errors.job_category.message}
                        </p>
                      )}
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">
                        {t("experienceLevel")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        {...form.register("experience_level")}
                        className={cn(
                          "h-11 border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white",
                          form.formState.errors.experience_level &&
                            "border-red-500 bg-red-50/50",
                        )}
                      >
                        <option value="">{t("selectExperienceLevel")}</option>
                        {["entry", "mid", "senior", "executive"].map(
                          (level) => (
                            <option key={level} value={level}>
                              {t(`experienceLevels.${level}`)}
                            </option>
                          ),
                        )}
                      </Select>
                      {form.formState.errors.experience_level && (
                        <p className="text-xs text-red-500 ml-1">
                          {form.formState.errors.experience_level.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Education Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">
                        {t("educationLevel")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                        <Select
                          {...form.register("education_level")}
                          className={cn(
                            "pl-10 h-11 border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white",
                            form.formState.errors.education_level &&
                              "border-red-500 bg-red-50/50",
                          )}
                        >
                          <option value="">{t("selectEducationLevel")}</option>
                          {[
                            "high_school_certificate",
                            "tvet_level_1",
                            "tvet_level_2",
                            "tvet_level_3",
                            "tvet_level_4",
                            "tvet_level_5_diploma",
                            "bachelors_degree",
                            "masters_degree",
                            "doctorate_phd",
                          ].map((edu) => (
                            <option key={edu} value={edu}>
                              {t(`educationLevels.${edu}`)}
                            </option>
                          ))}
                        </Select>
                      </div>
                      {form.formState.errors.education_level && (
                        <p className="text-xs text-red-500 ml-1">
                          {form.formState.errors.education_level.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      {t("location")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...form.register("location")}
                        placeholder={t("locationPlaceholder")}
                        className={cn(
                          "pl-10 h-11 border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all",
                          form.formState.errors.location &&
                            "border-red-500 bg-red-50/50",
                        )}
                      />
                    </div>
                    {form.formState.errors.location && (
                      <p className="text-xs text-red-500 ml-1">
                        {form.formState.errors.location.message}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1 flex justify-between">
                      {t("additionalNotes")}
                      <span className="text-gray-400 text-xs font-normal">
                        {t("optional")}
                      </span>
                    </label>
                    <Textarea
                      {...form.register("notes")}
                      placeholder={t("additionalNotesPlaceholder")}
                      rows={5}
                      maxLength={700}
                      className={cn(
                        "resize-none border-gray-200 focus-visible:ring-teal-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all",
                        form.formState.errors.notes && "border-red-500",
                      )}
                    />
                    <div className="text-right text-xs text-gray-400">
                      {notesValue.length}/700
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1 flex justify-between">
                      {t("resumeUpload")}
                      <span className="text-gray-400 text-xs font-normal">
                        {t("optional")}
                      </span>
                    </label>
                    {!uploadedFile ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-teal-300 transition-colors bg-gray-50/50">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-3">
                          {t("uploadDescription")}
                        </p>
                        <UploadButton
                          endpoint="virtualAssistanceResume"
                          onUploadBegin={() => setUploadError(null)}
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              const fileUrl = res[0].url;
                              const fileName = res[0].name;
                              setUploadedFile(fileUrl);
                              setUploadedFileName(fileName);
                              form.setValue("resume_url", fileUrl);
                              setUploadError(null);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setUploadError(error.message || t("uploadError"));
                            console.error(error);
                          }}
                          appearance={{
                            button:
                              "bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium ut-ready:bg-teal-600 ut-uploading:bg-teal-500",
                            allowedContent: "text-xs text-gray-500 mt-2",
                          }}
                        />
                        {uploadError && (
                          <p className="text-xs text-red-500 mt-2 animate-pulse font-medium bg-red-50 px-2 py-1 rounded">
                            {uploadError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                        <FileText className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-teal-900 truncate">
                            {uploadedFileName || "Resume uploaded"}
                          </p>
                          <p className="text-xs text-teal-600">
                            Upload successful
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFile(null);
                            setUploadedFileName(null);
                            form.setValue("resume_url", "");
                          }}
                          className="p-1 hover:bg-teal-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-teal-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                      Request Summary
                    </h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">
                            {t("fullName")}
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {form.getValues("full_name")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">
                            {t("phoneNumber")}
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {form.getValues("phone_number")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">
                            {t("jobCategory")}
                          </p>
                          <p className="text-base font-medium text-gray-900 truncate">
                            {" "}
                            {t(`jobs.${form.getValues("job_category")}`)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">
                            {t("experienceLevel")}
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {t(
                              `experienceLevels.${form.getValues("experience_level")}`,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase">
                          {t("location")}
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {form.getValues("location")}
                        </p>
                      </div>

                      {form.getValues("notes") && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 uppercase">
                            {t("additionalNotes")}
                          </p>
                          <p className="text-sm text-gray-700 mt-1 italic leading-relaxed">
                            &quot;{form.getValues("notes")}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Disclaimer Checkbox */}
                  <label className="flex items-start gap-3 p-4 border border-teal-100 bg-teal-50/50 rounded-xl cursor-pointer hover:bg-teal-50 transition-colors">
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
                      className="mt-1 w-5 h-5 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-sm">
                      <span className="font-medium text-teal-900 block mb-1">
                        {t("disclaimerAccept")}
                      </span>
                      <span className="text-teal-700/80 leading-snug">
                        {t("disclaimerText")}
                      </span>
                    </div>
                  </label>
                  {form.formState.errors.disclaimer_accepted && (
                    <p className="text-xs text-red-500 text-center animate-pulse">
                      {form.formState.errors.disclaimer_accepted.message}
                    </p>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center text-sm">
                      {t("errorMessage")}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                "text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full px-6",
                currentStep === 0 && "invisible",
              )}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gray-900 hover:bg-black text-white rounded-full px-8 h-12 shadow-lg hover:shadow-xl transition-all"
              >
                {t("next")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !disclaimerAccepted}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 h-12 shadow-lg shadow-teal-200 hover:shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    {t("submit")}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
