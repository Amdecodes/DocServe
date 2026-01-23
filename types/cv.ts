// Types for CV Data
// Moved from CVContext to avoid "use client" pollution in server components

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  jobTitle: string;
  headline?: string;
  linkedin?: string;
  website?: string;
  photo?: string;
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

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  coreCompetencies: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  volunteer: VolunteerItem[];
}
