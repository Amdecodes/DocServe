import "server-only";
import { CVData } from "@/types/cv";
import { THEME } from "@/config/theme";
import { templateComponents, DEFAULT_TEMPLATE } from "@/config/templates";

export async function renderCvToHtml(
  cvData: CVData,
  templateId: string = DEFAULT_TEMPLATE,
): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");

  // Dynamically load the template components
  const template =
    templateComponents[templateId] || templateComponents[DEFAULT_TEMPLATE];
  const { default: ResumeComponent } = await template.resume();
  const { default: CoverLetterComponent } = await template.coverLetter();

  // Render resume page
  const resumeHtml = renderToStaticMarkup(<ResumeComponent data={cvData} />);

  // Render cover letter page (if present)
  let coverLetterHtml = "";
  if (cvData.coverLetter) {
    coverLetterHtml = renderToStaticMarkup(
      <CoverLetterComponent
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
                    ? '#000000 !important;'
                    : 'white !important;'
              }
              min-height: 100vh;
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
