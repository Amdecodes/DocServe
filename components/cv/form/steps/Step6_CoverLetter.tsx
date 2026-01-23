"use client";

import React from "react";
import { useCV } from "@/components/cv/CVContext";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useTranslations } from "next-intl";

export const Step6_CoverLetter = () => {
  const { cvData, updateCoverLetter } = useCV();
  const t = useTranslations("CoverLetter");
  const coverLetter = cvData.coverLetter;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    updateCoverLetter({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-600 mt-1">{t("description")}</p>
      </div>

      <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("recipientDetails")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("recipientName")}
              </label>
              <Input
                name="recipientName"
                placeholder={t("recipientPlaceholder")}
                value={coverLetter?.recipientName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("companyName")}
              </label>
              <Input
                name="companyName"
                placeholder={t("companyPlaceholder")}
                value={coverLetter?.companyName || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("jobTitle")}
            </label>
            <Input
              name="jobTitle"
              placeholder={t("jobTitlePlaceholder")}
              value={coverLetter?.jobTitle || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("letterContent")}
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("tone")}
            </label>
            <Select
              name="tone"
              value={coverLetter?.tone || "Neutral"}
              onChange={handleChange}
            >
              <option value="Formal">{t("tones.Formal")}</option>
              <option value="Neutral">{t("tones.Neutral")}</option>
              <option value="Confident">{t("tones.Confident")}</option>
            </Select>
            <p className="text-xs text-gray-500">{t("toneHelp")}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("letterBody")}
            </label>
            <Textarea
              name="letterBody"
              placeholder={t("letterPlaceholder")}
              value={coverLetter?.letterBody || ""}
              onChange={handleChange}
              className="min-h-75"
            />
            <p className="text-xs text-gray-500">
              Tip: Your name and contact info will be pulled from your resume
              header automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
