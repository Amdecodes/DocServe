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
  CVData,
} from "@/types/cv";

export type { PersonalInfo, ExperienceItem, EducationItem, SkillItem, CVData };

interface CVContextType {
  cvData: CVData;
  updateCVData: (
    section: keyof CVData,
    data:
      | PersonalInfo
      | string
      | string[]
      | ExperienceItem[]
      | EducationItem[]
      | SkillItem[]
      | LanguageItem[] // Add this line
      | { id: string },
  ) => void;
  selectedTemplate: string;
  setTemplate: (id: string) => void;
  // Helpers for arrays
  addItem: (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    item: ExperienceItem | EducationItem | SkillItem | { id: string },
  ) => void;
  removeItem: (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    id: string,
  ) => void;
  updateItem: (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    id: string,
    data: ExperienceItem | EducationItem | SkillItem | { id: string },
  ) => void;
}

const defaultCVData: CVData = {
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
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const saved = localStorage.getItem("paperless.selectedTemplate");
    return saved || "modern";
  });
  const isMountedRef = useRef(false);

  // Track mount state
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Persist template selection to localStorage
  useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem("paperless.selectedTemplate", selectedTemplate);
    }
  }, [selectedTemplate]);

  const updateCVData = (
    section: keyof CVData,
    data:
      | PersonalInfo
      | string
      | string[]
      | ExperienceItem[]
      | EducationItem[]
      | SkillItem[]
      | LanguageItem[] // Add this line
      | { id: string },
  ) => {
    setCvData((prev) => ({
      ...prev,
      [section]:
        section === "personalInfo"
          ? { ...prev.personalInfo, ...(data as Partial<PersonalInfo>) }
          : data,
    }));
  };

  const addItem = (
    section: "experience" | "education" | "skills" | "languages" | "volunteer",
    item: ExperienceItem | EducationItem | SkillItem | { id: string },
  ) => {
    const newItem = { ...item, id: Date.now().toString() };
    setCvData((prev) => ({
      ...prev,
      [section]: [
        ...((prev[section] as Array<
          ExperienceItem | EducationItem | SkillItem | { id: string }
        >) ?? []),
        newItem,
      ],
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
    data: ExperienceItem | EducationItem | SkillItem | { id: string },
  ) => {
    setCvData((prev) => ({
      ...prev,
      [section]: ((prev[section] as Array<{ id: string }>) ?? []).map((item) =>
        item.id === id ? { ...item, ...data } : item,
      ),
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
