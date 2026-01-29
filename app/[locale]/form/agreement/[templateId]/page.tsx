"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AGREEMENT_TEMPLATES, AgreementTemplate } from "@/config/agreements";
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
  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getPreviewContent = () => {
    if (!template) return "";
    let content = template.content;

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
              {template.variables.map((variable) => (
                <div key={variable.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {variable.label}{" "}
                    {variable.required && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  {variable.type === "textarea" ? (
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-h-[100px]"
                      placeholder={variable.placeholder}
                      value={formData[variable.key] || ""}
                      onChange={(e) =>
                        handleInputChange(variable.key, e.target.value)
                      }
                    />
                  ) : (
                    <Input
                      type={variable.type}
                      placeholder={variable.placeholder}
                      value={formData[variable.key] || ""}
                      onChange={(e) =>
                        handleInputChange(variable.key, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
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
          <div className="max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-[20mm] text-base leading-relaxed text-justify">
            {/* This replicates an A4 paper look */}
            <div
              className="preview-content font-serif text-gray-800 whitespace-pre-wrap"
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
