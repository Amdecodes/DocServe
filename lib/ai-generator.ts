/**
 * AI Content Generation Service
 * Production-grade prompts for ATS-friendly resumes and cover letters
 * Using Google Gemini AI API
 *
 * Design Principles:
 * - Short system instruction → saves tokens
 * - Strict role definition → prevents creative drift
 * - Enum-based tone control → predictable output
 * - Hard structure rules → PDF-safe text
 * - No placeholders / no assumptions → avoids hallucinations
 */

import { CVData, ExperienceItem, CoverLetterTone } from "@/types/cv";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface AIGenerationOutput {
  professionalSummary: string;
  coverLetterBody?: string;
  optimizedBullets: string[][];
  generatedAt: string;
}

// Tone mapping (UI dropdown → prompt language style)
const TONE_MAP: Record<CoverLetterTone, string> = {
  Formal: "conservative, respectful wording",
  Neutral: "neutral, ATS-safe language",
  Confident: "strong verbs, assertive tone",
};

// Input limits (backend-enforced safeguards)
const LIMITS = {
  userNotes: 400,
  jobTitle: 50,
  industry: 50,
  bulletMax: 10,
} as const;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

// ============================================================================
// SYSTEM PROMPTS (Language-aware)
// ============================================================================

const SYSTEM_PROMPT = `You are a professional career writer specializing in ATS-friendly resumes and cover letters.
Write concise, human-sounding, non-generic content.
Do not invent facts.
Do not mention AI, prompts, or templates.
Follow the structure and limits exactly.`;

// Experience level translations
const EXPERIENCE_LEVEL_MAP: Record<ExperienceLevel, string> = {
  "Entry-level": "Entry-level",
  "Mid-level": "Mid-level",
  Senior: "Senior",
  Executive: "Executive",
};

// Experience level type
type ExperienceLevel = "Entry-level" | "Mid-level" | "Senior" | "Executive";

// ============================================================================
// INPUT SANITIZATION (Critical safeguards)
// ============================================================================

function sanitize(input: string | undefined, maxLength: number): string {
  if (!input) return "";
  return input.trim().slice(0, maxLength);
}

function sanitizeBullets(bullets: string[]): string[] {
  return bullets
    .slice(0, LIMITS.bulletMax)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
}

// ============================================================================
// EXPERIENCE LEVEL CALCULATION
// ============================================================================

function calculateExperienceLevel(
  experience: ExperienceItem[],
): ExperienceLevel {
  if (!experience.length) return "Entry-level";

  const totalYears = experience.reduce((acc, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : new Date(exp.endDate);
    const years =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return acc + Math.max(0, years);
  }, 0);

  if (totalYears < 2) return "Entry-level";
  if (totalYears < 5) return "Mid-level";
  if (totalYears < 10) return "Senior";
  return "Executive";
}

function extractIndustry(experience: ExperienceItem[]): string {
  if (!experience.length) return "General";
  // Use most recent company/industry context
  return experience[0]?.company || "General";
}

// ============================================================================
// PROMPT BUILDERS (Low token, high control, language-aware)
// ============================================================================

/**
 * Professional Summary Prompt (CV)
 * Output: ~60-80 words, ATS-safe
 */
function buildSummaryPrompt(
  jobTitle: string,
  experienceLevel: ExperienceLevel,
  industry: string,
  userNotes: string,
): string {
  const expLevelText = EXPERIENCE_LEVEL_MAP[experienceLevel];

  return `Write a professional summary for a ${expLevelText} ${jobTitle} in the ${industry} industry.

Rules:
- 2-3 sentences only
- Focus on impact and skills, not responsibilities
- Use clear, professional language
- No buzzwords, no clichés
- Do not mention years unless provided
- Do not use first person ("I", "my")

User notes:
${userNotes || "None provided"}

Output only the summary text, nothing else.`;
}

/**
 * Cover Letter Body Prompt (Main Value)
 * Output: 3 paragraphs, no greetings/signatures
 */
function buildCoverLetterPrompt(
  jobTitle: string,
  experienceLevel: ExperienceLevel,
  industry: string,
  tone: CoverLetterTone,
  userNotes: string,
): string {
  const toneInstruction = TONE_MAP[tone] || TONE_MAP.Neutral;
  const expLevelText = EXPERIENCE_LEVEL_MAP[experienceLevel];

  return `Write a one-page cover letter body for a ${expLevelText} ${jobTitle} in the ${industry} industry.

Tone: ${toneInstruction}

Rules:
- 3 short paragraphs only
- No company names or specific references
- No placeholders like [Company Name]
- No greetings or signatures
- Focus on value, skills, and motivation
- Avoid generic phrases like "I am writing to apply"
- Each paragraph should be 2-3 sentences max

User notes:
${userNotes || "None provided"}

Output only the 3 paragraphs, nothing else.`;
}

/**
 * Bullet Point Rewriting Prompt (CV Enhancement)
 * Output: Same number of bullets, action-verb focused
 */
function buildBulletPrompt(
  bullets: string[],
  jobTitle: string,
  company: string,
): string {
  const bulletList = bullets.map((b, i) => `${i + 1}. ${b}`).join("\n");

  return `Rewrite the following bullet points to be concise, results-oriented, and ATS-friendly.

Context: ${jobTitle} at ${company}

Rules:
- Keep meaning unchanged
- Start each with a strong action verb
- No exaggeration or invented metrics
- Max 1 line per bullet (under 100 characters)
- Return exactly ${bullets.length} bullets
- No numbering in output

Bullets:
${bulletList}

Output only the rewritten bullets, one per line.`;
}

// ============================================================================
// GEMINI API CALL
// ============================================================================

async function callGeminiAPI(userPrompt: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }, { text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4, // Lower = more consistent, less creative
        maxOutputTokens: 512, // Limit output length
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[Gemini API] Error response:", error);
    throw new Error(`Gemini API failed: ${response.status}`);
  }

  const result = await response.json();

  // Extract text from response
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Clean up common AI artifacts
  return cleanAIOutput(text);
}

/**
 * Clean AI output - remove common artifacts
 */
function cleanAIOutput(text: string): string {
  let cleaned = text.trim();

  // Remove markdown formatting
  cleaned = cleaned.replace(/^#+\s*/gm, "");
  cleaned = cleaned.replace(/\*\*/g, "");
  cleaned = cleaned.replace(/\*/g, "");

  // Remove quotes if entire text is quoted
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
  }

  // Remove "Here is..." type preambles
  cleaned = cleaned.replace(/^(Here is|Here's|Below is)[^:]*:\s*/i, "");

  // Remove trailing notes (split by double newline and check last segment)
  const segments = cleaned.split("\n\n");
  const lastSegment = segments[segments.length - 1];
  if (
    lastSegment &&
    /^(Note:|Please note:|Remember:)/i.test(lastSegment.trim())
  ) {
    segments.pop();
    cleaned = segments.join("\n\n");
  }

  return cleaned.trim();
}

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

/**
 * Generate AI content from user form data
 * Only called after payment confirmation (one call per order)
 */
export async function generateAIContent(
  orderId: string,
  cvData: CVData,
): Promise<AIGenerationOutput> {
  console.log(`[AI Generator] Starting generation for Order ${orderId}`);
  console.log(
    `[AI Generator] Raw cvData.documentLanguage value: "${cvData?.documentLanguage}"`,
  );
  console.log(
    `[AI Generator] Type of documentLanguage: ${typeof cvData?.documentLanguage}`,
  );

  // Get document language (default to English)
  const language = "en" as const;
  console.log(`[AI Generator] Final language used: ${language}`);
  console.log(
    `[AI Generator] System prompt preview: ${SYSTEM_PROMPT.substring(0, 100)}...`,
  );

  // Extract and sanitize inputs
  const personalInfo = cvData.personalInfo || {};
  const jobTitle =
    sanitize(personalInfo.jobTitle, LIMITS.jobTitle) || "Professional";
  const experienceLevel = calculateExperienceLevel(cvData.experience);
  const industry = sanitize(
    extractIndustry(cvData.experience),
    LIMITS.industry,
  );
  const userNotes = sanitize(
    cvData.summary || cvData.summaryNotes,
    LIMITS.userNotes,
  );
  const tone = cvData.coverLetter?.tone || "Neutral";

  try {
    // 1. Generate Professional Summary
    console.log(`[AI Generator] Generating summary...`);
    const summaryPrompt = buildSummaryPrompt(
      jobTitle,
      experienceLevel,
      industry,
      userNotes,
    );
    const professionalSummary = await callGeminiAPI(summaryPrompt);

    // 2. Generate Cover Letter (only if user has cover letter data)
    let coverLetterBody: string | undefined;
    if (cvData.coverLetter) {
      console.log(`[AI Generator] Generating cover letter...`);
      const coverLetterPrompt = buildCoverLetterPrompt(
        jobTitle,
        experienceLevel,
        industry,
        tone,
        userNotes,
      );
      coverLetterBody = await callGeminiAPI(coverLetterPrompt);
    }

    // 3. Optimize Experience Bullets (only if user provided bullets)
    const optimizedBullets: string[][] = [];

    for (const exp of cvData.experience) {
      const sanitizedBullets = sanitizeBullets(exp.achievements);

      if (sanitizedBullets.length > 0) {
        console.log(`[AI Generator] Optimizing bullets for ${exp.company}...`);
        const bulletPrompt = buildBulletPrompt(
          sanitizedBullets,
          exp.jobTitle,
          exp.company,
        );
        const optimized = await callGeminiAPI(bulletPrompt);

        // Parse output - one bullet per line
        const parsedBullets = optimized
          .split("\n")
          .map((line) => line.replace(/^[-•]\s*/, "").trim())
          .filter((line) => line.length > 0)
          .slice(0, sanitizedBullets.length); // Ensure same count

        // If parsing failed, keep original
        optimizedBullets.push(
          parsedBullets.length > 0 ? parsedBullets : sanitizedBullets,
        );
      } else {
        optimizedBullets.push([]);
      }
    }

    console.log(`[AI Generator] ✅ Generation complete for Order ${orderId}`);

    return {
      professionalSummary:
        professionalSummary || generateFallbackSummary(jobTitle),
      coverLetterBody,
      optimizedBullets,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[AI Generator] ❌ Generation failed:", error);

    // Return fallback content - never fail the order
    return {
      professionalSummary: generateFallbackSummary(jobTitle),
      coverLetterBody: cvData.coverLetter
        ? generateFallbackCoverLetter()
        : undefined,
      optimizedBullets: cvData.experience.map((exp) => exp.achievements),
      generatedAt: new Date().toISOString(),
    };
  }
}

// ============================================================================
// FALLBACK CONTENT (When AI fails)
// ============================================================================

function generateFallbackSummary(jobTitle: string): string {
  return `Results-driven ${jobTitle} with demonstrated expertise in delivering high-impact solutions. Proven ability to drive organizational success through strategic initiatives and collaborative leadership.`;
}

function generateFallbackCoverLetter(): string {
  return `I am excited to bring my skills and experience to a role where I can make a meaningful contribution. My background has equipped me with the expertise needed to excel in challenging environments and deliver results.

Throughout my career, I have consistently demonstrated the ability to adapt, learn, and grow. I take pride in my work ethic and commitment to continuous improvement, always seeking opportunities to add value.

I welcome the opportunity to discuss how my qualifications align with your needs. Thank you for your consideration.`;
}

// ============================================================================
// MERGE FUNCTION (Injects AI content into CVData)
// ============================================================================

/**
 * Merge AI-generated content back into CVData
 */
export function mergeAIContent(
  cvData: CVData,
  aiContent: AIGenerationOutput,
): CVData {
  return {
    ...cvData,
    // Store original user notes for reference
    summaryNotes: cvData.summary || cvData.summaryNotes,
    // Replace with AI-generated professional summary
    summary: aiContent.professionalSummary,
    // Optimize experience bullet points
    experience: cvData.experience.map((exp, index) => ({
      ...exp,
      achievements: aiContent.optimizedBullets[index] || exp.achievements,
    })),
    // Add AI-generated cover letter body
    coverLetter: cvData.coverLetter
      ? {
          ...cvData.coverLetter,
          letterBody:
            aiContent.coverLetterBody || cvData.coverLetter.letterBody,
        }
      : undefined,
  };
}
