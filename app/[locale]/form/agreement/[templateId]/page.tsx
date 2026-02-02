"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AGREEMENT_TEMPLATES,
  AgreementTemplate,
  AgreementVariable,
} from "@/config/agreements";
import Header from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Loader2, ArrowLeft, CheckCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgreementFormPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<AgreementTemplate | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Initialize template and default form data
  useEffect(() => {
    if (params.templateId) {
      const found = AGREEMENT_TEMPLATES.find((t) => t.id === params.templateId);
      if (found) {
        setTemplate(found);

        // Initialize form data
        setFormData({});
      }
    }
  }, [params.templateId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (variable: AgreementVariable, value: any) => {
    let finalValue = value;

    // For checkboxes, handle truthy/falsy values if provided
    if (variable.type === "checkbox") {
      if (variable.truthyValue || variable.falsyValue) {
        finalValue = value
          ? variable.truthyValue || "Yes"
          : variable.falsyValue || "No";
      }
    }

    setFormData((prev) => ({ ...prev, [variable.key]: finalValue }));
  };

  const getPreviewContent = () => {
    if (!template) return "";
    let content = template.content;

    // Process conditional blocks: {?KEY=VALUE}content{/?} or {?KEY}content{/?}
    const conditionalRegex = /{\?(\w+)(?:=([^}]+))?}([\s\S]*?){\/\?}/g;
    content = content.replace(
      conditionalRegex,
      (match, key, value, innerContent) => {
        const actualValue = formData[key];
        // Check condition
        const shouldShow = value ? actualValue == value : !!actualValue;

        return shouldShow ? innerContent : "";
      },
    );

    // Sort variables by length descending to prevent partial replacements if keys overlap
    const sortedVars = [...template.variables].sort(
      (a, b) => b.key.length - a.key.length,
    );

    sortedVars.forEach((v) => {
      const val = formData[v.key];

      // Use a distinct placeholder style for empty values to guide the user
      const replacement = val
        ? val
        : `<span class="bg-yellow-100 text-yellow-800 px-1 rounded mx-0.5">{${v.label}}</span>`;
      // Replace all occurrences
      content = content.split(`{${v.key}}`).join(replacement);
    });

    // Convert newlines to breaks for HTML rendering
    return content.replace(/\n/g, "<br/>");
  };

  const handleProceedToPayment = async () => {
    if (!template) return;
    setIsCreatingOrder(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: `agreement:${template.id}`,
          form_data: {
            ...formData,
            // Include template metadata for easier processing later
            _templateId: template.id,
            _templateTitle: template.title,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      localStorage.setItem("paperless.orderId", data.orderId);
      // Redirect to same checkout flow as CV
      router.push("/checkout");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to proceed. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-teal-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 overflow-y-auto bg-white border-r">
          <div className="max-w-xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 pl-0 hover:bg-transparent hover:text-teal-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {template.title}
            </h1>
            <p className="text-gray-500 mb-8">{template.description}</p>

            <div className="space-y-6">
              {template.variables.map((variable) => {
                // Handle conditional visibility
                if (variable.dependsOn) {
                  const dependencyValue = formData[variable.dependsOn];
                  // If dependency is a checkbox value (truthyValue/falsyValue or boolean)
                  const dependencyVar = template.variables.find(
                    (v) => v.key === variable.dependsOn,
                  );

                  let isVisible = !!dependencyValue;
                  if (
                    dependencyVar?.type === "checkbox" &&
                    dependencyVar.falsyValue
                  ) {
                    isVisible = dependencyValue !== dependencyVar.falsyValue;
                  }

                  if (!isVisible) return null;
                }

                return (
                  <div key={variable.key}>
                    <label
                      className={cn(
                        "block text-sm font-medium text-gray-700 mb-1",
                        variable.type === "checkbox" &&
                          "flex items-center gap-2 cursor-pointer",
                      )}
                    >
                      {variable.type === "checkbox" ? (
                        <>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            checked={
                              !!formData[variable.key] &&
                              formData[variable.key] !== variable.falsyValue
                            }
                            onChange={(e) =>
                              handleInputChange(variable, e.target.checked)
                            }
                          />
                          <span>{variable.label}</span>
                        </>
                      ) : (
                        <>
                          {variable.label}{" "}
                          {variable.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </>
                      )}
                    </label>

                    {variable.type === "textarea" ? (
                      <textarea
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-h-[100px]"
                        placeholder={variable.placeholder}
                        value={formData[variable.key] || ""}
                        onChange={(e) =>
                          handleInputChange(variable, e.target.value)
                        }
                      />
                    ) : variable.type === "checkbox" ? null : (
                      <Input
                        type={variable.type}
                        placeholder={variable.placeholder}
                        value={formData[variable.key] || ""}
                        onChange={(e) =>
                          handleInputChange(variable, e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-teal-700">
                  {template.price} ETB
                </span>
              </div>

              <Button
                onClick={handleProceedToPayment}
                disabled={isCreatingOrder}
                className="w-full py-6 text-lg bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200"
              >
                {isCreatingOrder ? (
                  <>Processing...</>
                ) : (
                  <>
                    Keep and Pay <CheckCircle className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="hidden lg:block w-1/2 bg-gray-100 p-8 overflow-y-auto">
          {/* Notice Banner */}
          <div className="max-w-[210mm] mx-auto mb-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-sm">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-700 mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  ማስታወሻ: ይህ የመጨረሻው አይደለም
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  የመጨረሻው ውል በትክክለኛ PDF ቅርፀ ይቀርባል እና የተሻለ አቀማመጥ ይኖረዋል።
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-[20mm] text-base leading-relaxed text-justify">
            {/* This replicates an A4 paper look */}
            <div
              className="preview-content font-serif text-gray-800 whitespace-pre-wrap select-none"
              onContextMenu={(e) => e.preventDefault()}
              dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
            />
          </div>
          <div className="flex justify-center mt-6 text-sm text-gray-500">
            <Eye className="w-4 h-4 mr-2" /> Live Preview
          </div>
        </div>
      </div>
    </div>
  );
}
