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
  // {
  //   id: "modern",
  //   name: "Modern Professional",
  //   description: "Clean, organized layout perfect for corporate roles.",
  //   tags: ["Professional", "Clean"],
  //   category: "professional",
  //   colorScheme: {
  //     primary: "#0d9488", // teal-600
  //     secondary: "#f3f4f6", // gray-100
  //     accent: "#111827", // gray-900
  //   },
  //   resumeComponent: () =>
  //     import("@/components/cv/preview/layouts/Modern").then((m) => ({
  //       default: m.ModernLayout,
  //     })),
  //   coverLetterComponent: () =>
  //     import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
  //       default: m.ModernCoverLetter,
  //     })),
  // },
  // {
  //   id: "professional",
  //   name: "Executive Blue",
  //   description: "Timeline-based layout with a strong executive sidebar.",
  //   tags: ["Executive", "Timeline"],
  //   category: "executive",
  //   colorScheme: {
  //     primary: "#2c3e50",
  //     secondary: "#e5e7eb",
  //     accent: "#1f2937",
  //   },
  //   resumeComponent: () =>
  //     import("@/components/cv/preview/layouts/Professional").then((m) => ({
  //       default: m.ProfessionalLayout,
  //     })),
  //   coverLetterComponent: () =>
  //     import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
  //       default: m.ModernCoverLetter,
  //     })), // fallback for now
  // },
  // {
  //   id: "classic",
  //   name: "Timeless Classic",
  //   description: "Traditional layout that never goes out of style.",
  //   tags: ["Traditional", "Simple"],
  //   category: "simple",
  //   colorScheme: {
  //     primary: "#1f2937",
  //     secondary: "#ffffff",
  //     accent: "#374151",
  //   },
  //   resumeComponent: () =>
  //     import("@/components/cv/preview/layouts/Classic").then((m) => ({
  //       default: m.ClassicLayout,
  //     })),
  //   coverLetterComponent: () =>
  //     import("@/components/cv/preview/layouts/ModernCoverLetter").then((m) => ({
  //       default: m.ModernCoverLetter,
  //     })), // fallback for now
  // },
  {
    id: "golden",
    name: "Golden Executive",
    description: "Premium dark blue and gold design for executives.",
    tags: ["Executive", "Premium", "Gold"],
    category: "executive",
    colorScheme: {
      primary: "#1e293b", // slate-800
      secondary: "#f3f4f6", // gray-100
      accent: "#d4af37", // gold
    },
    previewImage: "/images/templates/golden.png", // Valid placeholder
    resumeComponent: () =>
      import("@/components/cv/preview/layouts/Golden").then((m) => ({
        default: m.GoldenLayout,
      })),
    coverLetterComponent: () =>
      import("@/components/cv/preview/layouts/GoldenCoverLetter").then((m) => ({
        default: m.GoldenCoverLetter,
      })),
  },
  {
    id: "elegant",
    name: "Elegant Sidebar",
    description: "Clean sidebar layout with serif typography.",
    tags: ["Elegant", "Sidebar", "Clean"],
    category: "professional",
    colorScheme: {
      primary: "#2d2424", // Dark brown/grey
      secondary: "#ffffff",
      accent: "#3e3430",
    },
    previewImage: "/images/templates/elegant.png",
    resumeComponent: () =>
      import("@/components/cv/preview/layouts/Elegant").then((m) => ({
        default: m.ElegantLayout,
      })),
    coverLetterComponent: () =>
      import("@/components/cv/preview/layouts/ElegantCoverLetter").then((m) => ({
        default: m.ElegantCoverLetter,
      })),
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Bold black design with gold accents for creative professionals.",
    tags: ["Modern", "Dark", "Creative"],
    category: "creative",
    colorScheme: {
      primary: "#000000",
      secondary: "#D4AF37",
      accent: "#FFFFFF",
    },
    previewImage: "/images/templates/modern-dark.png",
    resumeComponent: () =>
      import("@/components/cv/preview/layouts/ModernDark").then((m) => ({
        default: m.ModernDarkLayout,
      })),
    coverLetterComponent: () =>
      import("@/components/cv/preview/layouts/ModernDarkCoverLetter").then((m) => ({
        default: m.ModernDarkCoverLetter,
      })),
  },
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    description: "Timeline-based design with gray sidebar and ribbon headers.",
    tags: ["Modern", "Sidebar", "Timeline"],
    category: "professional",
    colorScheme: {
      primary: "#1F1F1F",
      secondary: "#E5E5E5",
      accent: "#333333",
    },
    previewImage: "/images/templates/modern-sidebar.png",
    resumeComponent: () =>
      import("@/components/cv/preview/layouts/ModernSidebar").then((m) => ({
        default: m.ModernSidebarLayout,
      })),
    coverLetterComponent: () =>
      import("@/components/cv/preview/layouts/ModernSidebarCoverLetter").then((m) => ({
        default: m.ModernSidebarCoverLetter,
      })),
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
  golden: {
    resume: () =>
      import("@/components/cv/preview/layouts/Golden").then((m) => ({
        default: m.GoldenLayout,
      })),
    coverLetter: () =>
      import("@/components/cv/preview/layouts/GoldenCoverLetter").then((m) => ({
        default: m.GoldenCoverLetter,
      })),
  },
  elegant: {
    resume: () =>
      import("@/components/cv/preview/layouts/Elegant").then((m) => ({
        default: m.ElegantLayout,
      })),
    coverLetter: () =>
      import("@/components/cv/preview/layouts/ElegantCoverLetter").then((m) => ({
        default: m.ElegantCoverLetter,
      })),
  },
  "modern-dark": {
    resume: () =>
      import("@/components/cv/preview/layouts/ModernDark").then((m) => ({
        default: m.ModernDarkLayout,
      })),
    coverLetter: () =>
      import("@/components/cv/preview/layouts/ModernDarkCoverLetter").then((m) => ({
        default: m.ModernDarkCoverLetter,
      })),
  },
  "modern-sidebar": {
    resume: () =>
      import("@/components/cv/preview/layouts/ModernSidebar").then((m) => ({
        default: m.ModernSidebarLayout,
      })),
    coverLetter: () =>
      import("@/components/cv/preview/layouts/ModernSidebarCoverLetter").then((m) => ({
        default: m.ModernSidebarCoverLetter,
      })),
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
export const DEFAULT_TEMPLATE = "golden";

// Template categories for filtering in gallery
export const TEMPLATE_CATEGORIES = [
  { id: "all", name: "All Templates" },
  { id: "professional", name: "Professional" },
  { id: "executive", name: "Executive" },
  { id: "creative", name: "Creative" },
  { id: "simple", name: "Simple" },
] as const;
