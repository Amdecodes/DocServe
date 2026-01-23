import "server-only";
import { CVData } from "@/types/cv";
import { templateComponents, DEFAULT_TEMPLATE } from "@/config/templates";

export async function renderCvToHtml(
  cvData: CVData,
  templateId: string = DEFAULT_TEMPLATE,
): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");

  // Dynamically load the template component
  const loadComponent =
    templateComponents[templateId] || templateComponents[DEFAULT_TEMPLATE];
  const { default: TemplateComponent } = await loadComponent();

  const componentHtml = renderToStaticMarkup(
    <TemplateComponent data={cvData} />,
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          /* Fix for printing backgrounds/images opacity */
        </style>
        <script>
            // Configure Tailwind to match your theme
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    teal: {
                      600: '#0d9488', // Match your teal-600
                    }
                  }
                }
              }
            }
        </script>
      </head>
      <body>
        ${componentHtml}
      </body>
    </html>
  `;
}
