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

// ============================================================================
// SYSTEM PROMPTS (Language-aware)
// ============================================================================

const SYSTEM_PROMPT = `You are an elite Executive Resume Writer with 15+ years of experience crafting resumes for Fortune 500 executives, senior professionals, and career changers. You specialize in creating compelling, ATS-optimized content that transforms careers.

Your Writing Philosophy:
1. **Transform, Don't Describe**: Convert mundane duties into powerful value propositions. "Drove a car" becomes "Ensured seamless executive mobility through proactive route planning, punctual scheduling, and unwavering commitment to discretion and safety protocols."
2. **Depth Over Brevity**: PAID users expect PREMIUM content. Write comprehensive, rich descriptions that demonstrate deep expertise. Never write less than 3 substantial sentences for summaries.
3. **Industry Authority**: Demonstrate mastery of role-specific terminology, methodologies, and value drivers. Research-level knowledge of what makes professionals in each field exceptional.
4. **Quantify Intelligently**: Use realistic, believable metrics and timeframes. "Maintained 100% on-time performance across 500+ executive transports annually."
5. **ATS Mastery**: Naturally weave in industry keywords, certifications, and technical terms that recruiters search for.
6. **No Hallucinations**: Never invent company names, specific percentages, or false claims. Use patterns like "consistently delivered", "maintained exceptional standards", "recognized for".
7. **Premium Quality**: This is a PAID service. Output must reflect executive-level writing that justifies the investment.`;

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
 * Professional Summary Prompt (CV)
 * Output: 120-180 words, premium quality, ATS-optimized
 */
function buildSummaryPrompt(
  jobTitle: string,
  experienceLevel: ExperienceLevel,
  industry: string,
  userNotes: string,
): string {
  const expLevelText = EXPERIENCE_LEVEL_MAP[experienceLevel];

  // Build role-specific enhancement guidance
  const roleEnhancements = getRoleSpecificGuidance(jobTitle);

  return `Craft a PREMIUM executive-level professional summary for a ${expLevelText} ${jobTitle} professional.

Candidate Context:
"${userNotes ? userNotes : `Dedicated ${jobTitle} professional with comprehensive expertise in ${industry}`}"

Industry/Field: ${industry}
Experience Level: ${expLevelText}

${roleEnhancements}

CRITICAL Requirements:
1. Write 4-6 impactful sentences (120-180 words minimum).
2. Opening sentence: Bold statement of expertise and years/level of experience.
3. Second section: Core competencies and specialized skills relevant to ${jobTitle}.
4. Third section: Key achievements patterns and professional reputation.
5. Closing: Career philosophy or value proposition statement.
6. Third person throughout ("Accomplished ${jobTitle}..." not "I am...").
7. Include industry-specific terminology and keywords for ATS optimization.
8. Sound like a $500/hour executive resume writer crafted this.

Example Quality Level (DO NOT COPY, just match this caliber):
"Distinguished Senior Marketing Director with 12+ years of progressive experience orchestrating multi-million dollar brand campaigns across Fortune 500 organizations. Recognized for pioneering data-driven marketing strategies that consistently deliver 40%+ ROI improvements while building high-performing cross-functional teams of 20+ professionals. Core expertise spans digital transformation, customer journey optimization, and go-to-market strategy development. Trusted advisor to C-suite executives on brand positioning, market expansion, and competitive differentiation initiatives. Passionate about leveraging emerging technologies and consumer insights to create memorable brand experiences that drive sustainable business growth."

Now write the professional summary for the ${jobTitle}:`;
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

  return `Write a PREMIUM, compelling cover letter body for a ${expLevelText} ${jobTitle} in ${industry}.

Writing Style: ${toneInstruction}
Candidate Context: "${userNotes ? userNotes : `Experienced ${jobTitle} seeking to leverage comprehensive expertise in ${industry}`}"

PREMIUM QUALITY REQUIREMENTS:

**Paragraph 1 - Powerful Opening (4-5 sentences):**
- Open with a compelling hook that demonstrates passion for the field
- State your experience level and core expertise areas
- Reference what draws you to opportunities in this industry
- Establish credibility through professional positioning

**Paragraph 2 - Value Proposition (5-7 sentences):**
- Detail 3-4 core competencies with specific context
- Describe your approach to challenges in this role
- Highlight what sets you apart from other ${jobTitle} professionals
- Include industry-relevant terminology and methodologies
- Demonstrate understanding of what success looks like in this role

**Paragraph 3 - Achievements & Impact (4-5 sentences):**
- Share patterns of success and recognition (without inventing specific facts)
- Describe your professional philosophy and work ethic
- Mention collaborative abilities and stakeholder management
- Reference continuous improvement mindset

**Paragraph 4 - Strong Close (3-4 sentences):**
- Express genuine enthusiasm for the opportunity
- State your readiness to contribute immediately
- Professional call-to-action for next steps
- End with confidence, not desperation

RULES:
- NO greeting lines ("Dear...") or signature blocks
- Write 300-400 words total - this is a PAID premium service
- Sound like a professional who commands respect
- ATS-friendly keywords naturally woven throughout
- Avoid clichés like "team player" or "hard worker" - be specific

Write the cover letter body now:`;
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
  return `Transform these resume bullets into PREMIUM, executive-level achievement statements.

Role: ${jobTitle}
Organization: ${company}

TRANSFORMATION GUIDELINES:

1. **Power Verb Opening**: Start each bullet with a commanding action verb:
   - Instead of "Responsible for" → "Spearheaded", "Orchestrated", "Championed"
   - Instead of "Helped with" → "Collaborated to deliver", "Contributed to"
   - Instead of "Did" → "Executed", "Implemented", "Drove"

2. **Context + Action + Result Pattern**:
   - What was the situation/scope?
   - What action did you take?
   - What was the impact/outcome?

3. **Expansion Rules (CRITICAL)**:
   - Short bullets (under 10 words) MUST be expanded to 20-30 words
   - Add context about scale, frequency, or stakeholders
   - Include industry-relevant methodology or approach

4. **Realistic Metrics**:
   - Use believable patterns: "consistently", "100%", "daily", "across X departments"
   - Time-based: "within tight deadlines", "ahead of schedule"
   - Scope: "serving 50+ clients", "managing $X budgets"

5. **Example Transformations**:
   - "Drove executives" → "Provided secure, punctual transportation for C-suite executives, maintaining 100% on-time performance while ensuring complete confidentiality and professional discretion across 500+ annual engagements"
   - "Managed inventory" → "Orchestrated end-to-end inventory management for $2M+ product catalog, implementing tracking systems that reduced shrinkage by 15% and optimized reorder cycles"

Original bullets to transform:
${bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Return EXACTLY ${bullets.length} transformed bullets, one per line, no numbering or bullet symbols.
Each bullet MUST be 20-40 words minimum.`;
}

// ============================================================================
// GEMINI API CALL
// ============================================================================

// Fallback models in priority order
const FALLBACK_MODELS = [
  "gemini-3-pro", // Primary
  "gemini-2.5-flash", // Fallback 1
  "gemini-2.5-flash-lite", // Fallback 2
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
                maxOutputTokens: 2048,
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
  return `Distinguished ${jobTitle} with a proven track record of excellence and dedication to delivering exceptional results in demanding professional environments. Combines comprehensive technical expertise with outstanding interpersonal skills to consistently exceed expectations and drive organizational success. Recognized for maintaining the highest standards of professionalism, reliability, and attention to detail while navigating complex challenges with composure and strategic thinking. Committed to continuous improvement and staying current with industry best practices to deliver maximum value to stakeholders and clients alike.`;
}

function generateFallbackCoverLetter(): string {
  return `I am writing to express my strong interest in contributing my expertise and dedication to an organization that values excellence and professional growth. Throughout my career, I have built a reputation for reliability, attention to detail, and an unwavering commitment to exceeding expectations in every endeavor I undertake.

My professional journey has equipped me with a diverse skill set that enables me to navigate complex challenges with confidence and composure. I pride myself on my ability to build strong relationships with colleagues and stakeholders, communicate effectively across all levels of an organization, and consistently deliver results that drive business success. My approach combines strategic thinking with hands-on execution, ensuring that projects are completed efficiently and to the highest standards.

What distinguishes me is my genuine passion for continuous improvement and my dedication to staying current with industry developments and best practices. I believe that success comes from a combination of expertise, adaptability, and a sincere commitment to adding value in every interaction. My track record demonstrates consistent achievement and recognition for going above and beyond standard expectations.

I am confident that my qualifications, work ethic, and professional demeanor would make me a valuable addition to your team. I would welcome the opportunity to discuss how my background and capabilities align with your organization's needs and to learn more about how I can contribute to your continued success.`;
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
