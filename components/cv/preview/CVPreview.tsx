"use client";

import { Suspense, lazy, useMemo, useState } from "react";
import { useCV } from "@/components/cv/CVContext";
import { DEFAULT_TEMPLATE, templateComponents } from "@/config/templates";
import { CVData, CoverLetterData, PersonalInfo } from "@/types/cv";
import { FileText, Mail } from "lucide-react";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";

// Dynamically generate lazy-loaded components from the registry
const lazyTemplates = Object.fromEntries(
  Object.entries(templateComponents).map(([id, config]) => [
    id,
    lazy(config.resume),
  ])
) as Record<string, React.LazyExoticComponent<React.ComponentType<{ data: CVData }>>>;

const lazyCoverLetters = Object.fromEntries(
  Object.entries(templateComponents).map(([id, config]) => [
    id,
    lazy(config.coverLetter),
  ])
) as Record<
  string,
  React.LazyExoticComponent<
    React.ComponentType<{
      coverLetter: CoverLetterData;
      personalInfo: PersonalInfo;
    }>
  >
>;

// Cover Letter Preview Component
function CoverLetterPreviewContent({
  coverLetter,
  personalInfo,
  aiGenerated = false,
}: {
  coverLetter?: CoverLetterData;
  personalInfo: PersonalInfo;
  aiGenerated?: boolean;
}) {
  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const senderName =
    `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Your Name";

  return (
    <div className="p-12 max-w-[210mm] mx-auto text-gray-900 bg-white h-full font-serif leading-relaxed">
      {/* Header / Sender Info */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider">
          {senderName}
        </h1>
        <div className="text-sm text-gray-600 flex flex-wrap gap-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.city && (
            <span>
              • {personalInfo.city}
              {personalInfo.country ? `, ${personalInfo.country}` : ""}
            </span>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="mb-8 text-right">
        <p>{formatDate()}</p>
      </div>

      {/* Recipient Info */}
      <div className="mb-8">
        <p className="font-bold">
          {coverLetter?.recipientName || "Recipient Name"}
        </p>
        <p>{coverLetter?.jobTitle && `${coverLetter.jobTitle}`}</p>
        <p>{coverLetter?.companyName || "Company Name"}</p>
      </div>

      {/* Salutation */}
      <div className="mb-6">
        <p>Dear {coverLetter?.recipientName || "Hiring Manager"},</p>
      </div>

      {/* Body */}
      <AIBlurOverlay type="coverLetter" isGenerated={aiGenerated}>
        <div className="mb-8 whitespace-pre-wrap text-justify">
          {coverLetter?.letterBody || (
            <span className="text-gray-400 italic">
              [Your cover letter body will appear here. Fill in the Cover Letter
              step to see your content.]
            </span>
          )}
        </div>
      </AIBlurOverlay>

      {/* Sign-off */}
      <div className="mt-12">
        <p>Sincerely,</p>
        <br />
        <br />
        <p className="font-bold">{senderName}</p>
      </div>
    </div>
  );
}

export function CVPreview() {
  const { selectedTemplate, cvData } = useCV();
  const [activePreview, setActivePreview] = useState<"resume" | "coverLetter">(
    "resume",
  );

  const TemplateComponent = useMemo(() => {
    return lazyTemplates[selectedTemplate] || lazyTemplates[DEFAULT_TEMPLATE];
  }, [selectedTemplate]);

  const CoverLetterComponent = useMemo(() => {
    return (
      lazyCoverLetters[selectedTemplate] || lazyCoverLetters[DEFAULT_TEMPLATE]
    );
  }, [selectedTemplate]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Preview Tabs */}
      <div className="flex gap-2 mb-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
        <button
          onClick={() => setActivePreview("resume")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activePreview === "resume"
              ? "bg-teal-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          Resume
        </button>
        <button
          onClick={() => setActivePreview("coverLetter")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activePreview === "coverLetter"
              ? "bg-teal-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Mail className="w-4 h-4" />
          Cover Letter
        </button>
      </div>

      {/* Preview Content */}
      <div className="w-[210mm] min-h-[297mm] origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] transition-transform relative">
        <Suspense
          fallback={
            <div className="p-10 text-gray-400">Loading template...</div>
          }
        >
          {/* Visual Page Break Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-50"
            style={{
              background: "repeating-linear-gradient(to bottom, transparent 0px, transparent calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)"
            }} 
          />

          {activePreview === "resume" ? (
            <TemplateComponent data={cvData} />
          ) : (
            <CoverLetterComponent
              coverLetter={(cvData.coverLetter || {}) as CoverLetterData}
              personalInfo={cvData.personalInfo || {}}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
