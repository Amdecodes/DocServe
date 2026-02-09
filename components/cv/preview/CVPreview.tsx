"use client";

import { Suspense, lazy, useMemo, useState, useDeferredValue } from "react";
import { useCV } from "@/components/cv/CVContext";
import { DEFAULT_TEMPLATE, templateComponents } from "@/config/templates";
import { CVData, CoverLetterData, PersonalInfo } from "@/types/cv";
import { FileText, Mail, Loader2 } from "lucide-react";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { PreviewProtection } from "@/components/ui/PreviewProtection";
import { CV_DUMMY_DATA } from "@/config/dummy-data";
import { motion, AnimatePresence } from "framer-motion";

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

// Helper function outside the component to avoid re-creation
const mergePersonalInfo = (raw: Partial<PersonalInfo> | undefined, dummy: Partial<PersonalInfo> | undefined, showDummyData: boolean) => {
  if (!showDummyData) return raw || {};
  if (!raw) return dummy;
  // If user has ANY data, do not merge with dummy. 
  // We want to show only what the user entered + AI generated content.
  // Dummy data should only show if the user has entered NOTHING in this section.
  const hasData = Object.values(raw).some(v => v !== undefined && v !== "");
  if (hasData) {
      return { ...dummy, ...raw }; // We still merge with dummy structure/defaults, but maybe we should just return raw?
      // Actually, for "preview" feeling, we might want dummy data to disappear completely once user starts typing.
      // Let's try: if (hasData) return raw; -> but we need to match type.
      return { ...raw } as PersonalInfo;
  }
  return dummy;
};

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

export function CVPreview({ showDummyData = true }: { showDummyData?: boolean }) {
  const { selectedTemplate, cvData } = useCV();
  const [activePreview, setActivePreview] = useState<"resume" | "coverLetter">(
    "resume",
  );

  // PRO TIP: Use deferred value for the preview data.
  // This tells React that updating the preview is lower priority than responding to typing.
  // The user sees instant typing, and the preview catches up half a second later.
  const deferredCvData = useDeferredValue(cvData);

  const TemplateComponent = useMemo(() => {
    return lazyTemplates[selectedTemplate] || lazyTemplates[DEFAULT_TEMPLATE];
  }, [selectedTemplate]);

  const CoverLetterComponent = useMemo(() => {
    return (
      lazyCoverLetters[selectedTemplate] || lazyCoverLetters[DEFAULT_TEMPLATE]
    );
  }, [selectedTemplate]);

  // Helper to choose between user data and dummy data
  // Logic: If user has ANY item in the list, show ONLY user items. Omit dummy.
  const previewData = useMemo(() => {
    // If showDummyData is false, we strictly return the user data (or empty structure)
    if (!showDummyData) {
        return {
            ...deferredCvData,
             // Ensure arrays are arrays, not undefined, to prevent crashes
            experience: deferredCvData.experience || [],
            education: deferredCvData.education || [],
            skills: deferredCvData.skills || [],
            languages: deferredCvData.languages || [],
            volunteer: deferredCvData.volunteer || [],
            coreCompetencies: deferredCvData.coreCompetencies || [],
            personalInfo: deferredCvData.personalInfo || {},
            summary: deferredCvData.summary || "",
            references: deferredCvData.references || [],
        } as CVData;
    }

    return {
      ...deferredCvData,
      personalInfo: mergePersonalInfo(deferredCvData.personalInfo, CV_DUMMY_DATA.personalInfo, true),
      
      // For arrays: If length > 0, use user data. Else use dummy data.
      summary: deferredCvData.summary || CV_DUMMY_DATA.summary,
      experience: deferredCvData.experience?.length ? deferredCvData.experience : CV_DUMMY_DATA.experience,
      education: deferredCvData.education?.length ? deferredCvData.education : CV_DUMMY_DATA.education,
      skills: deferredCvData.skills?.length ? deferredCvData.skills : CV_DUMMY_DATA.skills,
      languages: deferredCvData.languages?.length ? deferredCvData.languages : CV_DUMMY_DATA.languages,
      volunteer: deferredCvData.volunteer?.length ? deferredCvData.volunteer : CV_DUMMY_DATA.volunteer,
      references: deferredCvData.references?.length ? deferredCvData.references : CV_DUMMY_DATA.references,
      coreCompetencies: deferredCvData.coreCompetencies?.length ? deferredCvData.coreCompetencies : CV_DUMMY_DATA.coreCompetencies,
      
      // Cover Letter specific handling
      coverLetter: deferredCvData.coverLetter 
    } as CVData;
  }, [deferredCvData, showDummyData]);

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

      {/* Preview Content - PRO CSS optimization: will-change and gpu acceleration */}
      <div 
        className="w-[210mm] min-h-[297mm] origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] transition-transform relative bg-white shadow-2xl border border-gray-100 overflow-hidden"
        style={{ 
          willChange: 'transform',
          transform: 'scale(var(--tw-scale-x)) translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <PreviewProtection isPaid={false} className="w-full h-full">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 md:bg-gray-50/50 md:backdrop-blur-sm z-50">
                <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 border border-gray-100">
                    <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Preparing Template...</p>
                </div>
              </div>
            }
          >
            {/* Visual Page Break Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none z-[40]"
              style={{
                background: "repeating-linear-gradient(to bottom, transparent 0px, transparent calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)"
              }} 
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedTemplate}-${activePreview}`}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full h-full"
              >
                {activePreview === "resume" ? (
                  <TemplateComponent data={previewData} />
                ) : (
                  <CoverLetterPreviewContent
                    coverLetter={previewData.coverLetter || ({} as CoverLetterData)}
                    personalInfo={previewData.personalInfo || {}}
                    aiGenerated={!!previewData.aiMetadata?.generated}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </PreviewProtection>
      </div>
    </div>
  );
}
