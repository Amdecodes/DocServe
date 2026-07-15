"use client"

import { useCV } from "@/components/cv/CVContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export function Step5_Review({ 
  onGenerateAI, 
  isGenerating 
}: { 
  onGenerateAI?: () => void; 
  isGenerating?: boolean; 
}) {
  const { cvData, updateCVData } = useCV()
  const t = useTranslations("ReviewStep")

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target
     updateCVData("personalInfo", { [name]: value })
  }

  return (
    <div className="space-y-6">
        <div className="text-center py-4">
            <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold">{t("title")}</h2>
            <p className="text-gray-600 max-w-md mx-auto">
                {t("subtitle")}
            </p>
        </div>

        {/* AI Generation Section */}
        <div className="bg-linear-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-xl p-6 text-center shadow-xs">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">✨ AI Professional Enhancement</h3>
            <p className="text-indigo-700/80 mb-6 max-w-lg mx-auto text-sm">
                Unlock the full potential of your CV. Our AI will optimize your professional summary, rewrite your experience bullets for maximum impact, and draft a tailored cover letter.
            </p>
            
            <button
                onClick={onGenerateAI}
                disabled={isGenerating || cvData.aiMetadata?.generated}
                className={`
                    relative px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all
                    ${isGenerating 
                        ? "bg-indigo-300 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200"
                    }
                `}
            >
                {isGenerating ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Optimizing your profile...
                    </span>
                ) : cvData.aiMetadata?.generated ? (
                    <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Optimization Complete
                    </span>
                ) : (
                    "✨ Generate AI Optimization"
                )}
            </button>
            
            {cvData.aiMetadata?.generated && (
                <p className="text-green-600 text-xs mt-3 font-medium animate-in fade-in slide-in-from-bottom-2">
                    Success! Review your changes in the preview.
                </p>
            )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-lg text-sm">
             <strong>{t("noteLabel")}</strong> {t("noteText")}
        </div>
        
        <div className="flex justify-end pt-4">
             {/* The button is in page.tsx, so we don't need it here, but page.tsx needs updates too */}
        </div>
    </div>
  )
}
