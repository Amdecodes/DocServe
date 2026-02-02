"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { useCV } from "@/components/cv/CVContext";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  personalSchema,
  type PersonalSchema,
} from "@/validators/personal.schema";
import { CoreCompetencies } from "../CoreCompetencies";
import { PersonalInfo } from "@/types/cv";

interface Step1Props {
  onNext: () => void;
}

export function Step1_Personal({ onNext }: Step1Props) {
  const { cvData, updateCVData } = useCV();
  const t = useTranslations("PersonalInfo");

  // 1. Initialize form
  const form = useForm<PersonalSchema>({
    resolver: zodResolver(personalSchema),
    defaultValues: cvData.personalInfo,
    mode: "onChange",
  });

  // Load from localStorage on mount (Only once)
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("paperless.personal");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          form.reset({
            ...cvData.personalInfo,
            ...parsed,
          });
        } catch (e) {
          console.error("Failed to parse saved personal data", e);
        }
      }
      setHasInitialized(true);
    }
  }, [form, cvData.personalInfo, hasInitialized]);

  // 2. Watch for changes to sync with Preview & LocalStorage
  const formValues = form.watch();

  // 2. Watch for changes to sync with Preview & LocalStorage (Debounced)
  useEffect(() => {
    const subscription = form.watch((value) => {
      const timeoutId = setTimeout(() => {
        // Sync with Context (for Preview)
        updateCVData("personalInfo", {
          ...cvData.personalInfo,
          ...value,
        } as PersonalInfo);

        // Persist to LocalStorage
        localStorage.setItem("paperless.personal", JSON.stringify(value));
      }, 500); // 500ms debounce for typing

      return () => clearTimeout(timeoutId);
    });
    return () => subscription.unsubscribe();
  }, [form, updateCVData, cvData.personalInfo]);

  const [isUploading, setIsUploading] = useState(false);

  // Handle Valid Submission from Parent "Next" button
  const onSubmit = (data: PersonalSchema) => {
    // Double check we saved the latest valid data
    updateCVData("personalInfo", data);

    // Persist to LocalStorage
    localStorage.setItem("paperless.personal", JSON.stringify(data));

    // Proceed to next step
    onNext();
  };

  return (
    <div className="space-y-6">
      <form
        id="step1-personal-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden relative">
                {formValues.photo ? (
                  <Image
                    src={formValues.photo}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 96px"
                    priority
                  />
                ) : (
                  <span className="text-gray-400 text-xs text-center p-2">
                    {t("noPhoto")}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="photo"
                  className="text-sm font-medium block mb-1"
                >
                  {t("photoLabel")}
                </label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setIsUploading(true);
                        const formData = new FormData();
                        formData.append("file", file);

                        const res = await fetch("/api/upload/image", {
                          method: "POST",
                          body: formData,
                        });

                        if (!res.ok) throw new Error("Upload failed");

                        const data = await res.json();
                        form.setValue("photo", data.url, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      } catch (err) {
                        console.error("Photo upload error", err);
                        alert("Failed to upload photo. Please try again.");
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isUploading ? "Uploading..." : t("photoHint")}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                {t("firstName")}
              </label>
              <Input
                id="firstName"
                placeholder={t("placeholders.firstName")}
                {...form.register("firstName")}
                className={
                  form.formState.errors.firstName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {form.formState.errors.firstName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                {t("lastName")}
              </label>
              <Input
                id="lastName"
                placeholder={t("placeholders.lastName")}
                {...form.register("lastName")}
                className={
                  form.formState.errors.lastName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {form.formState.errors.lastName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="jobTitle" className="text-sm font-medium">
                {t("jobTitle")}{" "}
                <span className="text-gray-400 font-normal text-xs">
                  (Optional)
                </span>
              </label>
              <Input
                id="jobTitle"
                placeholder={t("placeholders.jobTitle")}
                {...form.register("jobTitle")}
                className={
                  form.formState.errors.jobTitle
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {form.formState.errors.jobTitle && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.jobTitle.message}
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="headline" className="text-sm font-medium">
                Resume Headline (Optional)
              </label>
              <Input
                id="headline"
                placeholder="e.g. Senior Software Engineer specializing in React"
                {...form.register("headline")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("email")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t("placeholders.email")}
                {...form.register("email")}
                className={
                  form.formState.errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                {t("phone")}
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("placeholders.phone")}
                {...form.register("phone")}
                className={
                  form.formState.errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                {t("city")}
              </label>
              <Input
                id="city"
                placeholder={t("placeholders.city")}
                {...form.register("city")}
                className={
                  form.formState.errors.city
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {form.formState.errors.city && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                {t("country")}
              </label>
              <Input
                id="country"
                placeholder={t("placeholders.country")}
                {...form.register("country")}
                className={
                  form.formState.errors.country
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {form.formState.errors.country && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                {t("dateOfBirth")}
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                placeholder={t("placeholders.dateOfBirth")}
                {...form.register("dateOfBirth")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn URL (Optional)
              </label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/..."
                {...form.register("linkedin")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">
                Portfolio / Website (Optional)
              </label>
              <Input
                id="website"
                placeholder="yoursite.com"
                {...form.register("website")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("summaryTitle")}</CardTitle>
            <CardDescription>
              {t("summaryDescription")}
              <span className="block mt-2 text-blue-600 font-medium text-sm">
                💡 AI will generate your professional summary after payment
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label htmlFor="summary" className="text-sm font-medium block mb-2">
              Brief Notes (For AI Context)
            </label>
            <Textarea
              id="summary"
              placeholder="e.g., Key achievements, main skills, career highlights... AI will craft this into a professional summary"
              className={`min-h-30 ${form.formState.errors.summary ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...form.register("summary")}
            />
            {form.formState.errors.summary && (
              <p className="text-xs text-red-500">
                {form.formState.errors.summary.message}
              </p>
            )}
            <div className="text-xs text-gray-500 text-right mt-1">
              {formValues.summary ? formValues.summary.length : 0} characters
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Core Competencies - handled outside of the main form but updates context directly */}
      <CoreCompetencies />
    </div>
  );
}
