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
  DocumentLanguage,
} from "@/types/cv";

export type {
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  CVData,
  CoverLetterData,
  DocumentLanguage,
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
  // Language selection
  setDocumentLanguage: (language: DocumentLanguage) => void;
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

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const isMountedRef = useRef(false);

  // Track mount state and load persisted data
  useEffect(() => {
    isMountedRef.current = true;

    // Load template
    const savedTemplate = localStorage.getItem("paperless.selectedTemplate");
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }

    // Load cvData
    try {
      const savedCV = localStorage.getItem("paperless.cvData");
      if (savedCV) {
        setCvData(JSON.parse(savedCV));
      }
    } catch (e) {
      console.error("Failed to load CV data", e);
    }
  }, []);

  // Persist template selection to localStorage
  useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem("paperless.selectedTemplate", selectedTemplate);
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

  const setDocumentLanguage = (language: DocumentLanguage) => {
    setCvData((prev) => ({
      ...prev,
      documentLanguage: language,
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
        setDocumentLanguage,
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
