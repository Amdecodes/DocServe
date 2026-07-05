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
  coreCompetencies: string[];
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

// ============================================================================
// SYSTEM PROMPTS (Language-aware)
// ============================================================================

const SYSTEM_PROMPT = `You are a strict, professional Resume Writer focused on clarity, accuracy, and ATS optimization. You write in a human tone without buzzwords or fluff.

Your Writing Philosophy:
1. **Clear & Direct**: Use simple, professional language. Avoid flowery adjectives like "unwavering commitment", "seamless", "visionary".
2. **Tasks Over Authority**: Describe WHAT was done, not just the level of responsibility. "Managed a team" -> "Coordinated daily tasks for a team of 5, ensuring deadlines were met."
3. **No Inflated Claims**: Do not use "world-class", "elite", "top-tier" unless explicitly in the input.
4. **No Future Dates**: Never imply actions in the future.
5. **ATS Mastery**: Use standard industry keywords that recruiters search for.
6. **No Hallucinations**: Never invent company names, metrics, or specifics not provided.
7. **Human Tone**: excessive formality feels AI-generated. Write like a professional human.`;

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
// ROLE-SPECIFIC ENHANCEMENT GUIDANCE
// ============================================================================

/**
 * Get role-specific keywords and focus areas for premium content
 */
function getRoleSpecificGuidance(jobTitle: string): string {
  const titleLower = jobTitle.toLowerCase();

  // Driver roles
  if (titleLower.includes("driver") || titleLower.includes("chauffeur")) {
    return `ROLE-SPECIFIC EXCELLENCE for ${jobTitle}:
- Emphasize: Safety record, punctuality, discretion, route optimization, VIP handling
- Key skills: Defensive driving, vehicle maintenance awareness, GPS/navigation expertise, professional presentation
- Value drivers: Executive confidentiality, schedule reliability, crisis management, hospitality mindset
- Metrics to reference: On-time performance, safe driving record, years without incidents, client satisfaction`;
  }

  // Healthcare roles
  if (
    titleLower.includes("nurse") ||
    titleLower.includes("medical") ||
    titleLower.includes("health")
  ) {
    return `ROLE-SPECIFIC EXCELLENCE for ${jobTitle}:
- Emphasize: Patient care quality, clinical expertise, regulatory compliance, interdisciplinary collaboration
- Key skills: Patient assessment, care planning, medication management, EMR proficiency, family communication
- Value drivers: Patient outcomes, safety protocols, quality metrics, continuous education
- Certifications to mention pattern: relevant licensure, specialized training, life support certifications`;
  }

  // Tech roles
  if (
    titleLower.includes("developer") ||
    titleLower.includes("engineer") ||
    titleLower.includes("programmer")
  ) {
    return `ROLE-SPECIFIC EXCELLENCE for ${jobTitle}:
- Emphasize: Technical architecture, code quality, system scalability, cross-functional collaboration
- Key skills: Full-stack development, agile methodology, code review, testing strategies, DevOps practices
- Value drivers: System uptime, performance optimization, technical debt reduction, mentorship
- Technologies to reference pattern: relevant frameworks, cloud platforms, development methodologies`;
  }

  // Management roles
  if (
    titleLower.includes("manager") ||
    titleLower.includes("director") ||
    titleLower.includes("supervisor")
  ) {
    return `ROLE-SPECIFIC EXCELLENCE for ${jobTitle}:
- Emphasize: Team leadership, strategic planning, stakeholder management, operational excellence
- Key skills: Performance management, budget oversight, process improvement, change management
- Value drivers: Team productivity, cost optimization, employee retention, goal achievement
- Metrics patterns: team size managed, budget responsibility, efficiency improvements`;
  }

  // Sales/Business Development
  if (
    titleLower.includes("sales") ||
    titleLower.includes("account") ||
    titleLower.includes("business development")
  ) {
    return `ROLE-SPECIFIC EXCELLENCE for ${jobTitle}:
- Emphasize: Revenue generation, client relationship building, pipeline management, negotiation expertise
- Key skills: Consultative selling, CRM proficiency, territory management, presentation skills
- Value drivers: Quota achievement, client retention, deal size growth, market expansion
- Metrics patterns: quota percentage, revenue figures, client portfolio size, growth percentages`;
  }

  // Default professional guidance
  return `ROLE-SPECIFIC EXCELLENCE for ${jobTitle}:
- Research and apply industry-standard competencies for this role
- Identify key performance indicators typical for ${jobTitle} professionals
- Include relevant technical skills, soft skills, and domain expertise
- Reference typical career progression and areas of specialization`;
}

// ============================================================================
// PROMPT BUILDERS (Premium content, high quality output)
// ============================================================================

/**
 * About Me Prompt (CV)
 * Output: 120-180 words, premium quality, ATS-optimized
 */
function buildSummaryPrompt(
  jobTitle: string,
  experienceLevel: ExperienceLevel,
  industry: string,
  userNotes: string,
  hasExperience: boolean,
  educationSummary: string,
  skillsSummary: string,
): string {
  const expLevelText = EXPERIENCE_LEVEL_MAP[experienceLevel];

  // Build role-specific enhancement guidance
  const roleEnhancements = getRoleSpecificGuidance(jobTitle);

  // ── No work experience: focus on education, skills, and potential ──
  if (!hasExperience) {
    return `Write a clear, ATS-friendly Professional Summary for a fresh graduate / entry-level ${jobTitle} candidate who has NO formal work experience.

Candidate Context:
"${userNotes ? userNotes : `Motivated ${jobTitle} candidate seeking first professional opportunity`}"

Education: ${educationSummary || "Not specified"}
Skills: ${skillsSummary || "Not specified"}

${roleEnhancements}

CRITICAL Requirements:
1. **MAXIMUM 4 LINES** (approx 40-60 words).
2. Focus on education, skills, willingness to learn, and enthusiasm for the role.
3. Do NOT fabricate or imply any work experience — the candidate has none.
4. Highlight transferable skills (e.g., teamwork from school projects, communication, technology skills).
5. Third person implicit (e.g., "Motivated graduate..." not "I am...").
6. No buzzwords (e.g., "game-changer", "synergy").
7. Keep it honest — this is an entry-level candidate, not a seasoned professional.

Example Style:
"Recent Computer Science graduate with strong foundations in programming, data analysis, and problem-solving. Eager to apply academic knowledge in a professional setting. Skilled in Python, Java, and SQL through university coursework and personal projects. Quick learner with excellent teamwork and communication skills."

Now write the Summary for the ${jobTitle}:`;
  }

  // ── Has work experience: standard prompt ──
  return `Write a clear, ATS-friendly Professional Summary for a ${expLevelText} ${jobTitle}.

Candidate Context:
"${userNotes ? userNotes : `Skilled ${jobTitle} with experience in ${industry}`}"

Industry/Field: ${industry}
Experience Level: ${expLevelText}

${roleEnhancements}

CRITICAL Requirements:
1. **MAXIMUM 4 LINES** (approx 40-60 words).
2. Focus on relevant skills and accurate experience.
3. No buzzwords (e.g., "game-changer", "synergy").
4. Third person implicit (e.g., "Experienced Project Manager..." not "I am...").
5. Describe tasks and skills clearly.

Example Style:
"Experienced Project Manager with 5+ years in construction. Proven track record of delivering projects on time and within budget. Skilled in scheduling, cost estimation, and team leadership. Committed to safety and quality standards on all job sites."

Now write the Summary for the ${jobTitle}:`;
}

/**
 * Cover Letter Body Prompt (Main Value)
 * Output: 4 paragraphs, premium quality, no greetings/signatures
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

  // Get role-specific guidance for cover letter
  const roleGuidance = getRoleSpecificGuidance(jobTitle);

  return `Write a clear, professional Cover Letter for a ${expLevelText} ${jobTitle}.

CANDIDATE PROFILE:
- Position: ${expLevelText} ${jobTitle}
- Industry: ${industry}
- Writing Tone: ${toneInstruction}
- Background: "${userNotes ? userNotes : `Skilled ${jobTitle} with experience in ${industry}`}"

${roleGuidance}

COVER LETTER STRUCTURE (3 paragraphs, under 1 page):

**PARAGRAPH 1 - MOTIVATION (3-4 sentences)**
State why you are applying. Motivation must align with the role/industry, not prestige. Focus on what you can do for them.

**PARAGRAPH 2 - SKILLS & TASKS (4-6 sentences)**
Describe specific tasks you have performed and skills you have mastered. Avoid generalities.
- Mention specific tools or methods.
- Describe how you work daily.
- Focus on competence and reliability.

**PARAGRAPH 3 - CLOSING (2-3 sentences)**
Reiterate interest and request an interview. meaningful call to action.

CRITICAL RULES:
1. First person ("I...").
2. No greeting or signature.
3. Concise and respectful tone.
4. NO buzzwords ("synergy", "paradigm shift", "ninja").
5. Motivation must be about the work, not "passion for excellence".

Now write the cover letter body for the ${jobTitle}:`;
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
  return `Improve these resume bullets to be clear, task-oriented, and ATS-friendly.

Role: ${jobTitle}
Organization: ${company}

GUIDELINES:

1. **Clear Action Verbs**: Start with strong but common verbs (e.g., "Managed", "Created", "Analyzed", "Built"). Avoid "Spearheaded", "Orchestrated" unless truly executive level.
2. **Tasks, Not Just Authority**: Describe the actual work performed.
   - Bad: "Responsible for sales."
   - Good: "Managed daily sales operations, finding new clients and maintaining relationships with existing ones."
3. **No Fluff**: Remove adjectives that add no meaning ("proactive", "visionary", "synergistic").
4. **Accuracy**: Do not invent metrics or numbers if they aren't implied.
5. **Length**: 1-2 lines maximum. Do not force expansion if the task was simple.

Original bullets:
${bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Return EXACTLY ${bullets.length} improved bullets, one per line, no numbering.`;
}

/**
 * Key Highlights / Core Competencies Generation Prompt
 * Output: 3 to 4 points, strictly grounded on input data
 */
function buildCoreCompetenciesPrompt(
  jobTitle: string,
  experience: ExperienceItem[],
  skills: string[],
  educationSummary: string,
  currentCompetencies?: string[],
): string {
  const hasCurrent = currentCompetencies && currentCompetencies.length > 0;

  const experienceStr = experience
    .map(
      (exp) =>
        `Role: ${exp.jobTitle} at ${exp.company}
Achievements:
${exp.achievements.map((ach) => `- ${ach}`).join("\n")}`
    )
    .join("\n\n");

  return `Write exactly between 3 and 4 short, professional key achievements, core competencies, or highlight points for a resume.

Target Job Title: ${jobTitle}
Skills: ${skills.join(", ") || "Not specified"}
Education: ${educationSummary || "Not specified"}
Experience:
${experienceStr || "No formal work experience listed."}

${
  hasCurrent
    ? `The candidate has provided the following draft highlights:
${currentCompetencies.map((c) => `- ${c}`).join("\n")}

Improve and refine these highlights to be more professional, ATS-friendly, and concise. Maintain all specific metrics or facts provided by the candidate.`
    : `The candidate has not provided highlights. Generate 3 to 4 key highlights or core competencies based strictly on their experience, skills, and education listed above.`
}

CRITICAL Requirements:
1. Output exactly between 3 and 4 points, with each point on a new line.
2. Return ONLY the plain text points, one per line. Do NOT prefix with numbers, bullet characters (like -, *, •), or markdown.
3. Every point must be a concise professional phrase (e.g. "Developed responsive web interfaces using React and Next.js" or "Optimized database performance to reduce page load time").
4. DO NOT BE CREATIVE OR INVENT ANY METRICS. Every point must be grounded strictly in the candidate's input data provided above. If no metrics are provided, focus on their specified skills, duties, or education. Do not hallucinate company names, projects, or statistics.`;
}

// ============================================================================
// GEMINI API CALL
// ============================================================================

// Fallback models in priority order
const FALLBACK_MODELS = [
  "gemini-2.5-flash", // Primary (Highly capable & fast)
  "gemini-2.5-flash-lite", // Fallback 1
  "gemini-1.5-pro", // Fallback 2 (High capability reasoning)
  "gemini-1.5-flash", // Legacy fallback
];

const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGeminiAPI(userPrompt: string): Promise<string> {
  const maxRetriesPerModel = 2; // Reduced retries per model since we have fallbacks
  let lastError: Error | null = null;

  for (const modelId of FALLBACK_MODELS) {
    let attempt = 0;
    console.log(`[Gemini API] Attempting generation with model: ${modelId}`);

    while (attempt < maxRetriesPerModel) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/${modelId}:generateContent?key=${GEMINI_API_KEY}`,
          {
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
                temperature: 0.7,
                maxOutputTokens: 4096,
                topP: 0.9,
                topK: 50,
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
          },
        );

        if (response.status === 429) {
          attempt++;
          const waitTime = Math.pow(2, attempt) * 1000;
          console.warn(
            `[Gemini API] ${modelId} 429 Limit Hit. Retrying in ${waitTime}ms... (Attempt ${attempt}/${maxRetriesPerModel})`,
          );
          if (attempt >= maxRetriesPerModel) break; // Break inner loop to try next model

          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `[Gemini API] ${modelId} Error ${response.status}:`,
            errorText,
          );
          // 404 means model not found (likely for future/invalid models) - try next immediately
          if (response.status === 404) break;
          // 5xx errors might be transient, but better to switch model
          break;
        }

        const result = await response.json();

        // Safety block check
        if (result.promptFeedback?.blockReason) {
          console.warn(
            `[Gemini API] ${modelId} Safety Block: ${result.promptFeedback.blockReason}`,
          );
          // Safety blocks are usually content-related, switching model unlikely to help BUT different models have different sensitivities.
          // We'll try next model just in case.
          break;
        }

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          console.warn(`[Gemini API] ${modelId} returned no text candidate.`);
          break;
        }

        // Success!
        return cleanAIOutput(text);
      } catch (e) {
        console.error(`[Gemini API] ${modelId} Exception:`, e);
        lastError = e as Error;
        // On network exception, maybe retry same model?
        // For now, let's treat it as a failure for this attempt
        attempt++;
        if (attempt >= maxRetriesPerModel) break;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  // If we get here, all models failed
  console.error("[Gemini API] All fallback models failed.");
  throw lastError || new Error("All AI models failed to generate content.");
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
  const hasExperience = cvData.experience.length > 0;

  // Build education summary for no-experience scenarios
  const educationSummary = (cvData.education || [])
    .map((edu) => `${edu.degree || ""} at ${edu.school || ""}`.trim())
    .filter(Boolean)
    .join("; ") || "";

  // Build skills summary
  const skillsSummary = (cvData.skills || []).map((s) => s.name).join(", ") || "";

  try {
    // 1. Generate About Me section
    console.log(`[AI Generator] Generating About Me... (hasExperience: ${hasExperience})`);
    const summaryPrompt = buildSummaryPrompt(
      jobTitle,
      experienceLevel,
      industry,
      userNotes,
      hasExperience,
      educationSummary,
      skillsSummary,
    );
    const professionalSummary = await callGeminiAPI(summaryPrompt);

    // 1.5 Generate Core Competencies / Key Highlights
    console.log(`[AI Generator] Generating Key Highlights / Core Competencies...`);
    const coreCompetenciesPrompt = buildCoreCompetenciesPrompt(
      jobTitle,
      cvData.experience || [],
      (cvData.skills || []).map((s) => s.name),
      educationSummary,
      cvData.coreCompetencies,
    );
    const coreCompetenciesRaw = await callGeminiAPI(coreCompetenciesPrompt);
    const coreCompetencies = coreCompetenciesRaw
      .split("\n")
      .map((line) => line.replace(/^[-•*#0-9.]\s*/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 4);

    const parsedCompetencies = coreCompetencies.length > 0
      ? coreCompetencies
      : (cvData.coreCompetencies || []);

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
      coreCompetencies: parsedCompetencies,
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
      coreCompetencies: cvData.coreCompetencies || [],
      generatedAt: new Date().toISOString(),
    };
  }
}

// ============================================================================
// FALLBACK CONTENT (When AI fails)
// ============================================================================

function generateFallbackSummary(jobTitle: string): string {
  return `Experienced ${jobTitle} with strong professional skills. Proven ability to handle tasks efficiently and work well within a team. Committed to delivering high-quality results and continuous professional development. Reliability and attention to detail are key strengths.`;
}

function generateFallbackCoverLetter(): string {
  return `I am writing to apply for the position. I have experience in this field and I am confident in my ability to contribute to your team.

My background includes working on various projects where I developed strong professional skills. I am reliable, detail-oriented, and accustomed to meeting deadlines. I focus on getting the job done right and working well with colleagues.

I am interested in this opportunity because it aligns with my professional goals. Thank you for considering my application. I look forward to discussing my qualifications further.`;
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
    // Add AI-generated core competencies
    coreCompetencies: aiContent.coreCompetencies.length > 0
      ? aiContent.coreCompetencies
      : cvData.coreCompetencies,
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
