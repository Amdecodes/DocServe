"use client";

import { Locale } from "@/config/i18n";
import { useTranslations } from "next-intl";

interface LanguageSelectionProps {
  selectedLanguage: Locale;
  onLanguageSelect: (language: Locale) => void;
  onContinue: () => void;
}

export function LanguageSelection({
  selectedLanguage,
  onLanguageSelect,
  onContinue,
}: LanguageSelectionProps) {
  const t = useTranslations("LanguageSelection");

  const handleLanguageSelect = (lang: Locale) => {
    console.log(`[LanguageSelection] User selected: ${lang}`);
    onLanguageSelect(lang);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <svg
              className="w-8 h-8 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-sm">{t("subtitle")}</p>
        </div>

        {/* Language Options */}
        <div className="space-y-3 mb-8">
          {/* English Option */}
          <button
            type="button"
            onClick={() => handleLanguageSelect("en")}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
              selectedLanguage === "en"
                ? "border-teal-500 bg-teal-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedLanguage === "en"
                  ? "border-teal-500"
                  : "border-gray-300"
              }`}
            >
              {selectedLanguage === "en" && (
                <div className="w-3 h-3 rounded-full bg-teal-500" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900">
                {t("englishOption")}
              </p>
              <p className="text-sm text-gray-500">{t("englishDesc")}</p>
            </div>
            <span className="text-2xl">🇬🇧</span>
          </button>

          {/* Amharic Option */}
          <button
            type="button"
            onClick={() => handleLanguageSelect("am")}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
              selectedLanguage === "am"
                ? "border-teal-500 bg-teal-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedLanguage === "am"
                  ? "border-teal-500"
                  : "border-gray-300"
              }`}
            >
              {selectedLanguage === "am" && (
                <div className="w-3 h-3 rounded-full bg-teal-500" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900">
                {t("amharicOption")}
              </p>
              <p className="text-sm text-gray-500">{t("amharicDesc")}</p>
            </div>
            <span className="text-2xl">🇪🇹</span>
          </button>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {t("continue")}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Note */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-xs text-gray-500">{t("aiGenerationNote")}</p>
          <p className="text-[11px] text-gray-400">
            {t("websiteLanguageNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
