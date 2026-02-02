import { AGREEMENT_TEMPLATES } from "@/config/agreements";

// Clean, standard A4 HTML wrapper for legal documents - no fancy styling
const HTML_SHELL = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;700&family=Times+New+Roman&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 20mm 25mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Noto Sans Ethiopic', 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .agreement-container {
      max-width: 100%;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 14pt;
      font-weight: bold;
      text-decoration: underline;
    }
    
    .variable {
      font-weight: bold;
      text-decoration: underline;
    }
    
    p {
      margin-bottom: 12px;
      text-align: justify;
    }
  </style>
</head>
<body>
  <div class="agreement-container">
    ${content}
  </div>
</body>
</html>
`;

export async function renderAgreementToHtml(
  formData: Record<string, string | number | undefined>,
  templateId: string,
): Promise<string> {
  const template = AGREEMENT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  let content = template.content;

  // Sort variables to avoid partial replacements match issues
  const sortedVars = [...template.variables].sort(
    (a, b) => b.key.length - a.key.length,
  );

  sortedVars.forEach((v) => {
    let val = formData[v.key];
    if (!val) val = "__________________"; // Fallback line if empty

    // Replace with bolded value spans
    content = content
      .split(`{${v.key}}`)
      .join(`<span class="variable">${val}</span>`);
  });

  // Convert newlines to paragraphs with proper formatting
  // Split by double newline for paragraphs
  const paragraphs = content.split("\n\n").filter(p => p.trim());
  
  const htmlContent = `
    <h1>${template.title}</h1>
    ${paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("\n    ")}
  `;

  return HTML_SHELL(htmlContent, template.title);
}
