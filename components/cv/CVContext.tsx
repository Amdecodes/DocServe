"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
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

  // Track mount state and load persisted data
  useEffect(() => {
    isMountedRef.current = true;

    // Load template from dedicated key first
    const savedTemplate = localStorage.getItem("paperless.selectedTemplate");
    // Validate that the saved template actually exists in our current list
    // If not (e.g. we removed it), fall back to default
    const isValid = TEMPLATES.some((t: any) => t.id === savedTemplate);
    
    if (savedTemplate && isValid) {
      setSelectedTemplate(savedTemplate);
    }

    // Load cvData
    try {
      const savedCV = localStorage.getItem("paperless.cvData");
      if (savedCV) {
        const parsed = JSON.parse(savedCV) as CVData;
        setCvData({
          ...parsed,
          // Force English CV generation even if older data stored another value
          documentLanguage: "en",
        });
        
        // ALSO sync selectedTemplate from cvData if it exists and is valid
        // This ensures parity between the two storage locations
        if (parsed.selectedTemplate && TEMPLATES.some((t: any) => t.id === parsed.selectedTemplate)) {
          setSelectedTemplate(parsed.selectedTemplate);
        }
      }
    } catch (e) {
      console.error("Failed to load CV data", e);
    }
  }, []);

  // Persist template selection to localStorage and cvData
  useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem("paperless.selectedTemplate", selectedTemplate);
      // Sync to cvData as well so it travels with the payload
      setCvData(prev => ({ ...prev, selectedTemplate }));
    }
  }, [selectedTemplate]);

  // Persist cvData to localStorage
  useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem("paperless.cvData", JSON.stringify(cvData));
    }
  }, [cvData]);

  const updateCVData = (
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
  };

  const addItem = (
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
  };

  const removeItem = (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    id: string,
  ) => {
    setCvData((prev) => ({
      ...prev,
      [section]: ((prev[section] as Array<{ id: string }>) ?? []).filter(
        (item) => item.id !== id,
      ),
    }));
  };

  const updateItem = (
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
  };

  const updateCoverLetter = (data: Partial<CoverLetterData>) => {
    setCvData((prev) => ({
      ...prev,
      coverLetter: { ...prev.coverLetter!, ...data },
    }));
  };

  const setTemplate = (id: string) => {
    setSelectedTemplate(id);
  };

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
      {children}
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
