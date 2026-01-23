"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CVProvider, useCV } from "../../../../components/cv/CVContext";
import Header from "../../../../components/landing/Header";
import { CVPreview } from "../../../../components/cv/preview/CVPreview";
import { Stepper } from "../../../../components/ui/Stepper";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Steps
// Steps
import { Step1_Personal } from "../../../../components/cv/form/steps/Step1_Personal";
import { Step2_Education } from "../../../../components/cv/form/steps/Step2_Education";
import { Step3_Experience } from "../../../../components/cv/form/steps/Step3_Experience";
import { Step4_Skills } from "../../../../components/cv/form/steps/Step4_Skills";
import { Step5_Extras } from "../../../../components/cv/form/steps/Step5_Extras";
import { Step5_Review } from "../../../../components/cv/form/steps/Step5_Review";

function CVWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const { setTemplate, cvData, selectedTemplate } = useCV();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const t = useTranslations("ReviewStep");

  const navT = useTranslations("CVNavigation");
  const STEPS = [
    navT("steps.personal"),
    navT("steps.education"),
    navT("steps.experience"),
    navT("steps.skills"),
    navT("steps.extras"),
    navT("steps.review"),
  ];

  useEffect(() => {
    if (templateId) {
      setTemplate(templateId);
    }
  }, [templateId, setTemplate]);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
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

  // Helper to gather data for order creation
  const gatherCVFormData = () => {
    // Phase 1: Ensure architecture consistency
    // We use the context state which is the single source of truth for the Preview and now the PDF
    return {
      personalInfo: cvData.personalInfo,
      education: cvData.education,
      experience: cvData.experience,
      skills: cvData.skills,
      summary: cvData.summary,
      languages: cvData.languages, // Add languages
      volunteer: cvData.volunteer, // Add volunteer
      selectedTemplate: selectedTemplate, // Keep template selection
    };
  };

  const handleProceedToCheckout = async () => {
    setIsCreatingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: "premium_resume",
          form_data: gatherCVFormData(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();

      // Save ID and redirect
      localStorage.setItem("paperless.orderId", data.orderId);
      router.push("/checkout");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Determine current form ID for steps that are refactored to use HTML forms
  // This allows the external "Next" button to trigger the internal form submission
  const getFormId = () => {
    switch (currentStep) {
      case 0:
        return "step1-personal-form";
      // Future steps will be added here
      default:
        return undefined;
    }
  };

  const currentFormId = getFormId();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // Pass onNext handler to refactored steps
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
        return <Step5_Review />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Mobile Tab Toggles */}
      <div className="lg:hidden bg-white border-b flex">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 ${
            activeTab === "edit"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Edit Form
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 text-sm font-medium border-b-2 ${
            activeTab === "preview"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Live Preview
        </button>
      </div>

      <div className="flex flex-1 lg:flex-row overflow-hidden relative">
        {/* Left: Form Area */}
        <div
          className={`w-full lg:w-3/5 bg-gray-50 flex flex-col h-full ${
            activeTab === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Stepper Header (Fixed at top) */}
          <div className="bg-white border-b px-4 py-4 md:px-6 overflow-x-auto shrink-0 z-10">
            <Stepper
              steps={STEPS}
              currentStep={currentStep}
              className="min-w-max"
            />
          </div>

          {/* Form Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-2xl mx-auto pb-10">{renderStep()}</div>
          </div>

          {/* Footer Navigation (Fixed at bottom) */}
          <div className="bg-white border-t p-4 shrink-0 flex justify-between z-10">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {navT("back")}
            </Button>

            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleProceedToCheckout}
                disabled={isCreatingOrder}
                className="bg-green-600 hover:bg-green-700 text-white min-w-50"
              >
                {isCreatingOrder ? <>Processing...</> : t("proceedButton")}
              </Button>
            ) : (
              <Button
                onClick={currentFormId ? undefined : nextStep}
                type={currentFormId ? "submit" : "button"}
                form={currentFormId}
              >
                {navT("next")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right: Preview Area */}
        <div
          className={`w-full lg:w-2/5 bg-gray-100 lg:bg-gray-200 p-4 lg:p-8 border-l border-gray-300 relative overflow-y-auto ${
            activeTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="min-h-full flex justify-center lg:block sticky lg:top-8">
            <CVPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CVBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CVProvider>
          <CVWizardContent />
        </CVProvider>
      </main>
    </div>
  );
}
