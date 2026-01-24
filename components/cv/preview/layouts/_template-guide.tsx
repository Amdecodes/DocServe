/**
 * Template Building Guide
 * =======================
 *
 * This document outlines best practices for creating CV templates
 * that work seamlessly in both browser preview and PDF export.
 */

import { CVData } from "@/types/cv";

/**
 * TEMPLATE SKELETON
 * -----------------
 * Copy this as a starting point for new templates.
 */
export function TemplateSkeletonLayout({ data }: { data: CVData }) {
  if (!data) return null;

  // ════════════════════════════════════════════════════════════════
  // 1. DESTRUCTURE WITH SAFE DEFAULTS
  // ════════════════════════════════════════════════════════════════
  const { personalInfo, summary } = data;
  const experience = data.experience || [];

  // ════════════════════════════════════════════════════════════════
  // 2. HELPER FUNCTIONS
  // ════════════════════════════════════════════════════════════════

  // Format date for display (customize as needed)
  const formatDate = (dateStr: string | undefined, showPresent = false) => {
    if (!dateStr) return showPresent ? "Present" : "";
    // You can add date parsing/formatting here
    // For now, return as-is since we store formatted strings
    return dateStr;
  };

  // Safe string truncation for long content
  // const truncate = (str: string, maxLength: number) => {
  //   if (!str || str.length <= maxLength) return str;
  //   return str.slice(0, maxLength) + "...";
  // };

  // ════════════════════════════════════════════════════════════════
  // 3. RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    // Root container: ALWAYS use h-full w-full
    <div className="h-full w-full bg-white font-sans text-gray-800">
      {/* ══════════════════════════════════════════════════════════
          HEADER SECTION
          - Name, Job Title, Contact Info
          ══════════════════════════════════════════════════════════ */}
      <header className="p-8 bg-gray-100">
        <h1 className="text-3xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg text-gray-600">{personalInfo.jobTitle}</p>
        <div className="mt-2 text-sm text-gray-500">
          {personalInfo.email} • {personalInfo.phone}
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════════ */}
      <main className="p-8 space-y-6">
        {/* SUMMARY - Only render if exists */}
        {summary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2">
              Profile
            </h2>
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {/* EXPERIENCE - Handle empty array gracefully */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <h3 className="font-bold">{exp.jobTitle}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{exp.company}</p>

                  {/* Prefer achievements over description */}
                  {exp.achievements?.length > 0 ? (
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {exp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  ) : exp.description ? (
                    <p className="mt-2 text-sm">{exp.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Continue pattern for education, skills, languages, volunteer... */}
      </main>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BEST PRACTICES CHECKLIST
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ✅ STRUCTURE
 *    □ Use `h-full w-full` on root container
 *    □ Destructure all CVData fields with defaults
 *    □ Conditionally render sections (handle empty arrays)
 *    □ Use semantic HTML (header, main, section, article)
 *
 * ✅ STYLING (Print/PDF Safe)
 *    □ Use explicit color values, not CSS variables
 *       Good: bg-[#2c3e50]  Bad: bg-primary
 *    □ Avoid complex shadows (drop-shadow, box-shadow with blur)
 *    □ Avoid backdrop-blur, filters
 *    □ Use px/rem units, avoid vh/vw
 *    □ Test all Tailwind classes render in PDF
 *
 * ✅ TYPOGRAPHY
 *    □ Use web-safe fonts (Helvetica, Arial, Georgia, Times)
 *       or ensure font is loaded in HTML wrapper
 *    □ Use consistent font sizing scale
 *    □ Ensure readable contrast (min 4.5:1 ratio)
 *
 * ✅ LAYOUT
 *    □ Design for A4 aspect ratio (210mm × 297mm, roughly 1:1.414)
 *    □ Consider content overflow (use line-clamp if needed)
 *    □ Test with max data (10+ experiences, long names)
 *    □ Test with min data (empty sections)
 *
 * ✅ IMAGES
 *    □ Use base64 or absolute URLs for photos
 *    □ Provide fallback for missing photos
 *    □ Keep images small (<100KB) for PDF performance
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * COMMON LAYOUT PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. SINGLE COLUMN
 *    └── Full width sections, stacked vertically
 *    └── Best for: ATS-friendly, simple templates
 *
 * 2. SIDEBAR LEFT
 *    ├── Left: Contact, Skills, Languages (30%)
 *    └── Right: Experience, Education (70%)
 *    └── Best for: Modern, executive templates
 *
 * 3. SIDEBAR RIGHT
 *    ├── Left: Main content (70%)
 *    └── Right: Photo, skills, extras (30%)
 *    └── Best for: Creative templates
 *
 * 4. HEADER + TWO COLUMNS
 *    ├── Top: Full-width header with photo
 *    └── Below: Two-column content
 *    └── Best for: Portfolio-style templates
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * TESTING TEMPLATE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Test your template with this sample data:
 */
export const SAMPLE_CV_DATA: CVData = {
  documentLanguage: "en",
  personalInfo: {
    firstName: "Alexandra",
    lastName: "Thompson",
    email: "alexandra.thompson@email.com",
    phone: "+1 555 123 4567",
    city: "San Francisco",
    country: "United States",
    jobTitle: "Senior Product Manager",
    headline: "Building products that users love",
    linkedin: "linkedin.com/in/alexthompson",
    website: "alexthompson.io",
  },
  summary:
    "Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative solutions. Proven track record of increasing user engagement by 40% and reducing churn by 25% through data-driven decision making.",
  coreCompetencies: [
    "Product Strategy",
    "User Research",
    "Agile/Scrum",
    "Data Analysis",
  ],
  experience: [
    {
      id: "1",
      jobTitle: "Senior Product Manager",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2021-01",
      endDate: "",
      current: true,
      description: "",
      achievements: [
        "Led product strategy for flagship mobile app with 2M+ users",
        "Increased user retention by 35% through personalization features",
        "Managed $5M annual product budget and team of 12 engineers",
      ],
    },
    {
      id: "2",
      jobTitle: "Product Manager",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      startDate: "2018-03",
      endDate: "2020-12",
      current: false,
      description: "",
      achievements: [
        "Launched 3 new product lines generating $2M ARR",
        "Conducted 50+ user interviews to inform product roadmap",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "Stanford University",
      degree: "MBA, Business Administration",
      city: "Stanford, CA",
      startDate: "2016",
      endDate: "2018",
    },
    {
      id: "2",
      school: "UC Berkeley",
      degree: "B.S. Computer Science",
      city: "Berkeley, CA",
      startDate: "2012",
      endDate: "2016",
    },
  ],
  skills: [
    { id: "1", name: "Product Strategy" },
    { id: "2", name: "User Research" },
    { id: "3", name: "SQL & Analytics" },
    { id: "4", name: "Figma & Design" },
    { id: "5", name: "Jira & Agile" },
  ],
  languages: [
    { id: "1", language: "English", proficiency: "Native" },
    { id: "2", language: "Spanish", proficiency: "Professional" },
  ],
  volunteer: [
    {
      id: "1",
      organization: "Code for America",
      role: "Product Advisor",
      description: "Mentoring civic tech projects",
    },
  ],
};
