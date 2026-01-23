// Template Registry - Single source of truth for all CV templates
// To add a new template:
// 1. Create the layout component in components/cv/preview/layouts/
// 2. Add an entry to this registry

import { ComponentType } from "react";
import { CVData, CoverLetterData, PersonalInfo } from "@/types/cv";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: "professional" | "creative" | "simple" | "executive";
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  previewImage?: string;
  // New: layout importers for both resume and cover letter
  resumeComponent: () => Promise<{ default: ComponentType<{ data: CVData }> }>;
  coverLetterComponent: () => Promise<{
    default: ComponentType<{
      coverLetter: CoverLetterData;
      personalInfo: PersonalInfo;
    }>;
  }>;
}

// Template metadata for the gallery
export const TEMPLATES: TemplateConfig[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, organized layout perfect for corporate roles.",
    tags: ["Professional", "Clean"],
    category: "professional",
    colorScheme: {
      primary: "#0d9488", // teal-600
      secondary: "#f3f4f6", // gray-100
      accent: "#111827", // gray-900
    },
    resumeComponent: () =>
      import("@/components/cv/preview/layouts/Modern").then((m) => ({
        default: m.ModernLayout,
      })),
    coverLetterComponent: () =>
      import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
        default: m.ModernCoverLetter,
      })),
  },
  {
    id: "professional",
    name: "Executive Blue",
    description: "Timeline-based layout with a strong executive sidebar.",
    tags: ["Executive", "Timeline"],
    category: "executive",
    colorScheme: {
      primary: "#2c3e50",
      secondary: "#e5e7eb",
      accent: "#1f2937",
    },
    resumeComponent: () =>
      import("@/components/cv/preview/layouts/Professional").then((m) => ({
        default: m.ProfessionalLayout,
      })),
    coverLetterComponent: () =>
      import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
        default: m.ModernCoverLetter,
      })), // fallback for now
  },
  {
    id: "classic",
    name: "Timeless Classic",
    description: "Traditional layout that never goes out of style.",
    tags: ["Traditional", "Simple"],
    category: "simple",
    colorScheme: {
      primary: "#1f2937",
      secondary: "#ffffff",
      accent: "#374151",
    },
    resumeComponent: () =>
      import("@/components/cv/preview/layouts/Classic").then((m) => ({
        default: m.ClassicLayout,
      })),
    coverLetterComponent: () =>
      import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
        default: m.ModernCoverLetter,
      })), // fallback for now
  },
];

// Dynamic import map for lazy loading (used by both Preview and PDF renderer)
export const templateComponents: Record<
  string,
  {
    resume: () => Promise<{ default: ComponentType<{ data: CVData }> }>;
    coverLetter: () => Promise<{
      default: ComponentType<{
        coverLetter: CoverLetterData;
        personalInfo: PersonalInfo;
      }>;
    }>;
  }
> = {
  modern: {
    resume: () =>
      import("@/components/cv/preview/layouts/Modern").then((m) => ({
        default: m.ModernLayout,
      })),
    coverLetter: () =>
      import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
        default: m.ModernCoverLetter,
      })),
  },
  professional: {
    resume: () =>
      import("@/components/cv/preview/layouts/Professional").then((m) => ({
        default: m.ProfessionalLayout,
      })),
    coverLetter: () =>
      import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
        default: m.ModernCoverLetter,
      })), // fallback for now
  },
  classic: {
    resume: () =>
      import("@/components/cv/preview/layouts/Classic").then((m) => ({
        default: m.ClassicLayout,
      })),
    coverLetter: () =>
      import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
        default: m.ModernCoverLetter,
      })), // fallback for now
  },
};

// Helper to get template config by ID
export function getTemplateConfig(id: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

// Helper to filter templates by category
export function getTemplatesByCategory(
  category: TemplateConfig["category"],
): TemplateConfig[] {
  return TEMPLATES.filter((t) => t.category === category);
}

// Default template ID
export const DEFAULT_TEMPLATE = "modern";

// Template categories for filtering in gallery
export const TEMPLATE_CATEGORIES = [
  { id: "all", name: "All Templates" },
  { id: "professional", name: "Professional" },
  { id: "executive", name: "Executive" },
  { id: "creative", name: "Creative" },
  { id: "simple", name: "Simple" },
] as const;
