"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CVProvider, useCV } from "@/components/cv/CVContext";
import Header from "@/components/landing/Header";
import dynamic from "next/dynamic";
const CVPreview = dynamic(
  () =>
    import("@/components/cv/preview/CVPreview").then((mod) => mod.CVPreview),
  { ssr: false },
);
import { TemplateSelector } from "@/components/cv/preview/TemplateSelector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  Layers,
  FileText,
  CheckCircle,
  Eye,
} from "lucide-react";

// Steps
import { Step1_Personal } from "@/components/cv/form/steps/Step1_Personal";
import { Step2_Education } from "@/components/cv/form/steps/Step2_Education";
import { Step3_Experience } from "@/components/cv/form/steps/Step3_Experience";
import { Step4_Skills } from "@/components/cv/form/steps/Step4_Skills";
import { Step5_Extras } from "@/components/cv/form/steps/Step5_Extras";
import { Step6_CoverLetter } from "@/components/cv/form/steps/Step6_CoverLetter";
import { Step5_Review } from "@/components/cv/form/steps/Step5_Review";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 10 : -10, // Reduced movement
    opacity: 0,
  }),
};

function CVWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const { setTemplate, selectedTemplate, cvData } = useCV();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const t = useTranslations("ReviewStep");
  const navT = useTranslations("CVNavigation");

  const stepsConfig = useMemo(
    () => [
      { title: navT("steps.personal"), icon: User },
      { title: navT("steps.education"), icon: GraduationCap },
      { title: navT("steps.experience"), icon: Briefcase },
      { title: navT("steps.skills"), icon: Sparkles },
      { title: navT("steps.extras"), icon: Layers },
      { title: navT("steps.coverLetter") || "Cover Letter", icon: FileText },
      { title: navT("steps.review"), icon: CheckCircle },
    ],
    [navT],
  );

  const nextStep = () => {
    if (currentStep < stepsConfig.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      const formContainer = document.getElementById("form-scroll-container");
      if (formContainer) formContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      const formContainer = document.getElementById("form-scroll-container");
      if (formContainer) formContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProceedToCheckout = async () => {
    setIsCreatingOrder(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: "cv_writing",
          form_data: {
            ...cvData,
            selectedTemplate: selectedTemplate || "golden", // Must match key in process-order.ts
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json();
      localStorage.setItem("paperless.orderId", data.orderId);
      router.push("/checkout");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Determine current form ID for steps that use HTML forms
  const getFormId = () => {
    switch (currentStep) {
      case 0:
        return "step1-personal-form";
      // Add other IDs if other steps are refactored to use standard form submission
      default:
        return undefined;
    }
  };

  const currentFormId = getFormId();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1_Personal onNext={nextStep} />;
      case 1:
        return <Step2_Education />;
      case 2:
        return <Step3_Experience />;
      case 3:
        return <Step4_Skills />;
      case 4:
        return <Step5_Extras />;
      case 5:
        return <Step6_CoverLetter />;
      case 6:
        return <Step5_Review />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50/50">
      {/* Mobile Tab Toggles - REMOVED for performance, preview moved to end */}
      <div className="hidden">
        {/* Keeping states for internal logic but hiding UI */}
        <button onClick={() => setActiveTab("edit")}>Edit</button>
        <button onClick={() => setActiveTab("preview")}>Preview</button>
      </div>

      <div className="flex flex-1 lg:flex-row overflow-hidden relative">
        {/* Left: Form Area */}
        <div
          className={cn(
            "w-full lg:w-2/5 xl:w-[45%] flex flex-col h-full bg-white transition-all duration-300",
            activeTab === "preview" ? "hidden lg:flex" : "flex",
          )}
        >
          {/* Modern Stepper Header */}
          <div className="bg-white border-b border-gray-100 px-4 py-4 md:px-8 overflow-x-auto shrink-0 z-20 shadow-sm/50">
            <div className="flex items-center gap-2 min-w-max mx-auto max-w-4xl no-scrollbar">
              {stepsConfig.map((step, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                const Icon = step.icon;

                return (
                  <div key={idx} className="flex items-center">
                    <button
                      onClick={() => {
                        if (idx < currentStep) {
                          setDirection(-1);
                          setCurrentStep(idx);
                        }
                      }}
                      disabled={idx > currentStep}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                        isActive
                          ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200"
                          : isCompleted
                            ? "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100"
                            : "bg-white text-gray-400 border-gray-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-3.5 h-3.5",
                          isActive && "animate-pulse",
                        )}
                      />
                      <span className={cn(!isActive && "hidden md:inline")}>
                        {step.title}
                      </span>
                    </button>
                    {idx < stepsConfig.length - 1 && (
                      <div
                        className={cn(
                          "w-4 h-0.5 mx-1 rounded-full",
                          isCompleted ? "bg-teal-200" : "bg-gray-100",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content (Scrollable) */}
          <div
            id="form-scroll-container"
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 scroll-smooth"
          >
            <div className="max-w-3xl mx-auto pb-20">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
                    {/* Decorative background blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-teal-50 to-transparent rounded-bl-full z-0 opacity-50" />

                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        {stepsConfig[currentStep].icon && (
                          <span className="p-2 bg-teal-50 rounded-lg text-teal-600">
                            {(() => {
                              const Icon = stepsConfig[currentStep].icon;
                              return <Icon className="w-5 h-5" />;
                            })()}
                          </span>
                        )}
                        {stepsConfig[currentStep].title}
                      </h2>
                      {renderStep()}

                      {/* Mobile Only: Show Preview + Template Selector ONLY on the last step */}
                      <div className="lg:hidden mt-6 border-t border-slate-100 pt-8 bg-slate-50/50 -mx-6 md:-mx-8 px-6 md:px-8 pb-40">
                        {currentStep === stepsConfig.length - 1 && (
                          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Template Selector Card */}
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-5 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500 opacity-50" />
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-teal-500" />
                                  Select Template
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-1 bg-teal-50 text-teal-700 rounded-md uppercase tracking-wide">
                                  Premium
                                </span>
                              </div>
                              <TemplateSelector layout="horizontal" />
                            </div>

                            {/* Live Preview Card */}
                            <div>
                              <div className="flex items-center justify-center mb-4">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-2 py-1.5 pl-3 pr-4 rounded-full shadow-sm border border-slate-200">
                                  <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                  </div>
                                  Live Preview
                                </div>
                              </div>

                              <div className="relative group">
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-gradient-to-b from-teal-500/20 to-blue-500/20 rounded-[28px] blur-xl opacity-50" />

                                <div className="relative bg-slate-100 rounded-[24px] p-2 ring-1 ring-white/50 shadow-xl">
                                  <div className="bg-white rounded-[20px] overflow-hidden min-h-[500px] relative shadow-inner">
                                    {/* Scaling Logic - Fits A4 width on mobile */}
                                    <div className="origin-top scale-[0.55] sm:scale-[0.65] w-full h-full">
                                      <CVPreview />
                                    </div>

                                    {/* Gradient Overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Navigation (Fixed at bottom) */}
          <div className="bg-white border-t border-gray-200 p-4 md:px-10 shrink-0 flex justify-between z-20 shadow-md">
            <Button
              variant="ghost"
              size="lg"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full px-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {navT("back")}
            </Button>

            {currentStep === stepsConfig.length - 1 ? (
              <Button
                onClick={handleProceedToCheckout}
                disabled={isCreatingOrder}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 shadow-lg shadow-teal-200 hover:shadow-xl transition-all"
              >
                {isCreatingOrder ? (
                  <>Processing...</>
                ) : (
                  <>
                    {t("proceedButton")}{" "}
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={currentFormId ? undefined : nextStep}
                type={currentFormId ? "submit" : "button"}
                form={currentFormId}
                size="lg"
                className="bg-gray-900 hover:bg-black text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
              >
                {navT("next")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right: Preview Area */}
        <div
          className={cn(
            "w-full lg:w-3/5 xl:w-[55%] lg:flex lg:flex-row bg-gray-100/80 relative border-l border-gray-200 shadow-inner flex flex-col",
            activeTab === "edit" ? "hidden lg:flex" : "flex",
          )}
        >
          {/* Mobile Preview Mode indicator */}
          <div className="bg-white shrink-0 rounded-xl shadow-sm border border-gray-200 p-3 m-4 mb-2 lg:hidden flex items-center gap-2 justify-center text-sm text-gray-500">
            <Eye className="w-4 h-4" /> Live Preview Mode
          </div>

          {/* 1. Main Preview Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-12 relative scroll-smooth no-scrollbar">
            <div className="flex flex-col items-center min-h-full">
              {/* Live Preview Container */}
              <div className="w-full flex justify-center section-mobile-preview origin-top transition-all duration-300 z-10 scale-[0.7] sm:scale-[0.8] md:scale-[0.85] lg:scale-[0.8] xl:scale-[0.85] 2xl:scale-95 mb-60 lg:mb-20">
                {/* On mobile, only render preview if active to save CPU/Memory. 
                    Using 'activeTab' check to completely unmount it. */}
                {typeof window !== "undefined" && window.innerWidth < 1024 ? (
                  activeTab === "preview" && <CVPreview />
                ) : (
                  <CVPreview />
                )}
              </div>
            </div>
          </div>

          {/* 2. PC-Only Integrated Vertical Sidebar */}
          <div className="hidden lg:flex w-28 bg-white border-l border-gray-200 p-3 flex-col gap-4 sticky top-0 h-screen overflow-y-auto no-scrollbar shrink-0">
            <div className="flex items-center justify-center opacity-40 mb-2 mt-4">
              <div className="w-1 h-8 bg-gray-300 rounded-full" />
            </div>
            <TemplateSelector layout="vertical" />
          </div>

          {/* 3. Mobile-Only Floating Bottom Dock - REMOVED (integrated into Review step) */}
        </div>
      </div>
    </div>
  );
}

export default function CVBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col">
        <CVProvider>
          <CVWizardContent />
        </CVProvider>
      </main>
    </div>
  );
}
