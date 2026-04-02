import "server-only";
import { CVData } from "@/types/cv";
import { THEME } from "@/config/theme";
import { templateComponents, DEFAULT_TEMPLATE } from "@/config/templates";
import { UnifiedCoverLetter } from "@/components/cv/preview/layouts/UnifiedCoverLetter";

export async function renderCvToHtml(
  cvData: CVData,
  templateId: string = DEFAULT_TEMPLATE,
): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");

  // Signal to DocImage to use a plain <img> tag
  (global as any).IS_PDF_MODE = true;


  // Dynamically load the resume template component
  const template =
    templateComponents[templateId] || templateComponents[DEFAULT_TEMPLATE];
  const { default: ResumeComponent } = await template.resume();

  // Render resume page
  const resumeHtml = renderToStaticMarkup(<ResumeComponent data={cvData} />);

  // Render cover letter page (if present) — uses the unified design for all templates
  let coverLetterHtml = "";
  if (cvData.coverLetter) {
    coverLetterHtml = renderToStaticMarkup(
      <UnifiedCoverLetter
        coverLetter={cvData.coverLetter}
        personalInfo={cvData.personalInfo}
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
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .pdf-page-break { page-break-before: always; }
          
          /* Golden, Elegant & Modern Dark template specific background for full-page persistence */
          ${(templateId === 'golden' || templateId === 'elegant' || templateId === 'modern-dark') ? `
            body {
              background: ${
                templateId === 'golden' 
                  ? 'linear-gradient(to right, #f3f4f6 33.333333%, white 33.333333%) !important;'
                  : templateId === 'modern-dark'
                    ? 'white !important;'
                    : 'white !important;'
              }
            }
          ` : ''}
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
