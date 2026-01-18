"use client"

import React, { createContext, useContext, useState } from "react"


// Types
export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  country: string
  jobTitle: string
  photo?: string
}

export interface ExperienceItem {
  id: string
  jobTitle: string
  company: string
  startDate: string
  endDate: string
  description: string
  current: boolean
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
  city: string
}

export interface SkillItem {
  id: string
  name: string
  level?: string // Beginner, Intermediate, Expert
}

export interface CVData {
  personalInfo: PersonalInfo
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillItem[]
}

interface CVContextType {
  cvData: CVData
  updateCVData: (section: keyof CVData, data: any) => void
  selectedTemplate: string
  setTemplate: (id: string) => void
  // Helpers for arrays
  addItem: (section: 'experience' | 'education' | 'skills', item: any) => void
  removeItem: (section: 'experience' | 'education' | 'skills', id: string) => void
  updateItem: (section: 'experience' | 'education' | 'skills', id: string, data: any) => void
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
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
}

const CVContext = createContext<CVContextType | undefined>(undefined)

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCvData] = useState<CVData>(defaultCVData)
  const [selectedTemplate, setSelectedTemplate] = useState("modern")

  const updateCVData = (section: keyof CVData, data: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: section === 'personalInfo' 
        ? { ...prev.personalInfo, ...(data as Partial<PersonalInfo>) } 
        : data,
    }))
  }

  const addItem = (section: 'experience' | 'education' | 'skills', item: any) => {
    const newItem = { ...item, id: Date.now().toString() }
    setCvData((prev) => ({
      ...prev,
      [section]: [...(prev[section] as any[]), newItem],
    }))
  }

  const removeItem = (section: 'experience' | 'education' | 'skills', id: string) => {
    setCvData((prev) => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((item) => item.id !== id),
    }))
  }

  const updateItem = (section: 'experience' | 'education' | 'skills', id: string, data: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: (prev[section] as any[]).map((item) => (item.id === id ? { ...item, ...data } : item)),
    }))
  }

  const setTemplate = (id: string) => {
    setSelectedTemplate(id)
  }

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
  )
}

export function useCV() {
  const context = useContext(CVContext)
  if (context === undefined) {
    throw new Error("useCV must be used within a CVProvider")
  }
  return context
}
