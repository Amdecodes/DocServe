import "server-only";
import { CVData } from "@/types/cv";
import { THEME } from "@/config/theme";
import { templateComponents, DEFAULT_TEMPLATE } from "@/config/templates";
import { UnifiedCoverLetter } from "@/components/cv/preview/layouts/UnifiedCoverLetter";

type LooseRecord = Record<string, unknown>;

function toTextList(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          const candidate = item as LooseRecord;
          const textLike =
            candidate.value ??
            candidate.text ??
            candidate.label ??
            candidate.title ??
            candidate.name ??
            candidate.highlight ??
            candidate.competency;
          return typeof textLike === "string" ? textLike.trim() : "";
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,;•]+/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCvDataForPdf(input: CVData): CVData {
  const raw = input as CVData & LooseRecord;
  const personalInfoRaw = (raw.personalInfo ?? {}) as CVData["personalInfo"] &
    LooseRecord;

  const mergedHighlights = [
    ...toTextList(raw.coreCompetencies),
    ...toTextList(raw.keyHighlights),
    ...toTextList(raw.keyHighlight),
    ...toTextList(raw.highlights),
    ...toTextList(personalInfoRaw.coreCompetencies),
    ...toTextList(personalInfoRaw.keyHighlights),
    ...toTextList(personalInfoRaw.highlights),
  ];

  const coreCompetencies = Array.from(
    new Set(mergedHighlights.map((item) => item.trim()).filter(Boolean)),
  );

  const summaryFromPersonal =
    typeof personalInfoRaw.summary === "string" ? personalInfoRaw.summary : "";

  return {
    ...input,
    summary: input.summary || input.summaryNotes || summaryFromPersonal || "",
    coreCompetencies,
  };
}

export async function renderCvToHtml(
  cvData: CVData,
  templateId: string = DEFAULT_TEMPLATE,
): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");

  // Signal to DocImage to use a plain <img> tag
  const pdfGlobal = globalThis as typeof globalThis & {
    IS_PDF_MODE?: boolean;
  };
  pdfGlobal.IS_PDF_MODE = true;

  // Dynamically load the resume template component
  const template =
    templateComponents[templateId] || templateComponents[DEFAULT_TEMPLATE];
  const { default: ResumeComponent } = await template.resume();

  const normalizedCvData = normalizeCvDataForPdf(cvData);

  // Render resume page
  const resumeHtml = renderToStaticMarkup(
    <ResumeComponent data={normalizedCvData} />,
  );

  // Render cover letter page (if present) — uses the unified design for all templates
  let coverLetterHtml = "";
  if (normalizedCvData.coverLetter) {
    coverLetterHtml = renderToStaticMarkup(
      <UnifiedCoverLetter
        coverLetter={normalizedCvData.coverLetter}
        personalInfo={normalizedCvData.personalInfo}
      />,
    );
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm;
          }
          body { -webkit-print-color-adjust: exact; }
          .pdf-page-break { page-break-before: always; }
          
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            /* Adjust template roots styled with min-h-[297mm] to fit within printable height */
            div[class*="min-h-[297mm]"], .min-h-\\[297mm\\] {
              min-height: 100% !important;
              height: auto !important;
            }
          }
          
          /* Force bullet points visibility in print/PDF for all templates using list-disc */
          ul.list-disc, .list-disc {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin-left: 0.5rem !important;
          }
          ul.list-disc li, .list-disc li {
            display: list-item !important;
            list-style-type: disc !important;
          }
          
          /* Golden, Elegant & Modern Dark template specific background for full-page persistence */
          ${
            templateId === "golden" ||
            templateId === "elegant" ||
            templateId === "modern-dark"
              ? `
            body {
              background: ${
                templateId === "golden"
                  ? "linear-gradient(to right, #f3f4f6 33.333333%, white 33.333333%) !important;"
                  : templateId === "modern-dark"
                    ? "white !important;"
                    : "white !important;"
              }
            }
          `
              : ""
          }
        </style>
        <script>
            // Configure Tailwind to match your theme
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '${THEME.colors.primary}',
                    secondary: '${THEME.colors.secondary}',
                    teal: {
                      600: '${THEME.colors.teal[600]}', 
                    }
                  }
                }
              }
            }
        </script>
      </head>
      <body>
        ${resumeHtml}
        ${coverLetterHtml ? `<div class="pdf-page-break"></div>${coverLetterHtml}` : ""}
      </body>
    </html>
  `;
}
