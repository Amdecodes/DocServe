// Types for CV Data
// Moved from CVContext to avoid "use client" pollution in server components

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  city: string;
  country: string;
  jobTitle: string;
  headline?: string;
  linkedin?: string;
  website?: string;
  photo?: string;
  dateOfBirth?: string;
  summary?: string; // Added summary here if it's sometimes part of personal info, though context separates it
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string; // legacy block text
  achievements: string[]; // bullet points
  current: boolean;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  city: string;
  gpa?: string;
  honors?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category?: "Technical" | "Soft" | "Tools";
  level?: string; // Beginner, Intermediate, Expert
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic";
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  description: string;
}

export type CoverLetterTone = "Formal" | "Neutral" | "Confident";

// Document language (CV content is English-only)
export type DocumentLanguage = "en";

export interface CoverLetterData {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  letterBody: string;
  tone: CoverLetterTone;
}

export interface AIMetadata {
  generated: boolean;
  generatedAt?: string;
  orderId?: string;
}

export interface CVData {
  documentLanguage: DocumentLanguage; // CVs are generated in English
  selectedTemplate?: string; // Track which template was selected for this data
  personalInfo: PersonalInfo;
  summary: string; // User's brief notes before payment, AI-generated after
  summaryNotes?: string; // Original user input for AI context
  coreCompetencies: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  volunteer: VolunteerItem[];
  coverLetter?: CoverLetterData;
  aiMetadata?: AIMetadata; // Track AI generation status
}
