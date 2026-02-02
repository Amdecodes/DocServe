"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  LanguageItem,
  VolunteerItem,
  AIMetadata,
  CVData,
  CoverLetterData,
} from "@/types/cv";

export type {
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  CVData,
  CoverLetterData,
};

interface CVContextType {
  cvData: CVData;
  updateCVData: (
    section: keyof CVData,
    data:
      | Partial<PersonalInfo>
      | string
      | string[]
      | ExperienceItem[]
      | EducationItem[]
      | SkillItem[]
      | LanguageItem[]
      | VolunteerItem[]
      | Partial<CoverLetterData>
      | AIMetadata
      | { id: string },
  ) => void;
  selectedTemplate: string;
  setTemplate: (id: string) => void;
  // Helpers for arrays
  addItem: (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    item:
      | Partial<ExperienceItem>
      | Partial<EducationItem>
      | Partial<SkillItem>
      | Partial<LanguageItem>
      | Partial<VolunteerItem>
      | { id?: string },
  ) => void;
  removeItem: (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    id: string,
  ) => void;
  updateItem: (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    id: string,
    data:
      | Partial<ExperienceItem>
      | Partial<EducationItem>
      | Partial<SkillItem>
      | Partial<LanguageItem>
      | Partial<VolunteerItem>
      | { id?: string },
  ) => void;
  // Cover Letter helpers
  updateCoverLetter: (data: Partial<CoverLetterData>) => void;
}

const defaultCVData: CVData = {
  documentLanguage: "en", // Default to English
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    jobTitle: "",
    headline: "",
    linkedin: "",
    website: "",
    dateOfBirth: "",
  },
  summary: "",
  coreCompetencies: [],
  experience: [],
  education: [],
  skills: [],
  languages: [],
  volunteer: [],
  coverLetter: {
    recipientName: "",
    companyName: "",
    jobTitle: "",
    letterBody: "",
    tone: "Neutral",
  },
};

const CVContext = createContext<CVContextType | undefined>(undefined);

import { DEFAULT_TEMPLATE, TEMPLATES } from "@/config/templates";

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  const isMountedRef = useRef(false);

  const searchParams = useSearchParams();
  const templateFromUrl = searchParams.get("template");

  // Track mount state and load persisted data (Async to avoid blocking)
  useEffect(() => {
    isMountedRef.current = true;

    const loadData = async () => {
      // 1. Immediate Phase: Load structure (Template)
      if (templateFromUrl && TEMPLATES.some((t) => t.id === templateFromUrl)) {
        setSelectedTemplate(templateFromUrl);
      } else {
        const savedTemplate = localStorage.getItem("paperless.selectedTemplate");
        if (savedTemplate && TEMPLATES.some((t) => t.id === savedTemplate)) {
          setSelectedTemplate(savedTemplate);
        }
      }

      // 2. Delayed Phase: Load heavy content data
      // This ensures the page is interactive and the template shell is ready first.
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        const savedCV = localStorage.getItem("paperless.cvData");
        if (savedCV) {
          const parsed = JSON.parse(savedCV) as CVData;
          setCvData(prev => ({
            ...parsed,
            documentLanguage: "en",
          }));
          
          if (!templateFromUrl && parsed.selectedTemplate && TEMPLATES.some((t) => t.id === parsed.selectedTemplate)) {
            setSelectedTemplate(parsed.selectedTemplate);
          }
        }
      } catch (e) {
        console.error("Failed to load CV data", e);
      }
    };

    loadData();
  }, [templateFromUrl]);

  // Persist template selection to localStorage
  useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem("paperless.selectedTemplate", selectedTemplate);
    }
  }, [selectedTemplate]);

  // Debounced persistence of cvData to localStorage
  useEffect(() => {
    if (isMountedRef.current) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("paperless.cvData", JSON.stringify(cvData));
      }, 1000); // 1s debounce for global state persistence
      return () => clearTimeout(timeoutId);
    }
  }, [cvData]);

  const updateCVData = useCallback((
    section: keyof CVData,
    data:
      | Partial<PersonalInfo>
      | string
      | string[]
      | ExperienceItem[]
      | EducationItem[]
      | SkillItem[]
      | LanguageItem[]
      | VolunteerItem[]
      | Partial<CoverLetterData>
      | AIMetadata
      | { id: string },
  ) => {
    setCvData((prev) => ({
      ...prev,
      [section]:
        section === "personalInfo"
          ? { ...prev.personalInfo, ...(data as Partial<PersonalInfo>) }
          : section === "coverLetter"
            ? {
                ...(prev.coverLetter || {}),
                ...(data as Partial<CoverLetterData>),
              }
            : data,
    }));
  }, []);

  const addItem = useCallback((
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    item:
      | Partial<ExperienceItem>
      | Partial<EducationItem>
      | Partial<SkillItem>
      | Partial<LanguageItem>
      | Partial<VolunteerItem>
      | { id?: string },
  ) => {
    const newItem = { ...item, id: Date.now().toString() };
    setCvData((prev) => ({
      ...prev,
      [section]: [...((prev[section] as Array<any>) ?? []), newItem],
    }));
  }, []);

  const removeItem = useCallback((
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    id: string,
  ) => {
    setCvData((prev) => ({
      ...prev,
      [section]: ((prev[section] as Array<{ id: string }>) ?? []).filter(
        (item) => item.id !== id,
      ),
    }));
  }, []);

  const updateItem = useCallback((
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    id: string,
    data:
      | Partial<ExperienceItem>
      | Partial<EducationItem>
      | Partial<SkillItem>
      | Partial<LanguageItem>
      | Partial<VolunteerItem>
      | { id?: string },
  ) => {
    setCvData((prev) => ({
      ...prev,
      [section]: ((prev[section] as Array<{ id: string }>) ?? []).map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
    }));
  }, []);

  const updateCoverLetter = useCallback((data: Partial<CoverLetterData>) => {
    setCvData((prev) => ({
      ...prev,
      coverLetter: { ...prev.coverLetter!, ...data },
    }));
  }, []);

  const setTemplate = useCallback((id: string) => {
    setSelectedTemplate(id);
    // Sync to cvData explicitly
    setCvData(prev => ({ ...prev, selectedTemplate: id }));
  }, []);

  return (
    <CVContext.Provider
      value={{
        cvData,
        updateCVData,
        selectedTemplate,
        setTemplate,
        addItem,
        removeItem,
        updateItem,
        updateCoverLetter,
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error("useCV must be used within a CVProvider");
  }
  return context;
}
